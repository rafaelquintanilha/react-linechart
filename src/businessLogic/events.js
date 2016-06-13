import d3 from "d3";

export function handleMouseOver(point, label, xDisplay, xParser) {
	// Creates the HTML to be displayed
	const html = `
		<b>${label.x}: </b>${(xDisplay)(xParser(point.x))}
		<br />
		<b>${label.y}: </b>${point.y}`;

	// First creates tooltip div
	const tooltip = d3.select("#svg-line-chart")
		.append("div")
		.attr("class", "svg-line-chart-tooltip");

	tooltip.transition()
		.duration(200)
		.style("opacity", .9);		
	tooltip.html(html)
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY - 28) + "px");
}

export function handleMouseOut() {
	d3.selectAll('.svg-line-chart-tooltip')
		.transition()		
			.duration(300)		
			.style("opacity", .0)
			.remove();
}

export function handleClick(point) {
	console.log(point);
}