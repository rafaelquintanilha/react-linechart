// Core
import React, { Component, PropTypes } from 'react';

// External libs
import d3 from "d3";

// Util
import { identity, getMaxMin, parseDimensions, setMargins } from '../businessLogic/util';
import { handleMouseOver, handleMouseOut, handleClick } from '../businessLogic/events';
import ColorLabel from '../businessLogic/colorLabel';

import { DEFAULT_CHART_PROPS } from '../constants/DefaultChartProps';

class LineChart extends Component {

	constructor(props) {
		super(props);

		this.state = {
			width: 			parseDimensions(props.width) || DEFAULT_CHART_PROPS.width,
			height: 		parseDimensions(props.height) || DEFAULT_CHART_PROPS.height,
			margins: 		setMargins(props.margins)
		};

		// D3 functions for parsing and displaying
		// Refer to: https://github.com/d3/d3/wiki/Time-Formatting
		this.xParser = this.props.xParser || (this.props.isDate ? d3.time.format("%Y-%M-%d").parse : identity);
		this.xDisplay = this.props.xDisplay || (this.props.isDate ? d3.time.format("%b %d") : d3.format("d"));

		// Events
		this.handleClick = this.props.onClick || handleClick;
		this.handleMouseOver = this.props.onMouseOver || handleMouseOver;
		this.handleMouseOut = this.props.onMouseOut || handleMouseOut;
	}

	componentDidMount() {
		// Store the SVG node into component
		this.vis = d3.select(`#${this.props.id}`);
		this.renderChart();
	}

	componentDidUpdate() {
		this.renderChart(true);

		if ( !this.props.showPoints ) this.removePoints();
	}

	renderChart(isUpdating = false) {
		const { xDomain, xScale, xAxisGen, yDomain, yScale, yAxisGen } = this.defineAxis();
		this.generateAxis(xAxisGen, yAxisGen);
		if ( !isUpdating ) this.generateAxisLabel();
		this.lineGen = this.lineGenerator(xScale, yScale);
		console.log(xScale(this.xParser("2016-01-02")));
		this.generateData();
	}

	defineAxis() {
		const { lines } = this.props.data;
		const { width, height, margins } = this.state;

		// Determine domain, scale and axis for x
		const xDomain = getMaxMin(lines, "x", this.xParser);
		const xScale = this.props.isDate
			? d3.time.scale().range([margins.left, width - margins.right]).domain(xDomain)
			: d3.scale.linear().range([margins.left, width - margins.right]).domain(xDomain);
		const xAxisGen = d3.svg.axis().scale(xScale).ticks(10).tickFormat(this.xDisplay);			

		// Determine domain, scale and axis for y
		const yMaxMin = getMaxMin(lines, "y");
		const yDomain = [this.props.yMin || yMaxMin[0], this.props.yMax || yMaxMin[1]]; 
		const yScale = d3.scale.linear().range([height - margins.top, margins.bottom]).domain(yDomain);
		const yAxisGen = d3.svg.axis().scale(yScale).orient("left");

		return { xDomain, xScale, xAxisGen, yDomain, yScale, yAxisGen };		
	}

	generateAxis(xAxisGen, yAxisGen) {
		const { height, margins } = this.state;

		// Insert axis into visualization
		let xAxis = d3.select("g#x-axis");
		if ( xAxis.empty() ) {
			this.vis.append("svg:g")
				.attr("id", "x-axis")
				.attr("class", "axis")			
				.attr("transform", `translate(0, ${(height - margins.bottom)})`);
			xAxis = d3.select("g#x-axis");
		} 
		xAxis.call(xAxisGen);

		let yAxis = d3.select("g#y-axis");
		if ( yAxis.empty() ) {
			this.vis.append("svg:g")
				.attr("id", "y-axis")
				.attr("class", "axis")
				.attr("transform", `translate(${margins.left}, 0)`);
			yAxis = d3.select("g#y-axis");		
		}
		yAxis.call(yAxisGen);	
	}

	generateAxisLabel() {
		if ( !d3.selectAll("text.label-text").empty() ) return;

		const { width, height, margins } = this.state;

		// Insert label for each axis
		this.vis.append("text")
			.attr("class", "label-text")
			.attr("transform", `translate(${width / 2}, ${height - 0.20 * margins.bottom})`)			
			.text(this.props.data.label.x);

		this.vis.append("text")
			.attr("class", "label-text")
			.attr("transform", `translate(${margins.left * 0.35}, ${height / 2})rotate(-90)`)			
			.text(this.props.data.label.y);
	}

