import d3 from "d3";

export function handleMouseOver(event, point, id, xLabel, yLabel, xDisplay, xParser ) {
	// Creates the HTML to be displayed
	const html = `
		<b>${xLabel}: </b>${(xDisplay)(xParser(point.x))}
		<br />
		<b>${yLabel}: </b>${point.y}`;

	// First creates tooltip div
	const tooltip = d3.select(`#${id}`)
		.append("div")
		.attr("class", "svg-line-chart-tooltip");

	// Now gets the offset 
	const { top, left } = d3.select(`#${id} > svg`).node().getBoundingClientRect();
	
	tooltip.transition()
		.duration(200)
		.style("opacity", .9);		
	tooltip.html(html)		
		.style("left", (event.pageX - left) + "px")
		.style("top", (event.pageY - 35 - top) + "px");
}

export function handleMouseOut() {
	d3.selectAll('.svg-line-chart-tooltip')
		.transition()		
			.duration(300)		
			.style("opacity", .0)
			.remove();
}

export function handleClick(event, point) {
	console.log(point);
}