// Core
import React, { Component, PropTypes } from 'react';

// Internal libs
import { parseAllDimensions } from '../businessLogic/parsers';
import { handlePointClick, handleTextClick } from '../businessLogic/events';
import ColorLegendUtil from '../businessLogic/colorLegendUtil';
import { axisGenerator, lineGenerator } from '../businessLogic/generators';

// Constants
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
		const { width, height, margins, lines, isDate, yMin, yMax, xMin, xMax, interpolate } = props;
		/* ToDo: add logic to avoid re-evaluate axis if domains don't chante */
		const { xScale, xAxisGen, yScale, yAxisGen } = 
			axisGenerator(width, height, margins, lines, isDate, yMin, yMax, xMin, xMax, this.xParser, this.xDisplay);		
		const lineGen = lineGenerator(xScale, yScale, interpolate, this.xParser);
		this.setState({ lineGen, xAxisGen, yAxisGen, xScale, yScale });
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
				onTextHover={this.props.onTextHover}
				name={line.name}
				d={this.state.lineGen(line.points)}				
				stroke={line.color}
				svgId={this.props.id} />
		);
	}

	renderPoints() {
		if ( !this.props.showPoints ) return;

		const { pointRadius, id, lines, onPointClick, onPointHover } = this.props;
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
					onPointClick={onPointClick}
					onPointHover={onPointHover}
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

	// Boundaries for the X coordinate
	xMin: PropTypes.string,
	xMax: PropTypes.string,

	// Bool to declare if our X coordinate is numeric or date
	isDate: PropTypes.bool,

	// Related to stair charts
	isStair: PropTypes.bool,
	onTextClick: PropTypes.func,
	onTextHover: PropTypes.func,

	// Actions to do with points
	showPoints: PropTypes.bool,
	pointRadius: PropTypes.number,
	onPointClick: PropTypes.func,
	onPointHover: PropTypes.func,

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
	onPointClick: handlePointClick,
	onTextClick: handleTextClick,
	isStair: false
};

export default LineChart;