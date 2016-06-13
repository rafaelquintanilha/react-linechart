import d3 from "d3";

import { DEFAULT_CHART_PROPS } from '../constants/DefaultChartProps';

export const identity = ((x) => x);

export function getMaxMin(lines, property, parser = identity) {
	let array = [];
	lines.map((line) => line.points.map((p) => array.push(parser(p[property]))));
	return d3.extent(array);
}

export function parseDimensions(d) {
	if ( typeof d === "number" ) return d;
	if ( typeof d === "string" ) return parseFloat(d.replace(/px/g, ""));	
}

export function setMargins(margins) {
	if ( typeof margins !== "object" ) return DEFAULT_CHART_PROPS.margins;
	return {
		top: 	parseDimensions(margins.top) 	|| DEFAULT_CHART_PROPS.margins.top,
		right: 	parseDimensions(margins.right) 	|| DEFAULT_CHART_PROPS.margins.right,
		bottom: parseDimensions(margins.bottom) || DEFAULT_CHART_PROPS.margins.bottom,
		left: 	parseDimensions(margins.left) 	|| DEFAULT_CHART_PROPS.margins.left
	};
}