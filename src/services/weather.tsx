import axios from "axios";

export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface Forecast {
  forecastday: ForecastDay[];
}

export enum WeatherCondition {
  Sunny = 1000,
  PartlyCloudy = 1003,
  Cloudy = 1006,
  Overcast = 1009,
  Mist = 1030,
  PatchyRainPossible = 1063,
  PatchySnowPossible = 1066,
  PatchySleetPossible = 1069,
  PatchyFreezingDrizzlePossible = 1072,
  ThunderyOutbreaksPossible = 1087,
  BlowingSnow = 1114,
  Blizzard = 1117,
  Fog = 1135,
  FreezingFog = 1147,
  PatchyLightDrizzle = 1150,
  LightDrizzle = 1153,
  FreezingDrizzle = 1168,
  HeavyFreezingDrizzle = 1171,
  PatchyLightRain = 1180,
  LightRain = 1183,
  ModerateRainAtTimes = 1186,
  ModerateRain = 1189,
  HeavyRainAtTimes = 1192,
  HeavyRain = 1195,
  LightFreezingRain = 1198,
  ModerateOrHeavyFreezingRain = 1201,
  LightSleet = 1204,
  ModerateOrHeavySleet = 1207,
  PatchyLightSnow = 1210,
  LightSnow = 1213,
  PatchyModerateSnow = 1216,
  ModerateSnow = 1219,
  PatchyHeavySnow = 1222,
  HeavySnow = 1225,
  IcePellets = 1237,
  LightRainShower = 1240,
  ModerateOrHeavyRainShower = 1243,
  TorrentialRainShower = 1246,
  LightSleetShowers = 1249,
  ModerateOrHeavySleetShowers = 1252,
  LightSnowShowers = 1255,
  ModerateOrHeavySnowShowers = 1258,
  LightShowersOfIcePellets = 1261,
  ModerateOrHeavyShowersOfIcePellets = 1264,
  PatchyLightRainWithThunder = 1273,
  ModerateOrHeavyRainWithThunder = 1276,
  PatchyLightSnowWithThunder = 1279,
  ModerateOrHeavySnowWithThunder = 1282,
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    condition: {
      text: string;
      code: WeatherCondition;
    };
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
}

export interface Current {
  feelslike_c: number;
  condition: {
    text: string;
  };
}

export interface WeatherInfo {
  location: Location;
  current: Current;
  forecast: Forecast;
}

export async function getWeatherInfo(city: string): Promise<WeatherInfo> {
  const url = new URL("http://api.weatherapi.com/v1/forecast.json");
  url.searchParams.append("key", process.env.WEATHER_API_KEY!);
  url.searchParams.append("q", city);
  url.searchParams.append("days", "3");
  url.searchParams.append("aqi", "no");

  const response = await axios.get(url.toString());
  return response.data;
}
