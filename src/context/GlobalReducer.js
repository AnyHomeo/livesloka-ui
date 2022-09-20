import {EXPAND_ALL} from "./Types"

const globalReducer = (state, action) => {
	switch (action.type) {
		case EXPAND_ALL:
			return {
				...state,
				expandAll: action.payload,
			}
		default:
			return state
	}
}

export default globalReducer
