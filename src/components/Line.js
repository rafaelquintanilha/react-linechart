import React, { PropTypes } from 'react';
import { handleMouseOver, handleMouseOut } from '../businessLogic/events';

export default class Line extends React.Component {

	generateText() {
		const [x, y] = this.props.d.split("L")[1].split(",");
		const style = typeof this.props.onTextClick === "function" ? { cursor: "pointer" } : null;
		const onClick = typeof this.props.onTextClick === "function" ? () => this.props.onTextClick(this.props.name) : null;
		return (
			<text 
				onClick={onClick}
				onMouseOver={(e) => handleMouseOver(e, this.props.onTextHover(this.props.name), this.props.svgId)}				
				onMouseOut={() => handleMouseOut()}
				style={style} 
				x={parseFloat(x) + 5} 
				y={parseFloat(y) + 5}>
					{this.props.name}
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
	isStair: PropTypes.bool,
	d: PropTypes.string,
	onTextClick: PropTypes.func,
	onTextHover: PropTypes.func
};