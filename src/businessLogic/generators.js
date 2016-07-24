// External libs
import d3 from "d3";

// Internal libs
import { getMaxMin } from '../businessLogic/util';
import { parseAllDimensions } from '../businessLogic/parsers';

// Generate axis
export const axisGenerator = (_width, _height, _margins, data, isDate, yMin, yMax, xMin, xMax, xParser, xDisplay, ticks) => {
	const { width, height, margins } = parseAllDimensions(_width, _height, _margins);

	// Determine domain, scale and axis for x
	const xMaxMin = getMaxMin(data, "x", xParser);
	const xDomain = [ xMin || xMin === 0 ? xParser(xMin) : xMaxMin[0], xMax || xMax === 0 ? xParser(xMax) : xMaxMin[1]];
	const xScale = isDate
		? d3.time.scale().range([margins.left, width - margins.right]).domain(xDomain)
		: d3.scale.linear().range([margins.left, width - margins.right]).domain(xDomain);
	const xAxisGen = d3.svg.axis().scale(xScale).ticks(ticks).tickFormat(xDisplay);			

	// Determine domain, scale and axis for y
	const yMaxMin = getMaxMin(data, "y");
	const yDomain = [ yMin || yMin === 0 ? yMin : yMaxMin[0], yMax || yMax === 0 ? yMax : yMaxMin[1]]; 
	const yScale = d3.scale.linear().range([height - margins.top, margins.bottom]).domain(yDomain);
	const yAxisGen = d3.svg.axis().scale(yScale).orient("left");

	return { xDomain, xScale, xAxisGen, yDomain, yScale, yAxisGen };		
};

// Define function that will generate the lines
export const lineGenerator = (xScale, yScale, interpolate, xParser) => {		
	return d3.svg.line()
		.x((d) => xScale(xParser(d.x)))
		.y((d) => yScale(d.y))
		.interpolate(interpolate);
};