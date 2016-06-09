import React, { Component, PropTypes } from 'react';
import d3 from "d3";

class LineChart extends Component {

	constructor(props) {
		super(props);
				
		this.MARGINS = props.margins || { top: 30, right: 20, bottom: 30, left: 50 };
		this.WIDTH = parseFloat(props.width) || 1024;
		this.HEIGHT = parseFloat(props.height) || 720;
	}

	componentDidMount() {
		const vis = d3.select("#visualisation");

		const dataY = this.getYMaxMin();
		const yMin = this.props.yMin || dataY.min;
		const yMax = this.props.yMax || dataY.max;		

		const xScale = d3.scale.linear().range([this.MARGINS.left, this.WIDTH - this.MARGINS.right]).domain([2000,2010]);
		const yScale = d3.scale.linear().range([this.HEIGHT - this.MARGINS.top, this.MARGINS.bottom]).domain([yMin, yMax]);

		const xAxis = d3.svg.axis().scale(xScale);
		const yAxis = d3.svg.axis().scale(yScale).orient("left");			

		vis.append("svg:g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + (this.HEIGHT - this.MARGINS.bottom) + ")")
			.call(xAxis);

		vis.append("svg:g")
			.attr("class", "axis")
			.attr("transform", "translate(" + (this.MARGINS.left) + ",0)")
			.call(yAxis);

		const lineGen = d3.svg.line()
			.x((d) => xScale(d.x))
			.y((d) => yScale(d.y))
			.interpolate("cardinal");

		this.props.data.lines.map((line, i) => {
			vis.append('svg:path')
				.attr('d', lineGen(line.points))
				.attr('stroke', line.color)
				.attr('stroke-width', 2)
				.attr('fill', 'none');

			vis.selectAll(`[group=${line.id}]`)
				.data(line.points)
				.enter().append("circle")
					.attr("group", line.id)
					.attr('stroke', line.color)
					.attr("class", "dot")					
					.attr("cx", lineGen.x())
					.attr("cy", lineGen.y())
					.attr("r", 7.5)
					.on("mouseover", ((d) => this.handleMouseOver(d)))
					.on("mouseout", (() => this.handleMouseOut()));
		});
	}

	getYMaxMin() {
		let max = 0;
		let min = Infinity;
		this.props.data.lines.map((line) => {
			line.points.map((p) => {
				max = p.y > max ? p.y : max;
				min = p.y < min ? p.y : min;	
			});			
		});
		return { max, min };
	}

	handleMouseOver(d) {
		const html = `<b>${this.props.data.label.x}: </b>${d.x}<br /><b>${this.props.data.label.y}: </b>${d.y}`;

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
				<svg id="visualisation" width={this.WIDTH} height={this.HEIGHT} />
				<div className="lineChartTooltip" />
			</div>
		);
	}
}

LineChart.propTypes = {	
	data: PropTypes.object.isRequired,
	width: PropTypes.number,
	height: PropTypes.number,
	margins: PropTypes.object,
	yMin: PropTypes.number,
	yMax: PropTypes.number
};

export default LineChart;