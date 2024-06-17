import { ForecastDay, WeatherInfo } from "./weather";
import OpenAI from "openai";
import dayjs from "dayjs";

export enum SuggestionImage {
  Umbrella = "umbrella",
  Sunglasses = "sunglasses",
  Coat = "coat",
  Safe = "safe",
}

export interface AIWeatherResponse {
  /**
   * Title displays on the screen
   */
  title: string;
  /**
   * Dialogue used to generate the voiceover
   */
  dialogue: string;
  /**
   * Forecast info used to render the weather forecast.
   */
  forecast?: ForecastDay;

  /**
   * Image name used to render the weather suggestion
   */
  image: SuggestionImage[];

  /**
   * Audio file url
   */
  audio?: string;
}

export type AIResponse = AIWeatherResponse;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateWeatherResponse(
  weatherInfo: WeatherInfo,
): Promise<AIWeatherResponse[]> {
  const info = {
    location: {
      city: weatherInfo.location.name,
      country: weatherInfo.location.country,
    },
    current: {
      temp: weatherInfo.current.feelslike_c,
      condition: weatherInfo.current.condition.text,
    },
    forecast: weatherInfo.forecast.forecastday.map((f) => ({
      date: f.date,
      maxTemp: f.day.maxtemp_c,
      minTemp: f.day.mintemp_c,
      condition: f.day.condition.text,
      code: f.day.condition.code,
    })),
  };
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    // eslint-disable-next-line camelcase
    tool_choice: {
      type: "function",
      function: {
        name: "weather_report",
      },
    },
    tools: [
      {
        type: "function",
        function: {
          name: "weather_report",
          description:
            "Generate a daily weather report based on the provided weather information for video production. The content should in Chinese.",
          parameters: {
            type: "object",
            properties: {
              info: {
                type: "array",
                items: {
                  type: "object",
                  required: ["date", "title", "dialogue", "image"],
                  properties: {
                    date: {
                      type: "string",
                      format: "date",
                      description:
                        "The date of the weather report in YYYY-MM-DD",
                    },
                    title: {
                      type: "string",
                      description:
                        "The title of the weather report used to display on the screen. Like regular weather report, it should be short and informative. Vary the title based on the weather condition.",
                    },
                    dialogue: {
                      type: "string",
                      description:
                        "The dialogue used to generate the voiceover for the weather report. Give detailed suggestions on the weather condition at the end of the dialogue. Should be different from other weather reports. Don't include greetings at the beginning since this is a continuation of the previous dialogue. Include date at the beginning.",
                    },
                    image: {
                      type: "array",
                      description:
                        "The image name used to render the weather suggestion",
                      items: {
                        type: "string",
                        description:
                          "The name of the image used to render the weather suggestion",
                        enum: ["umbrella", "sunglasses", "coat", "safe"],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
    messages: [
      {
        role: "system",
        content:
          "你是一个天气预报主播，你能够从提供的天气预报信息中给出必要的素材提供节目制作需要",
      },
      {
        role: "user",
        content: `下面是关于${info.location.city}的天气预报信息，以json格式提供: ${JSON.stringify(info)}`,
      },
    ],
  });

  const toolResponse =
    response.choices[0].message.tool_calls![0].function.arguments;

  const parsedResponse = JSON.parse(toolResponse as string).info as {
    date: string;
    title: string;
    dialogue: string;
    image: string;
  }[];

  // Map the response to the AIWeatherResponse type and add the forecast info

  const data = weatherInfo.forecast.forecastday.map((f) => {
    const parsedDate = dayjs(f.date).format("YYYY-MM-DD");
    const found = parsedResponse.find(
      (r) => dayjs(r.date).format("YYYY-MM-DD") === parsedDate,
    )!;
    return {
      title: found.title,
      dialogue: found.dialogue,
      image: found.image,
      forecast: f,
    };
  });

  return data as unknown as AIWeatherResponse[];
}
