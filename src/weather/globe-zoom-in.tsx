import { CalculateMetadataFunction } from "remotion";
import { Easing } from "remotion";
import { useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";
import { MapboxMap, MapBoxMapRef } from "../lib/map";
import {
  useAnimation,
  withParallel,
  withSequence,
  withTiming,
} from "../lib/animations";
import { coordinatesSchema, markerSchema } from "../lib/types";
import { mapStyleConfigSchema } from "../lib/map/types";
import { z } from "zod";
import { computeMapCenter } from "../lib/map/compute-map-center";
import { getMaxZoom } from "../lib/map/get-max-zoom";

export const globeZoomInSchema = z.object({
  centerCoordinatesOverride: coordinatesSchema.nullable(),
  mapStyleConfig: mapStyleConfigSchema,
  markers: z.array(markerSchema),
  defaultedCenterCoordinates: coordinatesSchema.nullable(),
  maxZoom: z.number(),
  durationInFrames: z.number().optional(),
  fps: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type GlobeZoomInProps = z.infer<typeof globeZoomInSchema>;

export const calculateGlobeZoomInMetadata: CalculateMetadataFunction<
  GlobeZoomInProps
> = ({ props }) => {
  const mapCenterCoordinates = computeMapCenter(
    props.markers || [],
    props.centerCoordinatesOverride,
  );
  return {
    durationInFrames: props.durationInFrames || 150,
    fps: props.fps || 30,
    width: props.width || 1920,
    height: props.height || 1080,
    props: {
      ...props,
      mapCenterCoordinates:
        props.centerCoordinatesOverride || mapCenterCoordinates,
    },
  };
};

type MainProps = GlobeZoomInProps & {
  mapCenterCoordinates?: z.infer<typeof coordinatesSchema>;
};

export const GlobeZoomIn = ({
  mapStyleConfig,
  markers = [],
  mapCenterCoordinates,
  maxZoom: maxAskedZoom,
}: MainProps) => {
  const centerCoordinates = useMemo(() => {
    return coordinatesSchema.parse(mapCenterCoordinates);
  }, [mapCenterCoordinates]);

  const { fps, width, height } = useVideoConfig();
  const map = useRef<MapBoxMapRef>(null);
  const globeZoomDuration = fps * 2;

  const maxPossibleZoom = getMaxZoom({
    markers,
    centerCoordinates,
    height,
    width,
  });

  const maxZoom = useMemo(() => {
    if (maxAskedZoom) {
      return Math.min(maxAskedZoom, maxPossibleZoom);
    }
    return maxPossibleZoom;
  }, [maxAskedZoom, maxPossibleZoom]);

  const animation = withParallel(
    withSequence(
      withTiming("globeZoom", {
        from: 0,
        to: maxZoom,
        duration: globeZoomDuration,
      }),
    ),
    withTiming("globeRotation", {
      from: 60,
      to: 0,
      duration: globeZoomDuration - fps / 2,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const { globeZoom, globeRotation } = useAnimation(animation);

  return (
    <MapboxMap
      ref={map}
      centerCoordinates={centerCoordinates}
      projectionName="globe"
      mapStyleConfig={mapStyleConfig}
      markers={markers}
      globeZoomDuration={globeZoomDuration}
      globeZoom={globeZoom}
      globeRotation={globeRotation}
    />
  );
};
