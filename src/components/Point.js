import React, { PropTypes } from 'react';

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
				onClick={(e) => this.props.onClick(e, this.props.point)}
				onMouseOver={(e) => this.props.onMouseOver(e, this.props.point)}
				onMouseOut={() => this.props.onMouseOut()} />
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
	onClick: PropTypes.func,
	onMouseOver: PropTypes.func,
	onMouseOut: PropTypes.func
};