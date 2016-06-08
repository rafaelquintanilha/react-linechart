import React, { Component } from 'react';
import GreetingBox from '../components/GreetingBox';

class GreetingBoxComponent extends Component {

	constructor(props) {
		super(props);
		this.state = { greetingText: "Hello, ol' friend!" };
	}

	setGreetingText(text) {
		this.setState({ greetingText: text });
	}
	
	render() {
		const { greetingText } = this.state;		
		return (
			<GreetingBox greetingText={greetingText} setGreetingText={this.setGreetingText.bind(this)} />
		);
	}
}

export default GreetingBoxComponent;