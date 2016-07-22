import d3 from "d3";

export function handleMouseOver(event, html, id, className) {
	// First creates tooltip div
	const tooltip = d3.select(`#${id}`)
		.append("div")
		.attr("class", className);

	// Now gets the offset 
	const { top, left } = d3.select(`#${id} > svg`).node().getBoundingClientRect();
	
	tooltip.transition()
		.duration(200)
		.style("opacity", .9);

	tooltip.html(html)		
		.style("left", (event.pageX - left) + "px")
		.style("top", (event.pageY - 35 - top) + "px");
}

export function handleMouseOut(className) {
	d3.selectAll(`.${className}`)
		.transition()		
			.duration(300)		
			.style("opacity", .0)
			.remove();
}

export function handlePointClick(event, point) {
	console.log(point);
}

export function handleTextClick(text) {
	console.log(text);
}