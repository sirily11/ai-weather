import { z } from "zod";
import { CalculateMetadataFunction } from "remotion";
import { useVideoConfig } from "remotion";
import { useMemo, useRef } from "react";

import { MapBoxMapRef, MapboxMap } from "../lib/map";
import { coordinatesSchema, markerSchema } from "../lib/types";
import { mapStyleConfigSchema, projectionSchema } from "../lib/map/types";
import { computeMapCenter } from "../lib/map/compute-map-center";
import { getMaxZoom } from "../lib/map/get-max-zoom";

export const worldMapSchema = z.object({
  centerCoordinatesOverride: coordinatesSchema
    .default({
      lat: 48.8566,
      lng: 2.3522,
    })
    .nullable(),
  projection: projectionSchema.optional(),
  mapStyleConfig: mapStyleConfigSchema,
  markers: z.array(markerSchema).optional(),
  maxZoom: z.number().optional(),
  durationInFrames: z.number().optional(),
  fps: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type WorldMapProps = z.infer<typeof worldMapSchema>;

export const calculateWorldMapMetadata: CalculateMetadataFunction<
  WorldMapProps
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

type MainProps = WorldMapProps & {
  mapCenterCoordinates?: z.infer<typeof coordinatesSchema>;
};

export const WorldMap = ({
  projection,
  mapStyleConfig,
  markers = [],
  mapCenterCoordinates,
  maxZoom: maxAskedZoom,
}: MainProps) => {
  const { fps, width, height } = useVideoConfig();
  if (mapStyleConfig && mapStyleConfig.hideFrontiers === undefined) {
    mapStyleConfig.hideFrontiers = true;
  }

  const map = useRef<MapBoxMapRef>(null);

  const centerCoordinates = useMemo(
    () => coordinatesSchema.parse(mapCenterCoordinates),
    [mapCenterCoordinates],
  );

  const maxZoom = useMemo(() => {
    const maxPossibleZoom = getMaxZoom({
      centerCoordinates,
      markers,
      width,
      height,
    });
    if (maxAskedZoom) {
      return Math.min(maxAskedZoom, maxPossibleZoom);
    }
    return maxPossibleZoom;
  }, [centerCoordinates, markers, width, height, maxAskedZoom]);

  return (
    <MapboxMap
      ref={map}
      centerCoordinates={centerCoordinates}
      projectionName={projection?.name}
      mapStyleConfig={mapStyleConfig}
      markers={markers}
      globeZoomDuration={fps * 2}
      globeRotation={0}
      globeZoom={maxZoom}
    />
  );
};
