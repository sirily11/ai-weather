import mapboxgl from 'mapbox-gl';
import {CustomMapStyles, MapboxMapStyles} from './constants';

export const getMapboxStyle = (
	mapStyle?: (typeof MapboxMapStyles)[number] | (typeof CustomMapStyles)[number]
): mapboxgl.MapboxOptions['style'] => {
	if (!mapStyle) {
		return 'mapbox://styles/mapbox/streets-v12';
	}

	if (MapboxMapStyles.includes(mapStyle as (typeof MapboxMapStyles)[number])) {
		return `mapbox://styles/mapbox/${mapStyle}`;
	}

	return `mapbox://styles/${mapStyle}`;

};
