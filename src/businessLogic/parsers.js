import { DEFAULT_CHART_PROPS } from '../constants/DefaultChartProps';

export function parseDimension(d) {
	if ( typeof d === "number" ) return d;
	if ( typeof d === "string" ) return parseFloat(d.replace(/px/g, ""));	
}

export function parseMargins(margins) {
	if ( typeof margins !== "object" ) return DEFAULT_CHART_PROPS.margins;
	return {
		top: 	parseDimension(margins.top) 	|| DEFAULT_CHART_PROPS.margins.top,
		right: 	parseDimension(margins.right) 	|| DEFAULT_CHART_PROPS.margins.right,
		bottom: parseDimension(margins.bottom) 	|| DEFAULT_CHART_PROPS.margins.bottom,
		left: 	parseDimension(margins.left) 	|| DEFAULT_CHART_PROPS.margins.left
	};
}

export function parseAllDimensions(width, height, margins) {
	return {
		width: parseDimension(width),
		height: parseDimension(height),
		margins: parseMargins(margins)
	};
}

export function parseFlatArray(data, xDimension, yDimensionArray, colorArray = [], idArray = [], nameArray = [] ) {

	const { googleColors } = DEFAULT_CHART_PROPS;
	
	const lines = [];

	// Transform a single string in an array
	if ( typeof yDimensionArray === "string" ) yDimensionArray = [yDimensionArray];
	
	yDimensionArray.map((yDimension, i) => {
		lines.push({
			id: idArray[i] || `${xDimension}-${yDimension}`,
			name: nameArray[i],
			color: colorArray[i] || googleColors[i % googleColors.length],
			points: []
		});
	});
	
	data.map((d, i) => {
		lines.map((line, j) => {
			line.points.push({
				x: d[xDimension],
				y: d[yDimensionArray[j]]
			});
		});		
	});

	return lines;
}

export function parseGroupingBy(data, xDimension, yDimension, groupByDimension, nameGenerator, colorArray = [], idArray = []) {
	// <Key,value> dict where key is the value we are grouping by, and the value is the index of the line
	// E.g.: suppose we are grouping by a groupDimension called "id", and there is 3 unique id's on the data
	// So for each unique id we found, a new line will be added. The id value will be the key, and the index of
	// the correspondent line will be the value
	const map = new Map();

	const { googleColors } = DEFAULT_CHART_PROPS;

	const addValue = (d, i) => {
		lines[i].points.push({
			x: d[xDimension],
			y: d[yDimension]
		});
	};

	const nameFunc = typeof nameGenerator === "function" ? nameGenerator : (i) => `Grouped by ${groupByDimension} = ${i}`;

	const lines = [];

	data.map((d, i) => {
		let key = d[groupByDimension];
		if ( map.has(key) ) { // We already have added a key like this one, so there's already a line for it
			let i = map.get(key); // Get correct index
			addValue(d, i); // Add value to points array
		} else { // Here we dont' have added a new line for this key
			let i = lines.length;
			lines.push({
				id: idArray[i] || `${xDimension}-${yDimension}-by-${groupByDimension}-${key}`,
				name: nameFunc(key),
				color: colorArray[i] || googleColors[i % googleColors.length],
				points: []
			});
			map.set(key, i); // Set the <key,value> pair
			addValue(d, i);
		}
	});

	return lines;
}