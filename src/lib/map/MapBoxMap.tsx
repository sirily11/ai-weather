import { continueRender } from "remotion";
import "./style.css";
import {
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { getMapboxStyle } from "./get-mapbox-style";
import mapboxgl, { Map } from "mapbox-gl";
import { Coordinates, Marker } from "../types";
import { MapStyleConfig } from "./types";
import { AbsoluteFill, Sequence, delayRender, useVideoConfig } from "remotion";
import React from "react";
import { CustomMarker } from "../../components/custom-marker";

const mapboxToken = process.env.REMOTION_MAP_TOKEN as string | undefined;

if (!mapboxToken) {
  throw new Error("Mapbox token not set");
}

mapboxgl.accessToken = mapboxToken;

const countryLayers = [
  "admin-0-boundary-bg",
  "admin-0-boundary-disputed",
  "admin-0-boundary",
  "admin-1-boundary-bg",
  "admin-1-boundary",
  "country-label",
];

export type MapBoxMapRef = {
  map: mapboxgl.Map | null;
};

type Props = {
  centerCoordinates: Coordinates;
  globeZoom: number;
  globeRotation: number;
  markers: Marker[];
  globeZoomDuration: number;
  projectionName?: mapboxgl.Projection["name"];
  mapStyleConfig: MapStyleConfig;
};

const MapboxMapForwardRef: ForwardRefRenderFunction<MapBoxMapRef, Props> = (
  {
    centerCoordinates,
    projectionName = "globe",
    mapStyleConfig,
    markers,
    globeZoomDuration,
    globeRotation,
    globeZoom,
  }: Props,
  passedRef,
) => {
  const [zoom] = useState(() => globeZoom ?? 0);
  const { fps } = useVideoConfig();
  const ref = useRef<HTMLDivElement>(null);
  const mapboxStyle = getMapboxStyle(mapStyleConfig?.name);
  const [map, setMap] = useState<Map | null>(null);
  const [initialReady] = useState(() => delayRender());

  useImperativeHandle(passedRef, () => {
    return {
      map,
    };
  }, [map]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    ref.current.innerHTML = "";
    ref.current.style.width = "100%";
    ref.current.style.height = "100%";
    ref.current.appendChild(div);
    const map = new Map({
      container: div,
      zoom,
      center: [centerCoordinates.lng, centerCoordinates.lat],
      pitch: 0,
      bearing: 0,
      style: mapboxStyle,
      interactive: false,
      fadeDuration: 0,
      attributionControl: false,
      projection: {
        name: projectionName as mapboxgl.Projection["name"],
      },
    });
    setMap(map);
    map.once("idle", () => {
      // Initially, the map might be too small due to a race condition in Mapbox
      map.resize();

      if (!mapStyleConfig.hideFrontiers) {
        return continueRender(initialReady);
      }
      if (!map.isStyleLoaded()) {
        return;
      }

      const style = map.getStyle();

      if (mapStyleConfig.name !== "standard") {
        const layers = style.layers.map((layer) => layer.id);
        console.log("Layers", layers);

        for (const layerName of countryLayers) {
          const layer = (() => {
            try {
              return map.getLayer(layerName);
            } catch (e) {
              return null;
            }
          })();

          if (layer) {
            map.removeLayer(layerName);
          }
        }
        return continueRender(initialReady);
      }

      // @ts-expect-error Mapbox types are wrong
      const layers = style?.imports[0].data.layers;
      // @ts-expect-error Mapbox types are wrong
      const layerImport = style?.imports[0];
      layerImport.data.layers = layers.filter((layer: mapboxgl.AnyLayer) => {
        return countryLayers.indexOf(layer.id) === -1;
      });
      // @ts-expect-error Mapbox types are wrong
      const { imports } = style;
      imports[0] = layerImport;

      const newSytle = {
        ...style,
        imports,
      };
      map.setStyle(newSytle);

      return continueRender(initialReady);
    });
  }, [
    centerCoordinates.lat,
    centerCoordinates.lng,
    initialReady,
    mapboxStyle,
    projectionName,
    zoom,
    mapStyleConfig.hideFrontiers,
    mapStyleConfig.name,
  ]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const handle = delayRender("Zooming...");

    map.setCenter([
      centerCoordinates.lng + globeRotation,
      centerCoordinates.lat,
    ]);
    map.zoomTo(globeZoom, {
      animate: false,
    });

    map.resize();
    map.once("idle", () => {
      continueRender(initialReady);
      return continueRender(handle);
    });
  }, [
    globeZoom,
    globeRotation,
    centerCoordinates,
    mapStyleConfig,
    initialReady,
    map,
  ]);

  return (
    <AbsoluteFill>
      <AbsoluteFill ref={ref} />
      {map
        ? markers.map((marker, index) => {
            const delay = (index * fps) / 2;

            return (
              <Sequence
                key={index}
                from={globeZoomDuration - fps / 2 + delay}
                name={`marker-${index}`}
              >
                <CustomMarker
                  coordinates={marker.coordinates}
                  labelText={marker.label}
                  map={map}
                />
              </Sequence>
            );
          })
        : null}
    </AbsoluteFill>
  );
};

export const MapboxMap = React.forwardRef(MapboxMapForwardRef);
