import React from 'react';
import PropTypes from 'prop-types';
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

	getLabel() {
		const { height, margins, label, labelClass, hideYLabel } = this.props;
		return hideYLabel
			? null
			: (
			<text 
				className={labelClass} 
				transform={`translate(${(-1) * margins.left * 0.70}, ${height / 2})rotate(-90)`}>
				{label}
			</text>
			);
	}

	render() {		
		const { id, margins } = this.props;
		return (
			<g 
				id={id} 
				className="axis" 
				transform={`translate(${margins.left}, 0)`}>
				{this.getLabel()}
			</g>
		);
	}
}

YAxis.propTypes = {
	id: PropTypes.string,
	height: PropTypes.number,	
	margins: PropTypes.object,
	label: PropTypes.string,
	labelClass: PropTypes.string,
	hideYLabel: PropTypes.bool,
	yAxisGen: PropTypes.func
};