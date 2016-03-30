import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/actions';
import App from '../components/App';

class AppContainer extends Component {

	static propTypes = {
		actions: PropTypes.object.isRequired,
		state: PropTypes.object.isRequired
	};
	
	render() {
		const { greetingText } = this.props.state;
		const { setGreetingText } = this.props.actions;
		return (
			<App greetingText={greetingText} setGreetingText={setGreetingText} />
		);
	}
}

function mapStateToProps(state) {
	return {
		state: state.reducer
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AppContainer);
