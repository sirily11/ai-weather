import {Easing, SpringConfig, useVideoConfig} from 'remotion';
import {interpolate, spring, useCurrentFrame, measureSpring} from 'remotion';
import {
	AnimationNode,
	EasingFunction,
	Marker,
	Parallel,
	Sequence,
	Spring,
	Stagger,
	Timelines,
	Timing,
	Vector,
} from './interface';

import {CLAMP} from './Options';

export interface Progressable {
	progress: number;
}

const DELAY = '__delay__';

export const withStagger = <T extends string>(
	delay: number,
	...children: AnimationNode<T>[]
): Stagger<T> => ({
	type: 'stagger',
	delay,
	children,
});

const isStagger = <T extends string>(
	node: AnimationNode<T>
): node is Stagger<T> => node.type === 'stagger';

export const withSpring = <T extends string>(
	name: T,
	config?: {
		from?: number;
		to?: number;
		config?: Partial<SpringConfig>;
	}
): Spring<T> => ({
	type: 'spring',
	name,
	from: config?.from ?? 0,
	to: config?.to ?? 1,
	config: config?.config,
});

export const isSpring = <T extends string>(
	node: AnimationNode<T>
): node is Spring<T> => node.type === 'spring';

export const withMarker = <T extends string>(name: T): Marker<T> => ({
	type: 'marker',
	name,
});

export const isMarker = <T extends string>(
	node: AnimationNode<T>
): node is Marker<T> => node.type === 'marker';

export const withSequence = <T extends string>(
	...children: AnimationNode<T>[]
): Sequence<T> => ({
	type: 'sequence',
	children,
});

const isSequence = <T extends string>(
	node: AnimationNode<T>
): node is Sequence<T> => node.type === 'sequence';

export const withParallel = <T extends string>(
	...children: AnimationNode<T>[]
): Parallel<T> => ({
	type: 'parallel',
	children,
});

const isParallel = <T extends string>(
	node: AnimationNode<T>
): node is Parallel<T> => node.type === 'parallel';

export const withTiming = <T extends string>(
	name: T,
	config?: {
		from?: number;
		to?: number;
		duration?: number;
		easing?: EasingFunction;
	}
): Timing<T> => ({
	type: 'timing',
	name,
	from: config?.from ?? 0,
	to: config?.to ?? 1,
	duration: config?.duration ?? 30,
	easing: config?.easing ?? (Easing.inOut(Easing.ease) as EasingFunction),
});

const isTiming = <T extends string>(
	node: AnimationNode<T>
): node is Timing<T> => node.type === 'timing';

export const withDelay = (duration = 60) => withTiming(DELAY, {duration});

export const springVector = <X extends string, Y extends string>(
	x: X,
	y: Y,
	positions: Vector[],
	offset: Vector = {x: 0, y: 0}
) =>
	withSequence(
		...positions.map((position, i) =>
			withParallel<X | Y>(
				withSpring(x, {
					from: i === 0 ? offset.x : positions[i - 1].x,
					to: position.x,
				}),
				withSpring(y, {
					from: i === 0 ? offset.y : positions[i - 1].y,
					to: position.y,
				})
			)
		)
	);

export const moveVector = <X extends string, Y extends string>(
	x: X,
	y: Y,
	positions: Vector[],
	offset: Vector = {x: 0, y: 0},
	duration = 30
// eslint-disable-next-line max-params
) =>
	withSequence(
		...positions.map((position, i) =>
			withParallel<X | Y>(
				withTiming(x, {
					from: i === 0 ? offset.x : positions[i - 1].x,
					to: position.x,
					duration,
				}),
				withTiming(y, {
					from: i === 0 ? offset.y : positions[i - 1].y,
					to: position.y,
					duration,
				})
			)
		)
	);

export const moveVectorSpring = <X extends string, Y extends string>(
	x: X,
	y: Y,
	positions: Vector[],
	offset: Vector = {x: 0, y: 0}
) =>
	withSequence(
		...positions.map((position, i) =>
			withParallel<X | Y>(
				withSpring(x, {
					from: i === 0 ? offset.x : positions[i - 1].x,
					to: position.x,
				}),
				withSpring(y, {
					from: i === 0 ? offset.y : positions[i - 1].y,
					to: position.y,
				})
			)
		)
	);

export const computeDuration = <T extends string>(
	root: AnimationNode<T>,
	frameRate = 30
): number => {
	const timelines: Timelines = {};
	process(root, timelines, frameRate, 0);
	return Math.floor(
		Math.max(
			...Object.values(timelines).map(
				(timeline) => timeline[timeline.length - 1].inputRange[1]
			)
		)
	);
};

const process = <T extends string>(
	root: AnimationNode<T>,
	timelines: Timelines,
	frameRate: number,
	frame: number
) => {
	if (isStagger(root)) {
		root.children.forEach((child, index) => {
			process(child, timelines, frameRate, frame + index * root.delay);
		});
	} else if (isParallel(root)) {
		root.children.forEach((child) => {
			process(child, timelines, frameRate, frame);
		});
	} else if (isSequence(root)) {
		root.children.reduce((delay, child) => {
			process(child, timelines, frameRate, frame + delay);
			return delay + computeDuration(child, frameRate);
		}, 0);
	} else if (isSpring(root)) {
		const {config, from, to, name} = root;
		if (!timelines[name]) {
			timelines[name] = [];
		}
		timelines[name].push({
			inputRange: [
				frame,
				frame + measureSpring({fps: frameRate, config, from, to}),
			],
			outputRange: [from, to],
			config: config ?? {},
		});
	} else if (isTiming(root)) {
		const {easing, duration, from, to, name} = root;
		if (!timelines[name]) {
			timelines[name] = [];
		}
		timelines[name].push({
			inputRange: [frame, frame + duration],
			outputRange: [from, to],
			easing,
		});
	} else if (isMarker(root)) {
		const {name} = root;
		if (!timelines[name]) {
			timelines[name] = [];
		}
		timelines[name].push({
			inputRange: [0, 1],
			outputRange: [frame, frame],
		});
	}
};

export const useAnimation = <T extends string>(
	root: AnimationNode<T>,
	still?: number
) => {
	const currentFrame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const frame = still ?? currentFrame;
	const result: {[name: string]: number} = {};
	const timelines: Timelines = {};
	process(root, timelines, fps, 0);
	Object.keys(timelines).forEach((name) => {
		const timeline = timelines[name];
		const before = timeline.filter((event) => event.inputRange[1] < frame);
		const events = timeline.filter(
			(e) => frame >= e.inputRange[0] && frame <= e.inputRange[1]
		);
		const event =
			// eslint-disable-next-line no-nested-ternary
			events.length === 0
				? before.length === 0
					? timeline[0]
					: before[before.length - 1]
				: events[0];
		if (event.config) {
			result[name] =
				Math.round(
					spring({
						fps,
						frame: frame - event.inputRange[0],
						from: event.outputRange[0],
						to: event.outputRange[1],
						config: event.config,
					}) * 10000
				) / 10000;
		} else {
			result[name] = interpolate(frame, event.inputRange, event.outputRange, {
				...CLAMP,
				easing: event.easing,
			});
		}
	});
	return result as {[name in T]: number};
};
