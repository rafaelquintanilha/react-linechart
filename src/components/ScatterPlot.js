import React from 'react';
import PropTypes from 'prop-types';
import LineChart from "../components/LineChart";

export default class ScatterPlot extends React.Component {

	render() {			
		return (
			<LineChart 
				hideLines
				{...this.props} />
		);
	}
}