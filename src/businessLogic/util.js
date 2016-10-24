import d3 from "d3";
import { DEFAULT_CHART_PROPS } from '../constants/DefaultChartProps';

export const identity = ((x) => x);

export function getMaxMin(lines, property, parser = identity) {	
	let array = [];
	lines.map((line) => line.points.map((p) => array.push(parser(p[property]))));
	return d3.extent(array);
}

export const tooltipHTML = (point) => {
	const html = `
		<b>X: </b>${point.x}
		<br />
		<b>Y: </b>${point.y}`;
	return html;
};

export const getColor = (color, index = 0) => {
	const { defaultColors } = DEFAULT_CHART_PROPS;
	return color || defaultColors[index % defaultColors.length];
};