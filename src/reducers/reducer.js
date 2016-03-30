const initialState = {
	'greetingText': "Hello my friend!"
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
	case "SET_GREETING_TEXT":
		return Object.assign(
			{}, 
			state,
			{ greetingText: action.text }
		);

	default:
		return state;
	}
}
