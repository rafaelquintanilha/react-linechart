import React, { PropTypes } from 'react';
import { handleMouseOver, handleMouseOut } from '../businessLogic/events';

export default class Line extends React.Component {

	generateText() {
		const { d, onTextClick, name, onTextHover, svgId, tooltipClass } = this.props;
		const [x, y] = d.split("L")[1].split(",");
		const style = typeof onTextClick === "function" ? { cursor: "pointer" } : null;
		const onClick = typeof onTextClick === "function" ? () => onTextClick(name) : null;
		const html = onTextHover(name);
		return (
			<text 
				onClick={onClick}
				onMouseOver={(e) => handleMouseOver(e, html, svgId, tooltipClass)}				
				onMouseOut={() => handleMouseOut(tooltipClass)}
				style={style} 
				x={parseFloat(x) + 5} 
				y={parseFloat(y) + 5}>
					{name}
			</text>
		);
	}

	render() {
		let text = null;		
		if ( this.props.isStair ) text = this.generateText();
				
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