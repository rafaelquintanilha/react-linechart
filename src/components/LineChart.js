// Core
import React, { Component, PropTypes } from 'react';

// Internal libs
import { parseAllDimensions } from '../businessLogic/parsers';
import { handlePointClick, handleTextClick } from '../businessLogic/events';
import { axisGenerator, lineGenerator } from '../businessLogic/generators';
import { getColor } from '../businessLogic/util';
import ColorLegendUtil from '../businessLogic/colorLegendUtil';

// Constants
import { DEFAULT_CHART_PROPS } from '../constants/DefaultChartProps';

// Components
import XAxis from './XAxis';
import YAxis from './YAxis';
import Line from './Line';
import Point from './Point';
import Legend from './Legend';

// Styles
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
		const { width, height, margins, data, isDate, yMin, yMax, xMin, xMax, ticks, interpolate } = props;
		/* ToDo: add logic to avoid re-evaluate axis if domains don't chante */
		const { xScale, xAxisGen, yScale, yAxisGen } = 
			axisGenerator(width, height, margins, data, isDate, yMin, yMax, xMin, xMax, this.xParser, this.xDisplay, ticks);		
		const lineGen = lineGenerator(xScale, yScale, interpolate, this.xParser);
		this.setState({ lineGen, xAxisGen, yAxisGen, xScale, yScale });
	}

	renderXAxis(width, height, margins) {		
		const { id, xLabel, hideXAxis, hideXLabel, labelClass } = this.props;
		const xId = `${id}-x-axis`;
		return hideXAxis
			? null
			: <XAxis 
				id={xId} 
				width={width} 
				height={height} 
				margins={margins} 
				labelClass={labelClass}
				xAxisGen={this.state.xAxisGen}
				hideXLabel={hideXLabel} 
				label={xLabel} />;
	}

	renderYAxis(width, height, margins) {
		const { id, hideYAxis, hideYLabel, yLabel, labelClass } = this.props;		
		const yId = `${id}-y-axis`;		
		return hideYAxis
			? null
			: <YAxis 
				id={yId} 
				height={height} 
				margins={margins}
				labelClass={labelClass} 
				yAxisGen={this.state.yAxisGen} 
				hideYLabel={hideYLabel} 
				label={yLabel} />;
	}

	renderLines() {
		if ( this.props.hideLines ) return;
		return this.props.data.map((line, i) => 
			<Line
				id={line.id}
				svgId={this.props.id}
				key={i}
				name={line.name}
				d={this.state.lineGen(line.points)}
				strokeWidth={this.props.strokeWidth}
				stroke={getColor(line.color, i)}
				tooltipClass={this.props.tooltipClass}
				isStair={this.props.isStair}
				onTextClick={this.props.onTextClick}
				onTextHover={this.props.onTextHover} />
		);
	}

	renderPoints() {
		if ( this.props.hidePoints ) return;

		const { pointRadius, id, data, onPointClick, onPointHover, tooltipClass, pointClass } = this.props;
		const { xScale, yScale } = this.state;

		return data.map((d, i) => {						
			return d.points.map((p, i) => 
				<Point 
					key={i} 
					r={pointRadius} 
					cx={xScale(this.xParser(p.x))} 
					cy={yScale(p.y)}					
					stroke={getColor(d.color, i)}
					point={p}
					tooltipClass={tooltipClass}
					pointClass={pointClass}
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

		return this.props.data.map((d, i) => {
			const { rectX, rectY, textX, textY } = util.generateCoords(i);
			return (
				<Legend 
					key={i}
					name={d.name || d.id || `Line ${i+1}`}
					color={getColor(d.color, i)}
					rectWidth={util.rectWidth}
					rectHeight={util.rectHeight}
					rectX={rectX} rectY={rectY} textX={textX} textY={textY} />
			);
		});
	}
	
	render() {
		const { width, height, margins } = parseAllDimensions(this.props.width, this.props.height, this.props.margins);
		return (
			<div id={this.props.id} style={{position: "relative"}}>
				<svg width={width} height={height}>
					{this.renderXAxis(width, height, margins)}
					{this.renderYAxis(width, height, margins)}
					{this.renderLines()}
					{this.renderPoints()}
					{this.renderLegends()}
				</svg>
			</div>
		);
	}
}

LineChart.propTypes = {
	// Data for rendering the chart		
	data: PropTypes.array.isRequired,

	// Id for identifying some aspects of the chart. Might be automatic
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

	// Hide label
	hideXLabel: PropTypes.bool,
	hideYLabel: PropTypes.bool,		

	// Boundaries for the X coordinate
	xMin: PropTypes.string,
	xMax: PropTypes.string,

	// Boundaries for the Y coordinate
	yMin: PropTypes.number,
	yMax: PropTypes.number,	

	// Bool to declare if our X coordinate is numeric or date
	isDate: PropTypes.bool,

	// Related to stair charts
	isStair: PropTypes.bool,
	onTextClick: PropTypes.func,
	onTextHover: PropTypes.func,

	// Actions to do with points
	hidePoints: PropTypes.bool,
	pointRadius: PropTypes.number,
	onPointClick: PropTypes.func,
	onPointHover: PropTypes.func,

	// Classes and Styles
	tooltipClass: PropTypes.string,
	pointClass: PropTypes.string,
	labelClass: PropTypes.string,	

	// Should show color labels and where
	showLegends: PropTypes.bool,
	legendPosition: PropTypes.string,	

	// Should draw line, how thick it is and which function to use
	hideLines: PropTypes.bool,
	strokeWidth: PropTypes.number,
	interpolate: PropTypes.string,	

	// Functions to parse and display the x data
	xParser: PropTypes.func,
	xDisplay: PropTypes.func,
	ticks: PropTypes.number	
};

LineChart.defaultProps = {
	id: 			DEFAULT_CHART_PROPS.id,
	width: 			DEFAULT_CHART_PROPS.width,
	height: 		DEFAULT_CHART_PROPS.height,
	margins: 		DEFAULT_CHART_PROPS.margins,
	pointRadius: 	DEFAULT_CHART_PROPS.pointRadius,
	interpolate: 	DEFAULT_CHART_PROPS.interpolate,
	xLabel: 		DEFAULT_CHART_PROPS.xLabel,
	yLabel: 		DEFAULT_CHART_PROPS.yLabel,
	ticks: 			DEFAULT_CHART_PROPS.ticks,
	legendPosition: DEFAULT_CHART_PROPS.legendPosition,
	strokeWidth: 	DEFAULT_CHART_PROPS.strokeWidth,
	tooltipClass: 	DEFAULT_CHART_PROPS.tooltipClass,
	pointClass: 	DEFAULT_CHART_PROPS.pointClass,
	labelClass: 	DEFAULT_CHART_PROPS.labelClass,
	onPointClick: 	handlePointClick,
	onTextClick: 	handleTextClick	
};

export default LineChart;