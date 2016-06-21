import React, { Component } from 'react';
import LineChart from "../components/LineChart";
import { yearlyData, monthlyData } from "../constants/Points";

import update from 'react/lib/update';
import d3 from "d3";

import { gsmData } from "../constants/GSM";
import { parseFlatArray, parseGroupingBy } from "../businessLogic/parsers";

export default class App extends Component {

	constructor(props) {
		super(props);

		const gsmFlat = parseFlatArray(gsmData, "Year", ["Glob", "NHem", "SHem"]);		
		this.state = { gsmFlat, monthlyData };
	}

	handleClick() {
		const newMonthly = update(monthlyData, { [0]: { points: { $push: [{ "x": "2016-01-31", "y": 277 }] } } });
		this.setState({ monthlyData: newMonthly });
	}

	render() {
		const { gsmFlat, monthlyData } = this.state;

		const data = [
			{ id: 1, value: 3, date: "2016-01-01" },
			{ id: 1, value: 4, date: "2016-01-03" },
			{ id: 2, value: 10, date: "2016-01-02" },
			{ id: 1, value: 6, date: "2016-01-04" },
			{ id: 2, value: 13, date: "2016-01-06" },
			{ id: 1, value: 5, date: "2016-01-08" },
			{ id: 2, value: 10, date: "2016-01-20" }
		];

		const grouped = parseGroupingBy(data, "date", "value", "id");
		console.log(grouped);

		return (
			<div>
				<center>
					<h1>React LineChart</h1>
					<button type="button" onClick={this.handleClick.bind(this)}>Add Value</button>
				</center>
				<LineChart
					id="numberChart"
					width="1000"
					height="400"										
					//yMin={-100}					
					//yMax={100}
					drawLines
					showPoints
					//pointRadius="2"
					showLegends
					interpolate="linear"
					legendPosition="top-left"					
					isDate
					lines={grouped} />
				<div className="row">
					<div className="col-md-offset-2 col-md-10">
						<LineChart
							//id="dateChart"
							width="1000"
							height="400px"
							xLabel="Date"
							yLabel="Value"
							interpolate="linear"					
							drawLines
							showPoints					
							showLegends
							legendPosition="top-left"
							xDisplay={d3.time.format("%d %b")}
							isDate					
							lines={monthlyData} />
					</div>
				</div>				
			</div>
		);
	}
}