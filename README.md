React Linechart
===============

Highly customizable line charts using React!

1. [Instalation](#instalation)
2. [Usage](#usage)
3. [Properties Table](#properties-table)
4. [Tooltips](#tooltips)
5. [Derived Charts](#derived-charts)
6. [Parsers](#parsers)
7. [isDate](#isdate)

## Instalation
```javascript
npm install react-linechart --save
```

## Usage
This component is an attempt to simplify the rendering of a basic Line Chart by exposing many props that are commonly used. I realize it is very hard to encompass every use case, so I put an effort in making this especially pleasant to work with continuous values of numbers and dates.

The only mandatory properties are `id` and `data`. The first is an unique identificator which is used to select some SVG components. The second is the data itself - the points will be rendered on screen. The typical `data` object follows this structure:

```javascript
{
	id,
	name,
	color,
	points: [ { x, y } ]
}
```

Where `id` is an identificator for the group, `name` is a name for the group, `color` is a color for the group and `points` are an array of `{ x, y }` objects representing the data. It would be particularly annoying if we need to parse our data to this format, so I provided a [handful of parser functions](#parsers) that hopefully will meet most data formats commonly out there.

## Properties Table

Property | Type | Default | Description
--- | --- | --- | ---
id | `String` | none | The currently focused option; should be visible in the menu by default (required)
data | `Object` | none | Data that describes points to be rendered (required)
width | `Number|String` | `1024` | Chart width 
height | `Number|String` | `720` | Chart height
margins | `Object` | `{ top: 50, right: 20, bottom: 50, left: 55 }` | Chart margins
xLabel | `String` | `"X"` | Label for the X axis
yLabel | `String` | `"Y"` | Label for the Y axis
hideXAxis | `Bool` | `false` | States if the X axis is hidden
hideYAxis | `Bool` | `false` | States if the Y axis is hidden
xMin | `String` | none | Lower domain for the X axis
xMax | `String` | none | Higher domain for the X axis
yMin | `String` | none | Lower domain for the Y axis
yMax | `String` | none | Higher domain for the Y axis
isDate | `Bool` | `false` | Determines if we need to treat the X dimension as date (or numeric)
xParser | `Function` | `isDate ? d3.time.format("%Y-%m-%d").parse : ((x) => x)` | Parse X values before scaling
xDisplay | `Function` | `isDate ? d3.time.format("%b %d") : d3.format("d") ` | Parse X values before displaying
ticks | `Number` | `10` | Chart width. 
drawLines | `Bool` | `false` | States if lines are drawn
interpolate | `String` | `cardinal` | Line interpolation function
showPoints | `Bool` | `false` | States if points are shown
pointRadius | `Number` | `5` | Point radius in pixels
onPointClick | `Function` | `(event, point) => console.log(point)` | Callback for clicking on points
onPointHover | `Function` | none | Callback for hovering on points
onTextClick | `Function` | `(text) => console.log(text)` | Callback for clicking on texts
onTextHover | `Function` | none | Callback for hovering on texts
showLegends | `Bool` | `false` | States if legends are shown
legendPosition | `String` | `top-left` | Position where the legend is rendered
tooltipClass | `String` | `svg-line-chart-tooltip` | Tooltip class
pointClass | `String` | `svg-line-chart-point` | Point class
labelClass | `String` | `svg-line-chart-label` | Label class

## Tooltips

It is easy to hook tooltips onto your chart. Just provide a function that returns a HTML element and this will be displayed inside the tooltip. You can use the class provided by default or write your own and pass to the chart as a `tooltipClass` prop.

## Derived Charts

Turns out a simple Line Chart with the right props can assume a different aspect. For example, setting `showPoints={true}` and `drawLines={false}` gives an awesome Scatter Plot. 

```javascript
import { ScatterPlot } from 'react-linechart'
...
render() {
	return <ScatterPlot id="my-scatter-plot" data={data} />
}
```

It is also possible to build a "Stair Chart", which is how I am calling a time-table-ish kind of chart when we have start and end dates and want to display them as nice stacked bars.

```javascript
import { StairChart } from 'react-linechart'
...
render() {
	return <StairChart id="my-stair-chart" data={stairedData} />
}
```

You can add optional `onTextHover` and `onTextClick` functions to interact with the chart.

## Parsers

In order to comply with the format specified, you can use 3 utilitaries functions which parse your raw data. They are the following:

##### parseFlatArray(data, xDimension, yDimensionArray, colorArray, idArray, nameArray)

Parameter | Type | Default | Description
--- | --- | --- | ---
data | `Array<Objects>` | none | Array of objects describing your data in a flat format
xDimensions | `String` | none | Property that will serve as X dimension
yDimensionArray | `Array<Strings>` | none | Array of properties that will serve as Y dimension
colorArray | `Array<Strings>` | `[]` | Array of hex strings colors that will be assigned in accordance with the yDimensionArray. If no colors are specified, a default array of 20 colors is used
idArray | `Array<Strings>` | `[]` | Array of ids that will be assigned in accordance with yDimensionArray. If no ids are specified, a combination of X and Y dimensions is used 
nameArray | `Array<Strings>` | `[]` | Array of names that will be assigned in accordance with yDimensionArray

This is useful when you want to display a multi-line chart in a one-data-per-object basis. Just pick the dimensions you want and the chart will be rendered.

```javascript
const gsmData = [
	{
		"Year": 1880,
		"Glob": -19,
		"NHem": -33,
		"SHem": -5,		
	},
	{
		"Year": 1881,
		"Glob": -10,
		"NHem": -18,
		"SHem": -2,
	},
	...
];

// Creates a three-line chart: Glob x Year, Glob x NHem, Glob x SHem
const gsmFlat = parseFlatArray(gsmData, "Year", ["Glob", "NHem", "SHem"]);
```

##### parseGroupingBy(data, xDimension, yDimension, groupByDimension, nameGenerator, colorArray, idArray)

Parameter | Type | Default | Description
--- | --- | --- | ---
data | `Array<Objects>` | none | Array of objects describing your data in an indexed format
xDimensions | `String` | none | Property that will serve as X dimension
yDimension | `String` | none | Property that will serve as Y dimension
groupByDimension | `String` | none | Dimension that will be group lines together
nameGenerator | `Function` | `nameGenerator : (i) => `Grouped by ${groupByDimension} = ${i}`` | Function that will generate a name based on the groupByDimension value
colorArray | `Array<Strings>` | `[]` | Array of hex strings colors that will be assigned in accordance with the yDimensionArray. If no colors are specified, a default array of 20 colors is used
idArray | `Array<Strings>` | `[]` | Array of ids that will be assigned in accordance with yDimensionArray. If no ids are specified, a combination of X and Y dimensions is used 

This is useful when you want to aggregate data based on some dimension, an id, for example.

```javascript
const data = [
	{ id: 1, value: 3, date: "2016-01-01" },
	{ id: 1, value: 4, date: "2016-01-03" },
	{ id: 2, value: 10, date: "2016-01-02" },
	{ id: 1, value: 6, date: "2016-01-04" },
	{ id: 2, value: 13, date: "2016-01-06" },
	{ id: 1, value: 5, date: "2016-01-08" },
	{ id: 2, value: 10, date: "2016-03-20" }
];

const grouped = parseGroupingBy(data, "date", "value", "id");
```

##### parseStairChart(data, start, end, name, color)
Parameter | Type | Default | Description
--- | --- | --- | ---
data | `Array<Objects>` | none | Array of objects describing your data
start | `String` | none | Property that will serve as start date
end | `String` | none | Property that will serve as end date
name | `String` | none | Property that will serve as name for the given line
color | `String` | `"steelblue" | Color to fill the line

This is useful when you want to display a kind of time frame.

```javascript
const stair = [
	{ startDate: "2016-01-01", endDate: "2016-01-04", name: "Task 1" },
	{ startDate: "2016-01-02", endDate: "2016-01-03", name: "Task 2" },
	{ startDate: "2016-01-03", endDate: "2016-01-06", name: "Task 3" },
	{ startDate: "2016-01-05", endDate: "2016-01-10", name: "Task 4" },
	{ startDate: "2016-01-08", endDate: "2016-01-13", name: "Task 5" },
	{ startDate: "2016-01-09", endDate: "2016-01-20", name: "Task 6" }
];
const staired = parseStairChart(stair, "startDate", "endDate", "name");
```

## isDate

The component currently depends heavily on the `isDate` property. If you use a numeric value and pass `isDate={true}`, then unexpected behaviour will happen (same for the reverse). I will try to eliminate this dependency in the future and maybe use some heuristics to determine wheter we are parsing dates or not.

Meanwhile, by default the component will first parse the date in a `"YYYY-MM-DD"` format in a `Date` object. You can change this by overriding the default `xParser` function. Similarly, choose any function which parse a `Date` object into a human-readable string as you want. By default I'm using `d3` functions, but you can write your own or use another Date parser such as [MomentJS](http://momentjs.com).