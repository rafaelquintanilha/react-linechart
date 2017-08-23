import React, { Component } from 'react';
import LineChart from "../src/components/LineChart";
import StairChart from "../src/components/StairChart";
import ScatterPlot from "../src/components/ScatterPlot";

import d3 from "d3";
import { parseFlatArray, parseGroupingBy, parseStairChart } from "../src/businessLogic/parsers";

// Points
import { gsmData } from "./constants/gsm";
import { grouped, stair } from "./constants/points";

export default class App extends Component {

	constructor(props) {
		super(props);

		this.state = { 			
			data: "grouped",
			legendPosition: "top-left",
			interpolate: "linear",
			xLabel: "X",
			yLabel: "Y",
			hidePoints: false, 	
			hideLines: false,
			yMin: null,
			yMax: null,
			xMax: null,
			xMin: null
		};
	}

	handleDataChange(e) {
		const newState = Object.assign(
			{}, 
			this.state, 
			{ data: e.target.value, yMin: null, yMax: null, xMin: null, xMax: null, xLabel: "X", yLabel: "Y" }
		);
		this.setState(newState);
	}

	handleLegendChange(e) {
		const newState = Object.assign({}, this.state, { legendPosition: e.target.value });
		this.setState(newState);
	}

	handleInterpolateChange(e) {
		const newState = Object.assign({}, this.state, { interpolate: e.target.value });
		this.setState(newState);
	}

	handleXLabelChange(e) {
		const newState = Object.assign({}, this.state, { xLabel: e.target.value });
		this.setState(newState);
	}

	handleYLabelChange(e) {
		const newState = Object.assign({}, this.state, { yLabel: e.target.value });
		this.setState(newState);
	}

	handleHidePointsChange(e) {		
		const newState = Object.assign({}, this.state, { hidePoints: e.target.checked });
		this.setState(newState);
	}

	handleHideLinesChange(e) {		
		const newState = Object.assign({}, this.state, { hideLines: e.target.checked });
		this.setState(newState);
	}

	handleYMinChange(e) {
		const newState = Object.assign({}, this.state, { yMin: e.target.value });
		this.setState(newState);
	}

	handleYMaxChange(e) {
		const newState = Object.assign({}, this.state, { yMax: e.target.value });
		this.setState(newState);
	}

	handleXMinChange(e) {		
		const newState = Object.assign({}, this.state, { xMin: e.target.value });
		this.setState(newState);
	}

	handleXMaxChange(e) {		
		const newState = Object.assign({}, this.state, { xMax: e.target.value });
		this.setState(newState);
	}

	onGroupedHover(point) {
		const formatted = d3.time.format("%b %d")(d3.time.format("%Y-%m-%d").parse(point.x));
		return `<b>Date: </b>${formatted}<br /><b>Value: </b>${point.y}`;
	}

	onScatterHover(point) {		
		return `<b>Date: </b>${point.x}<br /><b>Value: </b>${point.y}`;
	}

