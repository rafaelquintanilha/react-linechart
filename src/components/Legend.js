import React, { PropTypes } from 'react';

export default class Legend extends React.Component {

	render() {
		const { rectWidth, rectHeight, rectX, rectY, textX, textY, name, color } = this.props;
		return (
			<g className="legend">
				<rect 
					width={rectWidth}
					height={rectHeight}
					fill={color}
					transform={`translate(${rectX}, ${rectY})`} />
				<text
					fontSize="13px"
					transform={`translate(${textX}, ${textY})`}>
					{name}
				</text>
			</g>
		);
	}
}

Legend.propTypes = {
	color: PropTypes.string,
	name: PropTypes.string,
	rectWidth: PropTypes.number,
	rectHeight: PropTypes.number,
	rectX: PropTypes.number,
	rectY: PropTypes.number,
	textX: PropTypes.number,
	textY: PropTypes.number
};