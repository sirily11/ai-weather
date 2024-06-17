import {z} from 'zod';
import {CustomMapStyles, MapboxMapStyles} from './constants';

export const mapStyleConfigSchema = z.object({
	name: z.enum([...MapboxMapStyles, ...CustomMapStyles]),
	hideFrontiers: z.boolean().optional(),
});

export type MapStyleConfig = z.infer<typeof mapStyleConfigSchema>;

export type MapStylesName = MapStyleConfig['name'];

export const projectionSchema = z.object({
	name: z.enum([
		'albers',
		'equalEarth',
		'equirectangular',
		'lambertConformalConic',
		'mercator',
		'naturalEarth',
		'winkelTripel',
		'globe',
	]),
	center: z.array(z.number()).optional(),
	parallels: z.array(z.number()).optional(),
});

export type Projection = z.infer<typeof projectionSchema>;
