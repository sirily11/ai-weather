import { SpringConfig } from 'remotion'

export type EasingFunction = (value: number) => number

export interface Point {
	readonly x: number
	readonly y: number
}
export type Vector = Point

type AnimationType =
	| 'stagger'
	| 'parallel'
	| 'sequence'
	| 'spring'
	| 'timing'
	| 'marker'

export interface AnimationNode<T extends string> {
	type: AnimationType
	name?: T
}

export interface Sequence<T extends string> extends AnimationNode<T> {
	type: 'sequence'
	children: AnimationNode<T>[]
}

export interface Parallel<T extends string> extends AnimationNode<T> {
	type: 'parallel'
	children: AnimationNode<T>[]
}

export interface Stagger<T extends string> extends AnimationNode<T> {
	type: 'stagger'
	delay: number
	children: AnimationNode<T>[]
}

export interface Spring<T extends string> extends AnimationNode<T> {
	type: 'spring'
	config?: Partial<SpringConfig>
	name: T
	from: number
	to: number
}

export interface Timing<T extends string> extends AnimationNode<T> {
	type: 'timing'
	duration: number
	easing: EasingFunction
	name: T
	from: number
	to: number
}

export interface Marker<T extends string> extends AnimationNode<T> {
	type: 'marker'
	name: T
}

export interface Event {
	inputRange: number[]
	outputRange: number[]
	config?: Partial<SpringConfig>
	easing?: EasingFunction
}

export interface Timelines {
	[name: string]: Event[]
}
