import d3 from "d3";

import { DEFAULT_CHART_PROPS } from '../constants/DefaultChartProps';

export const identity = ((x) => x);

export function getMaxMin(lines, property, parser = identity) {
	let array = [];
	lines.map((line) => line.points.map((p) => array.push(parser(p[property]))));
	return d3.extent(array);
}

export function parseDimension(d) {
	if ( typeof d === "number" ) return d;
	if ( typeof d === "string" ) return parseFloat(d.replace(/px/g, ""));	
}

export function parseMargins(margins) {
	if ( typeof margins !== "object" ) return DEFAULT_CHART_PROPS.margins;
	return {
		top: 	parseDimension(margins.top) 	|| DEFAULT_CHART_PROPS.margins.top,
		right: 	parseDimension(margins.right) 	|| DEFAULT_CHART_PROPS.margins.right,
		bottom: parseDimension(margins.bottom) 	|| DEFAULT_CHART_PROPS.margins.bottom,
		left: 	parseDimension(margins.left) 	|| DEFAULT_CHART_PROPS.margins.left
	};
}

export function parseAllDimensions(width, height, margins) {
	return {
		width: parseDimension(width),
		height: parseDimension(height),
		margins: parseMargins(margins)
	};
}

export function getXLabel(label) {
	return label || DEFAULT_CHART_PROPS.xLabel;
}

export function getYLabel(label) {
	return label || DEFAULT_CHART_PROPS.yLabel;
}

export function getInterpolate(interpolate) {
	return interpolate || DEFAULT_CHART_PROPS.interpolate;
}

export function parseFlatArray(data, xDimension, yDimensionArray, colorArray = [], idArray = [], nameArray = [] ) {

	const { googleColors } = DEFAULT_CHART_PROPS;
	
	const lines = [];
	yDimensionArray.map((yDimension, i) => {
		lines.push({
			id: idArray[i] || `${xDimension}-${yDimensionArray[i]}`,
			name: nameArray[i],
			color: colorArray[i] || googleColors[i % googleColors.length],
			points: []
		});
	});
	
	data.map((d, i) => {
		lines.map((line, j) => {
			line.points.push({
				x: d[xDimension],
				y: d[yDimensionArray[j]]
			});
		});		
	});

	return lines;
}