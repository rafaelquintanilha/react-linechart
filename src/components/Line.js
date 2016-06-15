import React, { PropTypes } from 'react';

export default class Line extends React.Component {

	render() {		
		return (
			<g id={this.props.id} className="line">
				<path 
					stroke={this.props.stroke}
					d={this.props.d}
					strokeWidth={2}
					fill="none"
				/>
			</g>
		);
	}
}

Line.propTypes = {	
	id: PropTypes.string,
	stroke: PropTypes.string,
	d: PropTypes.object
};