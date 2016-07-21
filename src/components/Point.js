import React, { PropTypes } from 'react';
import { handleMouseOver, handleMouseOut } from '../businessLogic/events';

export default class Point extends React.Component {

	render() {
		return (
			<circle 
				cx={this.props.cx} 
				cy={this.props.cy}
				r={this.props.r} 
				stroke={this.props.stroke}
				className="dot"
				group={this.props.group}
				onClick={(e) => this.props.onPointClick(e, this.props.point)}
				onMouseOver={(e) => handleMouseOver(e, this.props.onPointHover(this.props.point), this.props.svgId)}				
				onMouseOut={() => handleMouseOut()} />
		);
	}
}

Point.propTypes = {	
	cx: PropTypes.number,
	cy: PropTypes.number,
	r: PropTypes.number,
	stroke: PropTypes.string,
	group: PropTypes.string,
	point: PropTypes.object,
	onPointClick: PropTypes.func,
	onPointHover: PropTypes.func,
	svgId: PropTypes.string
};