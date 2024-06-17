import { AbsoluteFill, staticFile } from "remotion";
import { spring } from "remotion";
import { useVideoConfig } from "remotion";
import { interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";

loadFont({
  family: "Inter",
  url: staticFile("NotoSansSC-Regular.ttf"),
}).then(() => console.log("Font loaded"));

interface Props {
  city: string;
}

export function Title(props: Props) {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 30], [0, 1]);
  const fadeOut = interpolate(frame, [60, 90], [1, 0]);
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
  });

  return (
    <AbsoluteFill
      style={{
        flex: 1,
        textAlign: "center",
        justifyContent: "center",
        fontSize: 70,
      }}
    >
      <h1
        style={{
          opacity: frame < 30 ? fadeIn : fadeOut,
          fontFamily: "Inter",
          transform: `scale(${scale})`,
        }}
        className="text-red-500"
      >
        {props.city}
        未来三天的天气预报
      </h1>
    </AbsoluteFill>
  );
}
