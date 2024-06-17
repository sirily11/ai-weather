import { AIWeatherResponse } from "../../services/ai";
import { springTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { fade } from "@remotion/transitions/fade";

import { loadFont } from "@remotion/google-fonts/NotoSans";
import { DateTitle } from "./DateTitle";
import { WeatherCard } from "./WeatherCard";

const { fontFamily } = loadFont();

type Props = {
  report: AIWeatherResponse;
};

export function WeatherReport(props: Props) {
  const { durationInFrames } = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={durationInFrames}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            fontSize: 50,
            backgroundColor: "white",
            fontFamily,
          }}
        >
          <DateTitle report={props.report} />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            fontSize: 30,
            fontFamily,
          }}
        >
          <WeatherCard report={props.report} />
        </AbsoluteFill>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={springTiming({ config: { damping: 200 } })}
        presentation={fade()}
      />
    </TransitionSeries>
  );
}
