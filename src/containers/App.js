import React, { Component } from 'react';
import LineChart from "../components/LineChart";
import { yearlyData, monthlyData } from "../constants/Points";

import update from 'react/lib/update';
import d3 from "d3";

import { dataParser } from "../businessLogic/gsmUtil";

export default class App extends Component {

	constructor(props) {
		super(props);
		
		const gsmData = dataParser();

		this.state = { gsmData, monthlyData };
	}

	handleClick() {
		const newMonthly = update(monthlyData, { lines: { [0]: { points: { $push: [{ "x": "2016-01-09", "y": 237 }] } } } });
		this.setState({ monthlyData: newMonthly });
	}

	render() {
		const { gsmData, monthlyData } = this.state;
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
					interpolate="cardinal"
					yMin={-100}
					yMax={100}					
					isDate={false}
					data={gsmData} />				
				{/*<LineChart
					id="dateChart"
					width="1000"
					height="400"										
					xDisplay={d3.time.format("%d %b")}
					isDate
					data={monthlyData} />*/}
			</div>
		);
	}
}