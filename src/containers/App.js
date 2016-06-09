import React, { Component } from 'react';
import LineChart from "../components/LineChart";

export default class App extends Component {
	render() {
		const data = {
			label: { x: "Ano", y: "Valor" },
			lines: [
				{
					id: "blue-line",
					color: "blue",					
					points: [
						{ "y": 202, "x": "2000" }, 
						{ "y": 215, "x": "2001" }, 
						{ "y": 179, "x": "2002" }, 
						{ "y": 199, "x": "2003" }, 
						{ "y": 134, "x": "2004" }, 
						{ "y": 176, "x": "2010" }
					]
				},
				{
					id: "green-line",
					color: "green",
					points: [
						{ "y": 102, "x": "2000" }, 
						{ "y": 115, "x": "2001" }, 
						{ "y": 279, "x": "2002" }, 
						{ "y": 139, "x": "2005" }, 
						{ "y": 194, "x": "2007" }, 
						{ "y": 116, "x": "2009" }
					]
				}
			]
		};

		return (
			<div>
				<h1>React LineChart</h1>
				<hr />				
				<LineChart
					width="1000"
					height="500"
					yMin="0"
					yMax="350"
					data={data} />
			</div>
		);
	}
}