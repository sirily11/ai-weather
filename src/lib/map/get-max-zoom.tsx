import {viewport} from '@placemarkio/geo-viewport';

import type {Coordinates, Marker} from '../types';
import {
	getMaxLatDistanceFromCenterLat,
	getMaxLngDistanceFromCenterLng,
} from './get-max-distances';

const ZOOM_OFFSET = 2;

export const getMaxZoom = ({
	markers,
	centerCoordinates,
	width,
	height,
}: {
	width: number;
	height: number;
	markers: Array<Marker>;
	centerCoordinates: Coordinates;
}) => {
	const maxLatDistanceFromCenterLat = getMaxLatDistanceFromCenterLat(
		centerCoordinates.lat,
		markers,
	);

	const maxLngDistanceFromCenterLng = getMaxLngDistanceFromCenterLng(
		centerCoordinates.lng,
		markers,
	);

	const bounds = [
		centerCoordinates.lng - maxLngDistanceFromCenterLng * ZOOM_OFFSET,
		centerCoordinates.lat - maxLatDistanceFromCenterLat * ZOOM_OFFSET,
		centerCoordinates.lng + maxLngDistanceFromCenterLng * ZOOM_OFFSET,
		centerCoordinates.lat + maxLatDistanceFromCenterLat * ZOOM_OFFSET,
	] as [number, number, number, number];

	const dimensions = [width, height] as [number, number];

	const p = viewport(bounds, dimensions, {
		minzoom: 0,
		maxzoom: 20,
		tileSize: 512,
		allowFloat: true,
		allowAntiMeridian: true,
	});

	return p.zoom;
};
