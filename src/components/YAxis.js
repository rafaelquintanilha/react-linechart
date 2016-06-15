import React, { PropTypes } from 'react';
import d3 from "d3";

export default class YAxis extends React.Component {

	componentDidMount() {		
		this.updateAxis();
	}

	componentDidUpdate() {		
		this.updateAxis();
	}

	updateAxis() {
		d3.select(`#${this.props.id}`).call(this.props.yAxisGen);
	}

	render() {		
		const { id, height, margins, label } = this.props;
		return (
			<g 
				id={id} 
				className="axis" 
				transform={`translate(${margins.left}, 0)`}>
				<text 
					className="label-text" 
					transform={`translate(${(-1) * margins.left * 0.70}, ${height / 2})rotate(-90)`}>
					{label}
				</text>
			</g>
		);
	}
}

YAxis.propTypes = {
	id: PropTypes.string,
	height: PropTypes.number,	
	margins: PropTypes.object,
	label: PropTypes.string,
	yAxisGen: PropTypes.func
};