	render() {		
		let chart;

		// ToDo: improve these messy booleans
		let disabled = false;
		let checkBoxDisabled = true;

		switch ( this.state.data ) {
			case "grouped":
				checkBoxDisabled = false;
				chart = (
					<LineChart						
						width="840px"
						height="400px"
						margins={{right: 100}}
						yMin={this.state.yMin}
						yMax={this.state.yMax}
						xMin={this.state.xMin}
						xMax={this.state.xMax}
						xLabel={this.state.xLabel}
						yLabel={this.state.yLabel}
						ticks={5}
						hideLines={this.state.hideLines}
						hidePoints={this.state.hidePoints}					
						onPointHover={this.onGroupedHover}
						showLegends					
						interpolate={this.state.interpolate}
						legendPosition={this.state.legendPosition}					
						isDate											
						data={parseGroupingBy(grouped, "date", "value", "id")} 						
					/>
				);
				break;
			case "staired":				
				disabled = true;
				chart = (
					<StairChart
						id="stairChart"
						width="840px"
						height="400px"
						xLabel={this.state.xLabel}
						xMin={this.state.xMin}
						xMax={this.state.xMax}						
						isDate					
						data={parseStairChart(stair, "startDate", "endDate", "name")} />
				);
				break;			
			case "scatter":
			default:
				chart = (
					<ScatterPlot
						id="scatterPlot"
						width="840px"
						height="400px"
						margins={{right: 100}}
						yMin={this.state.yMin}
						yMax={this.state.yMax}
						xMin={this.state.xMin}
						xMax={this.state.xMax}
						xLabel={this.state.xLabel}
						yLabel={this.state.yLabel}
						ticks={5}					
						onPointHover={this.onScatterHover}
						showLegends										
						legendPosition={this.state.legendPosition}										
						data={parseFlatArray(gsmData, "Year", ["Glob", "NHem", "SHem"])} />
					);
				break;
		}

		return (
			<div>
				<center>
					<h1>React LineChart</h1>
					<hr />					
				</center>				
				<div className="container row">
					<div className="col-sm-4" style={{marginTop: "50px"}}>
						<div className="panel panel-default">
							<div className="panel-heading">Chart Control</div>
							<div className="panel-body">
								<div className="row">
									<div className="col-sm-6">
										<label>Data</label>
										<select 
											className="form-control"
											value={this.state.data} 
											onChange={this.handleDataChange.bind(this)}>
											<option value="grouped">Grouped</option>
											<option value="scatter">Scatter</option>												
											<option value="staired">Staired</option>
										</select>
										<br />
										<label>Legend</label>								
										<select 
											className="form-control"
											value={this.state.legendPosition} 
											disabled={disabled}
											onChange={this.handleLegendChange.bind(this)}>
											<option value="top-left">Top-left</option>
											<option value="bottom-left">Bottom-left</option>
											<option value="top-center">Top-center</option>
											<option value="bottom-center">Bottom-center</option>
											<option value="top-right">Top-right</option>
											<option value="bottom-right">Bottom-right</option>
										</select>
										<br />
										<label>Interpolation</label>								
										<select 
											className="form-control"
											value={this.state.interpolate} 
											disabled={checkBoxDisabled}
											onChange={this.handleInterpolateChange.bind(this)}>
											<option value="linear">Linear</option>
											<option value="cardinal">Cardinal</option>
											<option value="basis">Basis</option>									
										</select>
										<br />
										<div className="form-group">
											<label>X Label</label>
											<input 
												type="text" 
												className="form-control" 
												value={this.state.xLabel} 
												onChange={this.handleXLabelChange.bind(this)} />
										</div>
										<div className="form-group">
											<label>Y Label</label>
											<input 
												type="text" 
												className="form-control" 
												value={this.state.yLabel} 
												disabled={disabled}
												onChange={this.handleYLabelChange.bind(this)} />
										</div>	
									</div>
									<div className="col-sm-6">
										<div className="form-group">
											<label>X Max</label>
											<input 
												type={this.state.data === "scatter" ? "number" : "date"}
												className="form-control" 
												value={this.state.xMax} 
												onChange={this.handleXMaxChange.bind(this)} />
										</div>
										<div className="form-group">
											<label>X Min</label>
											<input 
												type={this.state.data === "scatter" ? "number" : "date"}
												className="form-control" 
												value={this.state.xMin} 
												onChange={this.handleXMinChange.bind(this)} />
										</div>
										<div className="form-group">
											<label>Y Max</label>
											<input 
												type="number" 
												className="form-control" 
												value={this.state.yMax} 
												disabled={disabled}
												onChange={this.handleYMaxChange.bind(this)} />
										</div>
										<div className="form-group">
											<label>Y Min</label>
											<input 
												type="number" 
												className="form-control" 
												value={this.state.yMin} 
												disabled={disabled}
												onChange={this.handleYMinChange.bind(this)} />
										</div>										
										<div className="checkbox">
											<label>
												<input 
													type="checkbox"
													disabled={checkBoxDisabled}
													onChange={this.handleHidePointsChange.bind(this)}
													checked={this.state.hidePoints}/> 
													Hide Points
											</label>
										</div>
										<div className="checkbox">
											<label>
												<input 
													type="checkbox"
													disabled={checkBoxDisabled}
													onChange={this.handleHideLinesChange.bind(this)}
													checked={this.state.hideLines}/> 
													Hide Lines
											</label>
										</div>
									</div>
								</div>																											
							</div>
						</div>
					</div>
					<div className="col-sm-8">
						{chart}
					</div>
				</div>				
			</div>
		);
	}
}