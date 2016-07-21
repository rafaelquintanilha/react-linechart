// External libs
import d3 from "d3";

// Internal libs
import { getMaxMin } from '../businessLogic/util';
import { parseAllDimensions } from '../businessLogic/parsers';

// Generate axis
export const axisGenerator = (_width, _height, _margins, lines, isDate, yMin, yMax, xMin, xMax, xParser, xDisplay) => {
	const { width, height, margins } = parseAllDimensions(_width, _height, _margins);

	// Determine domain, scale and axis for x
	const xMaxMin = getMaxMin(lines, "x", xParser);
	const xDomain = [ xMin ? xParser(xMin) :  xMaxMin[0], xMax ? xParser(xMax) :  xMaxMin[1]];
	const xScale = isDate
		? d3.time.scale().range([margins.left, width - margins.right]).domain(xDomain)
		: d3.scale.linear().range([margins.left, width - margins.right]).domain(xDomain);
	const xAxisGen = d3.svg.axis().scale(xScale).ticks(10).tickFormat(xDisplay);			

	// Determine domain, scale and axis for y
	const yMaxMin = getMaxMin(lines, "y");
	const yDomain = [yMin || yMaxMin[0], yMax || yMaxMin[1]]; 
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