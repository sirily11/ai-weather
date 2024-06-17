import {Marker} from '../types';

export const getMaxLatDistanceFromCenterLat = (
	centerLat: number | undefined,
	markers: Array<Marker>,
) => {
	if (!centerLat) {
		return 0;
	}
	const maxLat = Math.max(...markers.map(({coordinates}) => coordinates.lat));
	const minLat = Math.min(...markers.map(({coordinates}) => coordinates.lat));

	return Math.max(Math.abs(centerLat - maxLat), Math.abs(centerLat - minLat));
};

export const getMaxLngDistanceFromCenterLng = (
	centerLng: number | undefined,
	markers: Array<Marker>,
) => {
	if (!centerLng) {
		return 0;
	}
	const maxLng = Math.max(...markers.map(({coordinates}) => coordinates.lng));
	const minLng = Math.min(...markers.map(({coordinates}) => coordinates.lng));
	return Math.max(Math.abs(centerLng - maxLng), Math.abs(centerLng - minLng));
};
