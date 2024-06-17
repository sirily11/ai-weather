import { AbsoluteFill, Sequence } from "remotion";
import { Title } from "./Title";
import { GlobeZoomIn } from "../globe-zoom-in";
import { Location } from "../../services/weather";

interface Props {
  location: Location;
}

export function SequenceOne({ location }: Props) {
  return (
    <AbsoluteFill>
      {process.env.WEBGL === "true" && (
        <Sequence from={30}>
          <AbsoluteFill>
            <GlobeZoomIn
              maxZoom={12}
              mapStyleConfig={{ name: "light-v11" }}
              markers={[
                {
                  label: location.name,
                  coordinates: { lat: location.lat, lng: location.lon },
                },
              ]}
              centerCoordinatesOverride={{
                lat: location.lat,
                lng: location.lon,
              }}
              mapCenterCoordinates={{
                lat: location.lat,
                lng: location.lon,
              }}
              defaultedCenterCoordinates={{
                lat: location.lat,
                lng: location.lon,
              }}
            />
          </AbsoluteFill>
        </Sequence>
      )}
      <AbsoluteFill>
        <Title city={location.name} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
