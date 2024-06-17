import { AIWeatherResponse, SuggestionImage } from "../../services/ai";
import { interpolate, staticFile, useCurrentFrame } from "remotion";
import { ArrowDown, ArrowUp } from "iconsax-react";
import { mapWeatherIcon } from "../../services/weather.mapper";
import { WeatherCondition } from "../../services/weather";

type Props = {
  report: AIWeatherResponse;
};

function mapWeatherSuggestion(suggestion: SuggestionImage) {
  switch (suggestion) {
    case SuggestionImage.Coat:
      return staticFile("/coat.webp");
    case SuggestionImage.Safe:
      return staticFile("/safe.webp");
    case SuggestionImage.Sunglasses:
      return staticFile("/sunglasses.webp");
    default:
      return staticFile("/umbrella.webp");
  }
}

export function WeatherCard(props: Props) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [200, 230], [0, 1]);

  const Icon = mapWeatherIcon(
    props.report.forecast?.day.condition.code ?? WeatherCondition.Cloudy,
  );

  const cardPosition = interpolate(frame, [280, 310], [0, -400], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const suggestionOpacity = interpolate(frame, [310, 350], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const card = (
    <div
      style={{
        position: "relative",
        transform: `translateX(${cardPosition}px)`,
      }}
    >
      <div
        style={{
          opacity,
          display: "flex",
          flexDirection: "column",
          fontSize: 40,
          zIndex: 10,
        }}
      >
        <h2
          style={{
            fontSize: 100,
            fontWeight: "bold",
          }}
        >
          {props.report.forecast?.day.avgtemp_c} °C
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <span>{props.report.forecast?.day.maxtemp_c} °C</span>
            <span>
              <ArrowUp
                style={{
                  width: 20,
                  height: 20,
                  fontWeight: "bold",
                }}
              />
            </span>
          </h3>
          <h3
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <span>{props.report.forecast?.day.mintemp_c} °C</span>
            <span>
              <ArrowDown
                style={{
                  width: 20,
                  height: 20,
                  fontWeight: "bold",
                }}
              />
            </span>
          </h3>
        </div>
        {/* eslint-disable-next-line @remotion/warn-native-media-tag */}
        <img
          src={Icon}
          style={{
            width: 200,
            height: 200,
            position: "absolute",
            top: -100,
            left: -100,
          }}
        />
      </div>
    </div>
  );

  const suggestion = (
    <div
      style={{
        position: "absolute",
        top: "30%",
        right: "20%",
        opacity: suggestionOpacity,
      }}
    >
      {/* eslint-disable-next-line @remotion/warn-native-media-tag */}
      <img
        src={mapWeatherSuggestion(props.report.image)}
        style={{
          width: 400,
          height: 400,
        }}
      />
    </div>
  );

  return (
    <div>
      {card}
      {suggestion}
    </div>
  );
}
