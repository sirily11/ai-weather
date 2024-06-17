import {Coordinates} from '../types';

export const getCoordinatesBarycenter = (
	coordinates: Coordinates[]
): Coordinates => {
	const lat =
		coordinates.reduce((acc, {lat}) => acc + lat, 0) / coordinates.length;
	const lng =
		coordinates.reduce((acc, {lng}) => acc + lng, 0) / coordinates.length;
	return {lat, lng};
};
