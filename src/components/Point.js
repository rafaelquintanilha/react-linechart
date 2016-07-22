import React, { PropTypes } from 'react';
import { handleMouseOver, handleMouseOut } from '../businessLogic/events';

export default class Point extends React.Component {

	render() {
		const { cx, cy, r, stroke, group, onPointClick, onPointHover, point, svgId, tooltipClass, dotClass } = this.props;
		return (
			<circle 
				cx={cx} 
				cy={cy}
				r={r} 
				stroke={stroke}
				className={dotClass}
				group={group}
				onClick={(e) => this.props.onPointClick(e, point)}
				onMouseOver={(e) => handleMouseOver(e, onPointHover(point), svgId, tooltipClass)}				
				onMouseOut={() => handleMouseOut(tooltipClass)} />
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
	tooltipClass: PropTypes.string,
	dotClass: PropTypes.string,
	svgId: PropTypes.string
};