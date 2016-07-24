import React, { PropTypes } from 'react';
import { handleMouseOver, handleMouseOut } from '../businessLogic/events';

export default class Line extends React.Component {

	generateText() {
		const { d, onTextClick, name, onTextHover, svgId, tooltipClass } = this.props;

		// Position after end of line
		const [x, y] = d.split("L")[1].split(",");

		// Style if there's a function bound
		const style = typeof onTextClick === "function" ? { cursor: "pointer" } : null;
		const onClick = typeof onTextClick === "function" ? () => onTextClick(name) : null;

		const onMouseOver = typeof onTextHover === "function"
			? (e) => handleMouseOver(e, onTextHover(name), svgId, tooltipClass)
			: null;
		const onMouseOut = typeof onTextHover === "function" ? () => handleMouseOut(tooltipClass) : null;

		return (
			<text 
				onClick={onClick}
				onMouseOver={onMouseOver}				
				onMouseOut={onMouseOut}
				style={style} 
				x={parseFloat(x) + 5} 
				y={parseFloat(y) + 5}>
					{name}
			</text>
		);
	}

	render() {		
		const text = this.props.isStair ? this.generateText() : null; 	
		return (
			<g id={this.props.id} className="line">
				<path 
					stroke={this.props.stroke}
					d={this.props.d}
					strokeWidth={this.props.strokeWidth}
					fill="none" />
				{text}				
			</g>
		);
	}
}

Line.propTypes = {	
	id: PropTypes.string,
	svgId: PropTypes.string,
	name: PropTypes.string,
	stroke: PropTypes.string,
	strokeWidth: PropTypes.number,
	tooltipClass: PropTypes.string,
	isStair: PropTypes.bool,
	d: PropTypes.string,
	onTextClick: PropTypes.func,
	onTextHover: PropTypes.func
};