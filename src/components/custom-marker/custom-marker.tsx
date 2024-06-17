import {Easing, useVideoConfig} from 'remotion';
import {
	useAnimation,
	withSequence,
	withStagger,
	withTiming,
} from '../../lib/animations';
import {useEffect, useMemo} from 'react';
import {createPortal} from 'react-dom';
import mapboxgl from 'mapbox-gl';

const MAIN_COLOR = '#3B82EB';
const ICON_SIZE = 50;
const FONT_SIZE = 32;
const LABEL_PADDING = 24;

type Props = {
	labelText?: string;
	coordinates: {
		lng: number;
		lat: number;
	};
	map: mapboxgl.Map;
};

export const CustomMarker = ({labelText, coordinates, map}: Props) => {
	const {fps} = useVideoConfig();
	const div = useMemo(() => {
		return document.createElement('div');
	}, []);

	const animation = withSequence(
		withStagger(
			fps / 2,
			withTiming('iconScale', {
				from: 0,
				to: 1,
				duration: (fps * 3) / 4,
				easing: Easing.elastic(1),
			}),
			withTiming('labelClippingPosition', {
				from: 100,
				to: 0,
				duration: fps / 2,
				easing: Easing.out(Easing.ease),
			}),
		),
	);
	const {iconScale, labelClippingPosition} = useAnimation(animation);

	useEffect(() => {
		const marker = new mapboxgl.Marker(div)
			.setLngLat([coordinates.lng, coordinates.lat])
			.setOccludedOpacity(1) // This is needed to avoid the marker flickering
			.addTo(map) as mapboxgl.Marker;

		return () => {
			marker.remove();
		};
	}, [coordinates.lat, coordinates.lng, div, map]);

	return createPortal(
		<div>
			<div
				style={{
					height: ICON_SIZE,
					width: ICON_SIZE,
					marginLeft: -ICON_SIZE / 2,
					marginTop: -ICON_SIZE / 2,
					overflow: 'hidden',
				}}
			>
				<svg
					width={ICON_SIZE * iconScale}
					height={ICON_SIZE * iconScale}
					viewBox="0 0 24 24"
					fill="white"
					xmlns="http://www.w3.org/2000/svg"
					style={{
						filter: 'drop-shadow(0px 3px 12px rgba(74, 67, 86, 0.149))',
						position: 'relative',
						top: ICON_SIZE - ICON_SIZE * iconScale,
						transform: `scale(${iconScale})`,
					}}
				>
					<path
						d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
						stroke={MAIN_COLOR}
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
						stroke={MAIN_COLOR}
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
			{labelText && (
				<div
					style={{
						position: 'absolute',
						top: -ICON_SIZE / 2 - FONT_SIZE - LABEL_PADDING,
						left: ICON_SIZE / 2,
						filter: 'drop-shadow(0px 3px 12px rgba(74, 67, 86, 0.55))',
					}}
				>
					<span
						style={{
							fontSize: FONT_SIZE,
							lineHeight: 1,
							color: 'white',
							fontFamily: 'Arial',
							borderRadius: FONT_SIZE,
							background: MAIN_COLOR,
							padding: `${LABEL_PADDING / 2}px ${LABEL_PADDING}px`,
							clipPath: `inset(0 ${labelClippingPosition}% 0 0)`,
							whiteSpace: 'nowrap',
						}}
					>
						{labelText}
					</span>
				</div>
			)}
		</div>,
		div,
	);
};
