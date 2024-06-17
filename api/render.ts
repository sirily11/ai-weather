import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { uploadTtsToS3 } from "../src/services/tts";
import * as fs from "node:fs";

interface Opts {
  sessionId: string;
  city: string;
}

/**
 * Render video using Remotion and return the path to the rendered video.
 */
export async function renderVideo({ sessionId, city }: Opts) {
  // The composition you want to render
  const compositionId = "HelloWorld";

  // You only have to create a bundle once, and you may reuse it
  // for multiple renders that you can parametrize using input props.
  const bundleLocation = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
    // If you have a Webpack override, make sure to add it here
    webpackOverride: (config) => config,
  });

  // Parametrize the video by passing props to your component.
  const inputProps = {
    sessionId,
    city,
  };

  // Get the composition you want to render. Pass `inputProps` if you
  // want to customize the duration or other metadata.
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps,
    envVariables: process.env as unknown as Record<string, string>,
  });

  const filename = `${sessionId}.mp4`;

  // Render the video. Pass the same `inputProps` again
  // if your video is parametrized with data.
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: `out/${filename}`,
    inputProps,
    envVariables: process.env as unknown as Record<string, string>,
    concurrency: 1,
  });

  // Read file
  const data = fs.readFileSync(`out/${filename}`);
  return uploadTtsToS3(data, filename);
}
