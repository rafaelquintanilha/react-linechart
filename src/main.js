import LineChart from "./components/LineChart";
import * as component from "./components/StairChart";
import * as parsers from "./businessLogic/parsers";

export default LineChart;
export const StairChart = component.StairChart;
export const parseFlatArray = parsers.parseFlatArray;
export const parseGroupingBy = parsers.parseGroupingBy;
export const parseStairChart = parsers.parseStairChart;