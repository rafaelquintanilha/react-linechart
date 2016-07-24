import React, { PropTypes } from 'react';
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

	render() {		
		const { id, width, height, margins, label, labelClass } = this.props;
		return (
			<g 
				id={id} 
				className="axis" 
				transform={`translate(0, ${(height - margins.bottom)})`}>
				<text 
					className={labelClass} 
					transform={`translate(${width / 2}, ${margins.bottom})`}>
					{label}
				</text>
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
	xAxisGen: PropTypes.func
};