	// Define function that will generate the lines
	lineGenerator(xScale, yScale) {		
		return d3.svg.line()
			.x((d) => xScale(this.xParser(d.x)))
			.y((d) => yScale(d.y))
			.interpolate(this.props.interpolate || DEFAULT_CHART_PROPS.interpolate);
	}	

	generateData() {
		this.props.data.lines.map((line, i) => {
			if ( this.props.drawLines ) this.generateLine(line);
			if ( this.props.showPoints ) this.generatePoints(line);
			if ( this.props.showColorLabels ) this.generateColorLabels();
		});
	}

	generateLine(line) {
		let path = d3.select(`g#${line.id} > path`);

		// If there's no path yet, create it first
		if ( path.empty() ) {
			this.vis.append("svg:g")
				.attr("id", line.id)
				.attr("class", "line")				
				.append('path');

			path = d3.select(`g#${line.id} > path`); // Selects the brand new path
		}

		// Populates path with data  
		path
			.attr('d', this.lineGen(line.points))
			.attr('stroke', line.color)
			.attr('stroke-width', 2)
			.attr('fill', 'none');
	}

	generatePoints(line) {
		const points = this.vis.selectAll(`[group=${line.id}]`).data(line.points);
		const pointRadius = parseDimensions(this.props.pointRadius) || DEFAULT_CHART_PROPS.pointRadius;

		// Update
		points
			.attr("cx", this.lineGen.x())
			.attr("cy", this.lineGen.y())
			.attr("r", pointRadius);
		
		// Enter
		points.enter().append("circle")
				.attr("group", line.id)
				.attr('stroke', line.color)
				.attr("class", "dot")					
				.attr("cx", this.lineGen.x())
				.attr("cy", this.lineGen.y())
				.attr("r", pointRadius)
				.on("click", ((point) => this.handleClick(point)))
				.on("mouseover", ((point) => this.handleMouseOver(point, this.props.data.label, this.xDisplay, this.xParser)))
				.on("mouseout", this.handleMouseOut);

		// Exit
		points.exit().remove();
	}

	removePoints() {
		this.vis.selectAll('circle').remove();
	}

	generateColorLabels() {
		// First remove all labels, we will re-generate them as they are computationally inexpensive
		d3.selectAll("g.color-label").remove();

		const { width, height, margins } = this.state;
		const CL = new ColorLabel(width, height, margins, this.props.labelPosition);

		this.props.data.lines.map((line, i) => {
			const { rectX, rectY, textX, textY } = CL.generateCoords(i);

			const label = this.vis.append("g").attr("class", "color-label");			
			label.append("rect")
				.attr("width", CL.rectWidth)			
				.attr("height", CL.rectHeight)
				.attr("fill", line.color)
				.attr("transform", `translate(${rectX}, ${rectY})`);

			label.append("text")
				.attr("font-size", "13px")			
				.attr("transform", `translate(${textX}, ${textY})`)
				.text(line.name || line.id);
		});		
	}
	
	render() {		
		return (
			<div id="svg-line-chart">				
				<svg id={this.props.id} width={this.state.width} height={this.state.height} />
			</div>
		);
	}
}

LineChart.propTypes = {	
	id: PropTypes.string.isRequired,

	// Width, height and margins for rendering the chart
	width: PropTypes.number,
	height: PropTypes.number,
	margins: PropTypes.object,

	// Data for rendering the chart
	data: PropTypes.object.isRequired,

	// Boundaries for the Y coordinate
	yMin: PropTypes.number,
	yMax: PropTypes.number,

	// Bool to declare if our X coordinate is numeric or date
	isDate: PropTypes.bool,

	// Actions to do with points
	showPoints: PropTypes.bool,
	pointRadius: PropTypes.number,
	onClick: PropTypes.func,
	onMouseOver: PropTypes.func,
	onMouseOut: PropTypes.func,

	// Should show color labels and where
	showColorLabels: PropTypes.bool,
	labelPosition: PropTypes.string,	

	// Should draw line and which function to use
	drawLines: PropTypes.bool,
	interpolate: PropTypes.string,

	// Functions to parse and display the x data
	xParser: PropTypes.func,
	xDisplay: PropTypes.func	
};

export default LineChart;