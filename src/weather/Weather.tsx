// @flow

import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { AbsoluteFill, getInputProps } from "remotion";
import { Audio } from "remotion";
import { SequenceOne } from "./part1/SequenceOne";
import { springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { getWeatherInfo, WeatherInfo } from "../services/weather";
import aiResponseStatic from "../services/mock.ai.response.json";
import { AIWeatherResponse, generateWeatherResponse } from "../services/ai";
import { WeatherReport } from "./part2/WeatherReport";

function Fill(props: { color: string }) {
  return <AbsoluteFill style={{ backgroundColor: props.color }} />;
}

export function Weather() {
  const { city } = getInputProps();
  const [handle] = useState(() => delayRender());
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>();
  const [aiResponse, setAIResponse] = useState<AIWeatherResponse[]>([]);

  useEffect(() => {
    (async () => {
      const info = await getWeatherInfo(city as string)
        .then((data) => {
          return data;
        })
        .catch((e) => {
          console.error(e);
          return null;
        });

      if (!info) {
        return;
      }
      // const response = await generateWeatherResponse(info as WeatherInfo);
      // setAIResponse(response);
      setWeatherInfo(info);
      setAIResponse(aiResponseStatic as unknown as AIWeatherResponse[]);
      continueRender(handle);
    })();
  }, []);

  if (!weatherInfo) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontSize: 100,
        backgroundColor: "white",
      }}
    >
      <Audio src="https://pub-3fcb239d0b754e8faed02041af2e2ce8.r2.dev/rainny-bg.mp3" />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={150}>
          <SequenceOne location={weatherInfo.location} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={springTiming({ config: { damping: 200 } })}
          presentation={fade()}
        />
        <TransitionSeries.Sequence durationInFrames={30}>
          <Fill color="white" />
        </TransitionSeries.Sequence>
        {aiResponse
          .map((response, index) => [
            <TransitionSeries.Sequence
              key={`sequence-${index}`}
              durationInFrames={600}
            >
              <WeatherReport
                key={index}
                report={response as unknown as AIWeatherResponse}
              />
            </TransitionSeries.Sequence>,
            <TransitionSeries.Transition
              key={`transition-${index}`}
              timing={springTiming({ config: { damping: 200 } })}
              presentation={fade()}
            />,
          ])
          .flat()}
      </TransitionSeries>
    </AbsoluteFill>
  );
}
