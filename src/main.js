import LineChart from "./components/LineChart";
import StairChartComponent from "./components/StairChart";
import ScatterPlotComponent from "./components/ScatterPlot";
import * as parsers from "./businessLogic/parsers";

export default LineChart;
export const StairChart 		= StairChartComponent;
export const ScatterPlot 		= ScatterPlotComponent;
export const parseFlatArray 	= parsers.parseFlatArray;
export const parseGroupingBy 	= parsers.parseGroupingBy;
export const parseStairChart 	= parsers.parseStairChart;