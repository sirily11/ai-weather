import { AIWeatherResponse } from "../../services/ai";
import { springTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { fade } from "@remotion/transitions/fade";

import { loadFont } from "@remotion/fonts";
import { DateTitle } from "./DateTitle";
import { WeatherCard } from "./WeatherCard";

loadFont({
  family: "Inter",
  url: staticFile("NotoSansSC-Regular.ttf"),
}).then(() => console.log("Font loaded"));

type Props = {
  report: AIWeatherResponse;
};

export function WeatherReport(props: Props) {
  const { durationInFrames } = useVideoConfig();

  return (
    <div>
      {props.report.audio && <Audio src={props.report.audio} />}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={durationInFrames}>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              fontSize: 50,
              backgroundColor: "white",
              fontFamily: "Inter",
            }}
          >
            <DateTitle report={props.report} />
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              fontSize: 30,
              fontFamily: "Inter",
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
    </div>
  );
}
