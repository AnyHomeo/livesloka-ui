import React, {useReducer} from "react"
import GlobalContext from "./GlobalContext"
import GlobalReducer from "./GlobalReducer"
import {EXPAND_ALL} from "./Types"

const GlobalState = (props) => {
	const initialState = {
		expandAll: false,
	}

	const [state, dispatch] = useReducer(GlobalReducer, initialState)

	// Set AlertReducer

	const expandAll = (expand) => {
		dispatch({type: EXPAND_ALL, payload: expand})
	}

	return (
		<GlobalContext.Provider
			value={{
				state,
				expandAll,
			}}
		>
			{props.children}
		</GlobalContext.Provider>
	)
}

export default GlobalState
