import mapboxgl from 'mapbox-gl';
import {Coordinates, Marker} from '../types';

export const computeMapCenter = (
	markers: Array<Marker>,
	centerCoordinatesOverride: Coordinates | null,
) => {
	const allCoordinates = [
		...markers
			.filter(
				({coordinates}) =>
					coordinates.lat !== undefined && coordinates.lng !== undefined,
			)
			.map(({coordinates}) => coordinates),
	];

	if (centerCoordinatesOverride) {
		allCoordinates.push(centerCoordinatesOverride);
	}

	const filteredCoordinates = allCoordinates.filter((el) =>
		Boolean(el),
	) as Array<Coordinates>;

	const markerBounds = filteredCoordinates.reduce((bounds, coordinates) => {
		return bounds.extend([coordinates.lng, coordinates.lat]);
	}, new mapboxgl.LngLatBounds());

	return markerBounds.getCenter();
};
