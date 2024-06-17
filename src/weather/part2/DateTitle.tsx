import { AIWeatherResponse } from "../../services/ai";
import { interpolate, useCurrentFrame } from "remotion";

type Props = {
  report: AIWeatherResponse;
};

export function DateTitle(props: Props) {
  const frame = useCurrentFrame();
  const position = interpolate(frame, [0, 30, 150, 170], [-30, 10, 10, -400], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  const opacitySubtitle = interpolate(frame, [20, 50, 150, 180], [0, 1, 1, 0]);

  return (
    <div
      style={{
        opacity,
      }}
    >
      <h1
        style={{
          transform: `translateY(${position}px)`,
        }}
      >
        {props.report.forecast?.date}
      </h1>
      <h2
        style={{
          opacity: opacitySubtitle,
        }}
      >
        {props.report.title}
      </h2>
    </div>
  );
}
