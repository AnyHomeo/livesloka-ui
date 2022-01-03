import React from "react"
import {isAutheticated} from "../../auth"
import ChatDrawer from "./ChatDrawer"
import "./globalChat.css"

const Global = () => {
	if (
		(isAutheticated() && isAutheticated().roleId === 3) ||
		isAutheticated().roleId === 4 ||
		isAutheticated().roleId === 5
	)
		return <ChatDrawer />
	else return null
}

export default Global
