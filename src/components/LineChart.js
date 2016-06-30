// Core
import React, { Component, PropTypes } from 'react';

// External libs
import d3 from "d3";

// Internal libs
import { identity, getMaxMin, tooltipHTML } from '../businessLogic/util';
import { parseAllDimensions } from '../businessLogic/parsers';
import { handlePointClick } from '../businessLogic/events';
import ColorLegendUtil from '../businessLogic/colorLegendUtil';

import { DEFAULT_CHART_PROPS } from '../constants/DefaultChartProps';

// Components
import XAxis from './XAxis';
import YAxis from './YAxis';
import Line from './Line';
import Point from './Point';
import Legend from './Legend';

import '../styles/styles.scss';

class LineChart extends Component {

	constructor(props) {
		super(props);

		const { xParser, xDisplay, isDate } = this.props;
		const { xDateParser, xNumericParser, xDateDisplay, xNumericDisplay } = DEFAULT_CHART_PROPS;

		/* ToDo: figure out how to take this chunk away from constructor, maybe using default props */		
		this.xParser = xParser || (isDate ? xDateParser : xNumericParser);
		this.xDisplay = xDisplay || (isDate ? xDateDisplay : xNumericDisplay);
	}

	componentWillMount() {
		this.setGenerators();
	}

	componentWillReceiveProps(nextProps) {
		this.setGenerators(nextProps);
	}

	setGenerators(props = this.props) {
		const { width, height, margins, lines, isDate, yMin, yMax, interpolate } = props;
		/* ToDo: add logic to avoid re-evaluate axis if domains don't chante */
		const { xScale, xAxisGen, yScale, yAxisGen } = 
			this.axisGenerator(width, height, margins, lines, isDate, yMin, yMax);		
		const lineGen = this.lineGenerator(xScale, yScale, interpolate);
		this.setState({ lineGen, xAxisGen, yAxisGen, xScale, yScale });
	}

	axisGenerator(_width, _height, _margins, lines, isDate, yMin, yMax) {
		const { width, height, margins } = parseAllDimensions(_width, _height, _margins);

		// Determine domain, scale and axis for x
		const xDomain = getMaxMin(lines, "x", this.xParser);
		const xScale = isDate
			? d3.time.scale().range([margins.left, width - margins.right]).domain(xDomain)
			: d3.scale.linear().range([margins.left, width - margins.right]).domain(xDomain);
		const xAxisGen = d3.svg.axis().scale(xScale).ticks(10).tickFormat(this.xDisplay);			

		// Determine domain, scale and axis for y
		const yMaxMin = getMaxMin(lines, "y");
		const yDomain = [yMin || yMaxMin[0], yMax || yMaxMin[1]]; 
		const yScale = d3.scale.linear().range([height - margins.top, margins.bottom]).domain(yDomain);
		const yAxisGen = d3.svg.axis().scale(yScale).orient("left");

		return { xDomain, xScale, xAxisGen, yDomain, yScale, yAxisGen };		
	}

	// Define function that will generate the lines
	lineGenerator(xScale, yScale, interpolate) {		
		return d3.svg.line()
			.x((d) => xScale(this.xParser(d.x)))
			.y((d) => yScale(d.y))
			.interpolate(interpolate);
	}

	renderLines() {
		if ( !this.props.drawLines ) return;
		return this.props.lines.map((line, i) => 
			<Line
				key={i}
				strokeWidth={this.props.strokeWidth}
				id={line.id}
				isStair={this.props.isStair}
				onTextClick={this.props.onTextClick}
				name={line.name}
				d={this.state.lineGen(line.points)}				
				stroke={line.color} />
		);
	}

	renderPoints() {
		if ( !this.props.showPoints ) return;

		const { lines, onPointClick, pointRadius, id, tooltipHTML } = this.props;
		const { xScale, yScale } = this.state;

		return lines.map((line, i) => {						
			return line.points.map((p, i) => 
				<Point 
					key={i} 
					r={pointRadius} 
					cx={xScale(this.xParser(p.x))} 
					cy={yScale(p.y)}								
					group={line.id}
					stroke={line.color}
					point={p}
					onClick={onPointClick}
					tooltipHTML={tooltipHTML}
					svgId={id} />
			);
		});
	}

	renderLegends() {
		if ( !this.props.showLegends ) return;

		const { width, height, margins } = parseAllDimensions(this.props.width, this.props.height, this.props.margins);
		const util = new ColorLegendUtil(width, height, margins, this.props.legendPosition);

		return this.props.lines.map((line, i) => {
			const { rectX, rectY, textX, textY } = util.generateCoords(i);
			return (
				<Legend 
					key={i}
					name={line.name || line.id}
					color={line.color}
					rectWidth={util.rectWidth}
					rectHeight={util.rectHeight}
					rectX={rectX} rectY={rectY} textX={textX} textY={textY} />
			);
		});
	}
	
	render() {
		const { width, height, margins } = parseAllDimensions(this.props.width, this.props.height, this.props.margins);
		const { id, xLabel, yLabel } = this.props;
		const xId = `${id}-x-axis`;
		const yId = `${id}-y-axis`;		
		const xAxis = this.props.hideXAxis
			? null
			: <XAxis id={xId} width={width} height={height} margins={margins} xAxisGen={this.state.xAxisGen} label={xLabel} />;
		const yAxis = this.props.hideYAxis
			? null
			: <YAxis id={yId} height={height} margins={margins} yAxisGen={this.state.yAxisGen} label={yLabel} />;
		return (
			<div id={id} style={{position: "relative"}}>				
				<svg width={width} height={height}>
					{xAxis}
					{yAxis}
					{this.renderLines()}
					{this.renderPoints()}
					{this.renderLegends()}
				</svg>
			</div>
		);
	}
}

LineChart.propTypes = {	
	id: PropTypes.string,

	// Width, height and margins for rendering the chart
	width: PropTypes.number,
	height: PropTypes.number,
	margins: PropTypes.object,

	// Define chart x and y labels
	xLabel: PropTypes.string,
	yLabel: PropTypes.string,

	// Hide axis
	hideXAxis: PropTypes.bool,
	hideYAxis: PropTypes.bool,

	// Data for rendering the chart
	lines: PropTypes.array.isRequired,
	strokeWidth: PropTypes.number,

	// Boundaries for the Y coordinate
	yMin: PropTypes.number,
	yMax: PropTypes.number,

	// Bool to declare if our X coordinate is numeric or date
	isDate: PropTypes.bool,

	// Related to stair charts
	isStair: PropTypes.bool,
	onTextClick: PropTypes.func,

	// Actions to do with points
	showPoints: PropTypes.bool,
	pointRadius: PropTypes.number,
	onPointClick: PropTypes.func,
	tooltipHTML: PropTypes.func,

	// Should show color labels and where
	showLegends: PropTypes.bool,
	legendPosition: PropTypes.string,	

	// Should draw line and which function to use
	drawLines: PropTypes.bool,
	interpolate: PropTypes.string,

	// Functions to parse and display the x data
	xParser: PropTypes.func,
	xDisplay: PropTypes.func	
};

const { id, width, height, margins, pointRadius, interpolate, xLabel, yLabel, legendPosition, strokeWidth } = DEFAULT_CHART_PROPS;

LineChart.defaultProps = {
	id,
	width,
	height,
	margins,
	pointRadius,
	interpolate,
	xLabel,
	yLabel,
	legendPosition,
	strokeWidth,
	tooltipHTML: tooltipHTML,
	onPointClick: handlePointClick,
	isStair: false
};

export default LineChart;