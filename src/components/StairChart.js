import React, { PropTypes } from 'react';
import LineChart from "../components/LineChart";

export default class StairChart extends React.Component {

	render() {			
		return (
			<LineChart 
				hideYAxis 
				interpolate="linear"
				strokeWidth={15}
				yMin={-1}				
				{...this.props} />
		);
	}
}

/*Line.propTypes = {	
	id: PropTypes.string,
	stroke: PropTypes.string,
	strokeWidth: PropTypes.number,
	d: PropTypes.string
};*/