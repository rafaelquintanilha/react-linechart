import React, { Component, PropTypes } from 'react';
import { identity, getMaxMin } from '../businessLogic/util';
import d3 from "d3";

class LineChart extends Component {

	constructor(props) {
		super(props);
		
		// Define width, height and margin where the visualization will be displayed
		this.MARGINS = props.margins || { top: 50, right: 20, bottom: 50, left: 55 };
		this.WIDTH = parseFloat(props.width) || 1024;
		this.HEIGHT = parseFloat(props.height) || 720;

		// Default radius for every point in line
		this.POINT_RADIUS = 5;

		// Interpolation function
		this.INTERPOLATE = this.props.interpolate || "cardinal";

		// Define if we should draw lines connecting dots		
		this.DRAW_LINES = this.props.drawLines || this.props.drawLines === undefined;		

		// D3 functions for parsing and displaying
		// Refer to: https://github.com/d3/d3/wiki/Time-Formatting
		this.xParser = this.props.xParser || (this.props.isDate ? d3.time.format("%Y-%M-%d").parse : identity);
		this.xDisplay = this.props.xDisplay || (this.props.isDate ? d3.time.format("%b %d") : d3.format("d"));
	}

	componentDidMount() {
		this.lineGen = this.generateAxis();
		this.generateLines(this.lineGen);
	}

	generateAxis() {
		const vis = d3.select(`#${this.props.id}`);

		const { lines } = this.props.data;

		// Determine domain, scale and axis for x
		const xDomain = getMaxMin(lines, "x", this.xParser);
		const xScale = this.props.isDate
			? d3.time.scale().range([this.MARGINS.left, this.WIDTH - this.MARGINS.right]).domain(xDomain)
			: d3.scale.linear().range([this.MARGINS.left, this.WIDTH - this.MARGINS.right]).domain(xDomain);
		const xAxis = d3.svg.axis().scale(xScale).ticks(10).tickFormat(this.xDisplay);			

		// Determine domain, scale and axis for y
		const yMaxMin = getMaxMin(lines, "y");
		const yDomain = [this.props.yMin || yMaxMin[0], this.props.yMax || yMaxMin[1]]; 
		const yScale = d3.scale.linear().range([this.HEIGHT - this.MARGINS.top, this.MARGINS.bottom]).domain(yDomain);
		const yAxis = d3.svg.axis().scale(yScale).orient("left");

		// Insert axis into visualization
		vis.append("svg:g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + (this.HEIGHT - this.MARGINS.bottom) + ")")
			.call(xAxis);

		vis.append("svg:g")
			.attr("class", "axis")
			.attr("transform", "translate(" + (this.MARGINS.left) + ",0)")
			.call(yAxis);

		// Insert label for each axis
		vis.append("text")
			.attr("class", "label-text")
			.attr("transform", `translate(${this.WIDTH / 2}, ${this.HEIGHT - 0.25 * this.MARGINS.bottom})`)			
			.text(this.props.data.label.x);

		vis.append("text")
			.attr("class", "label-text")
			.attr("transform", `translate(${this.MARGINS.left * 0.35}, ${this.HEIGHT/2})rotate(-90)`)			
			.text(this.props.data.label.y);

		vis.append("text")
			.attr("font-size", "13px")			
			.attr("transform", `translate(${this.MARGINS.left + 20 + 25}, ${this.MARGINS.top})`)			
			.text("Global");

		vis.append("rect")
			.attr("width", "20")			
			.attr("height", "8")
			.attr("fill", "blue")
			.attr("transform", `translate(${this.MARGINS.left + 20}, ${this.MARGINS.top - 8})`)

		vis.append("text")
			.attr("font-size", "13px")			
			.attr("transform", `translate(${this.MARGINS.left + 20 + 25}, ${this.MARGINS.top + 15})`)			
			.text("North Hem.");

		vis.append("rect")
			.attr("width", "20")			
			.attr("height", "8")
			.attr("fill", "red")
			.attr("transform", `translate(${this.MARGINS.left + 20}, ${this.MARGINS.top - 8 + 15})`)

		vis.append("text")
			.attr("font-size", "13px")			
			.attr("transform", `translate(${this.MARGINS.left + 20 + 25}, ${this.MARGINS.top + 15 + 15})`)			
			.text("South Hem.");

		vis.append("rect")
			.attr("width", "20")			
			.attr("height", "8")
			.attr("fill", "green")
			.attr("transform", `translate(${this.MARGINS.left + 20}, ${this.MARGINS.top - 8 + 15 + 15})`)		

		// Define function that will generate the lines
		return d3.svg.line()
			.x((d) => xScale(this.xParser(d.x)))
			.y((d) => yScale(d.y))
			.interpolate(this.INTERPOLATE);
	}

	generateLines(lineGen) {
		const vis = d3.select(`#${this.props.id}`);
		this.props.data.lines.map((line, i) => {

			if ( this.DRAW_LINES ) {
				vis.append("svg:g")
					.attr("class", "line")				
					.append('path')
						.attr('d', lineGen(line.points))
						.attr('stroke', line.color)
						.attr('stroke-width', 2)
						.attr('fill', 'none');
			}

			if ( !this.props.showPoints ) return;

			vis.selectAll(`[group=${line.id}]`)
				.data(line.points)
				.enter().append("circle")
					.attr("group", line.id)
					.attr('stroke', line.color)
					.attr("class", "dot")					
					.attr("cx", lineGen.x())
					.attr("cy", lineGen.y())
					.attr("r", line.pointRadius || this.POINT_RADIUS)
					.on("mouseover", ((point) => this.handleMouseOver(point)))
					.on("mouseout", (() => this.handleMouseOut()));
		});
	}

	handleMouseOver(point) {
		const html = `
			<b>${this.props.data.label.x}: </b>${(this.xDisplay)(this.xParser(point.x))}
			<br />
			<b>${this.props.data.label.y}: </b>${point.y}`;

		const tooltip = d3.select('.lineChartTooltip');
		tooltip.transition()
			.duration(200)
			.style("opacity", .9);		
		tooltip.html(html)
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
	}

	handleMouseOut() {
		const tooltip = d3.select('.lineChartTooltip');
		tooltip.transition()		
			.duration(300)		
			.style("opacity", .0);
	}
	
	render() {
		return (
			<div>				
				<svg id={this.props.id} width={this.WIDTH} height={this.HEIGHT} />
				<div className="lineChartTooltip" />
			</div>
		);
	}
}

LineChart.propTypes = {	
	id: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	width: PropTypes.number,
	height: PropTypes.number,
	margins: PropTypes.object,
	yMin: PropTypes.number,
	yMax: PropTypes.number,
	isDate: PropTypes.bool,
	showPoints: PropTypes.bool,
	drawLines: PropTypes.bool,
	xParser: PropTypes.func,
	xDisplay: PropTypes.func,
	interpolate: PropTypes.string
};

export default LineChart;