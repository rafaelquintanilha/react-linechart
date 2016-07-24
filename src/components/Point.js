import React, { PropTypes } from 'react';
import { handleMouseOver, handleMouseOut } from '../businessLogic/events';

export default class Point extends React.Component {

	render() {
		const { cx, cy, r, stroke, group, onPointClick, onPointHover, point, svgId, tooltipClass, pointClass } = this.props;
		const onMouseOver = typeof onPointHover === "function"
			? (e) => handleMouseOver(e, onPointHover(point), svgId, tooltipClass)
			: null;
		const onMouseOut = typeof onPointHover === "function" ? () => handleMouseOut(tooltipClass) : null;
		return (
			<circle 
				cx={cx} 
				cy={cy}
				r={r} 
				stroke={stroke}
				className={pointClass}
				group={group}
				onClick={(e) => this.props.onPointClick(e, point)}
				onMouseOver={onMouseOver}
				onMouseOut={onMouseOut} />
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
	pointClass: PropTypes.string,
	svgId: PropTypes.string
};