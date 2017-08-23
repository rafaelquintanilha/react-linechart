import React from 'react';
import PropTypes from 'prop-types';
import d3 from "d3";

export default class XAxis extends React.Component {

	componentDidMount() {		
		this.updateAxis();
	}

	componentDidUpdate() {		
		this.updateAxis();
	}

	updateAxis() {
		d3.select(`#${this.props.id}`).call(this.props.xAxisGen);
	}

	getLabel() {
		const { width, margins, label, labelClass, hideXLabel } = this.props;
		return hideXLabel
			? null
			: (
			<text 
				className={labelClass} 
				transform={`translate(${width / 2}, ${margins.bottom})`}>
				{label}
			</text>
			);
	}

	render() {		
		const { id, height, margins } = this.props;
		return (
			<g 
				id={id} 
				className="axis" 
				transform={`translate(0, ${(height - margins.bottom)})`}>
				{this.getLabel()}	
			</g>
		);
	}
}

XAxis.propTypes = {
	id: PropTypes.string,	
	width: PropTypes.number,
	height: PropTypes.number,
	margins: PropTypes.object,
	label: PropTypes.string,
	labelClass: PropTypes.string,
	hideXLabel: PropTypes.bool,
	xAxisGen: PropTypes.func
};