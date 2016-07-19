import d3 from "d3";

export const DEFAULT_CHART_PROPS = {
	// Default props for mounting basics aspects of chart
	id: "react-linechart",
	width: 1024,
	height: 720,
	margins: { top: 50, right: 20, bottom: 50, left: 55 },
	pointRadius: 5,
	interpolate: "cardinal",
	xLabel: "X",
	yLabel: "Y",
	legendPosition: "top-left",
	strokeWidth: 2,

	// Refer to: https://github.com/d3/d3/wiki/Time-Formatting
	// Default functions for parsing X values to DATE object and NUMBER object
	// For instance, you might format "2016-01-01" to new Date("2016-01-01") or 126,87 to 126.87
	xDateParser: d3.time.format("%Y-%m-%d").parse,
	xNumericParser: ((x) => x),

	// Default functions for displaying X values
	// For instance, you might format a DATE object into DD/MM/YYYY format, or a number to currency
	xDateDisplay: d3.time.format("%b %d"),
	xNumericDisplay: d3.format("d"),

	// Default colors to be randomly generated
	googleColors: [
		"#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", 
		"#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", 
		"#651067", "#329262", "#5574a6", "#3b3eac"
	],

	defaultColors: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b']
};