import React, { PropTypes } from 'react';

export default class GreetingBox extends React.Component {
	
	handleChange(e) {
		const value = e.target.value;
		this.props.setGreetingText(value);
	}

	render() {
		const { greetingText } = this.props;    
		return (
			<div>
				<input type="text" placeholder="Type a message" onChange={this.handleChange.bind(this)} />
				<p>{greetingText}</p>
			</div>
		);
	}
}

GreetingBox.propTypes = {
	greetingText: PropTypes.string.isRequired,
	setGreetingText: PropTypes.func.isRequired
};