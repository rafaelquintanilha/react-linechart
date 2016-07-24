import React, { PropTypes } from 'react';
import LineChart from "../components/LineChart";

export default class ScatterPlot extends React.Component {

	render() {			
		return (
			<LineChart 
				showPoints
				{...this.props} />
		);
	}
}