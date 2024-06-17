import ThunderstormsRain from "@bybas/weather-icons/production/fill/all/thunderstorms-rain.svg";
import Snow from "@bybas/weather-icons/production/fill/all/snow.svg";
import Thunderstorms from "@bybas/weather-icons/production/fill/all/thunderstorms.svg";
import NotAvailable from "@bybas/weather-icons/production/fill/all/not-available.svg";
import Fog from "@bybas/weather-icons/production/fill/all/fog.svg";
import ExtremeRain from "@bybas/weather-icons/production/fill/all/thunderstorms-rain.svg";
import PartlyCloudyDayRain from "@bybas/weather-icons/production/fill/all/partly-cloudy-day-rain.svg";
import Sleet from "@bybas/weather-icons/production/fill/all/sleet.svg";
import ClearDay from "@bybas/weather-icons/production/fill/all/clear-day.svg";
import Rain from "@bybas/weather-icons/production/fill/all/rain.svg";
import Drizzle from "@bybas/weather-icons/production/fill/all/drizzle.svg";
import Overcast from "@bybas/weather-icons/production/fill/all/overcast.svg";
import ThunderstormsSnow from "@bybas/weather-icons/production/fill/all/thunderstorms-snow.svg";
import Mist from "@bybas/weather-icons/production/fill/all/mist.svg";
import Cloudy from "@bybas/weather-icons/production/fill/all/cloudy.svg";
import PartlyCloudyDaySnow from "@bybas/weather-icons/production/fill/all/partly-cloudy-day-snow.svg";

import { WeatherCondition } from "./weather";

export function mapWeatherIcon(code: WeatherCondition) {
  switch (code) {
    case WeatherCondition.Sunny:
      return ClearDay;
    case WeatherCondition.PartlyCloudy:
      return Cloudy;
    case WeatherCondition.Cloudy:
      return Overcast;
    case WeatherCondition.Overcast:
      return Overcast;
    case WeatherCondition.Mist:
      return Mist;
    case WeatherCondition.PatchyRainPossible:
      return PartlyCloudyDayRain;
    case WeatherCondition.PatchySnowPossible:
      return PartlyCloudyDaySnow;
    case WeatherCondition.PatchySleetPossible:
      return Sleet;
    case WeatherCondition.PatchyFreezingDrizzlePossible:
      return Drizzle;
    case WeatherCondition.ThunderyOutbreaksPossible:
      return Thunderstorms;
    case WeatherCondition.BlowingSnow:
      return Snow;
    case WeatherCondition.Blizzard:
      return Snow;
    case WeatherCondition.Fog:
      return Fog;
    case WeatherCondition.FreezingFog:
      return Fog;
    case WeatherCondition.PatchyLightDrizzle:
      return Drizzle;
    case WeatherCondition.LightDrizzle:
      return Drizzle;
    case WeatherCondition.FreezingDrizzle:
      return Drizzle;
    case WeatherCondition.HeavyFreezingDrizzle:
      return Drizzle;
    case WeatherCondition.PatchyLightRain:
      return Rain;
    case WeatherCondition.LightRain:
      return Rain;
    case WeatherCondition.ModerateRainAtTimes:
      return Rain;
    case WeatherCondition.ModerateRain:
      return Rain;
    case WeatherCondition.HeavyRainAtTimes:
      return Rain;
    case WeatherCondition.HeavyRain:
      return ExtremeRain;
    case WeatherCondition.LightFreezingRain:
      return ExtremeRain;
    case WeatherCondition.ModerateOrHeavyFreezingRain:
      return ExtremeRain;
    case WeatherCondition.LightSleet:
      return Sleet;
    case WeatherCondition.ModerateOrHeavySleet:
      return Sleet;
    case WeatherCondition.PatchyLightSnow:
      return Snow;
    case WeatherCondition.LightSnow:
      return Snow;
    case WeatherCondition.PatchyModerateSnow:
      return Snow;
    case WeatherCondition.ModerateSnow:
      return Snow;
    case WeatherCondition.PatchyHeavySnow:
      return Snow;
    case WeatherCondition.HeavySnow:
      return Snow;
    case WeatherCondition.IcePellets:
      return Sleet;
    case WeatherCondition.LightRainShower:
      return Rain;
    case WeatherCondition.ModerateOrHeavyRainShower:
      return ExtremeRain;
    case WeatherCondition.TorrentialRainShower:
      return ExtremeRain;
    case WeatherCondition.LightSleetShowers:
      return Sleet;
    case WeatherCondition.ModerateOrHeavySleetShowers:
      return Sleet;
    case WeatherCondition.LightSnowShowers:
      return Snow;
    case WeatherCondition.ModerateOrHeavySnowShowers:
      return Snow;
    case WeatherCondition.LightShowersOfIcePellets:
      return Sleet;
    case WeatherCondition.ModerateOrHeavyShowersOfIcePellets:
      return Sleet;
    case WeatherCondition.PatchyLightRainWithThunder:
      return Thunderstorms;
    case WeatherCondition.ModerateOrHeavyRainWithThunder:
      return ThunderstormsRain;
    case WeatherCondition.PatchyLightSnowWithThunder:
      return ThunderstormsSnow;
    case WeatherCondition.ModerateOrHeavySnowWithThunder:
      return ThunderstormsSnow;
    default:
      return NotAvailable;
  }
}
