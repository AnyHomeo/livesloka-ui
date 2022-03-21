import {EXPAND_ALL} from "./Types"

export default (state, action) => {
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
