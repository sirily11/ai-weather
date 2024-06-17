import {z} from 'zod';

export const coordinatesSchema = z.object({
	lat: z.number(),
	lng: z.number(),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;

export const markerSchema = z.object({
	label: z.string(),
	coordinates: coordinatesSchema,
});

export type Marker = z.infer<typeof markerSchema>;
