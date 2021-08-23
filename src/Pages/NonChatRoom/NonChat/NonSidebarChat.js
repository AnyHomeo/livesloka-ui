import React, {useEffect, useState} from "react"
import {Avatar} from "@material-ui/core"
import "./NonSidebarChat.css"
import {Link, useHistory} from "react-router-dom"
import axios from "axios"

function NonSidebarChat({id, name}) {
	const history = useHistory()

	return (
		<div
			className="sidebarChat_head"
			key={id}
			onClick={() => {
				history.push(`/nonroom/${id}`)
			}}
		>
			<div className="sidebarChat">
				<Avatar src={`https://avatars.dicebear.com/api/human/${id}.svg`} />
				<div className="sidebarChat_info">
					<h2>{name.split("@")[0]}</h2>
					{/* <p>{'admin'}</p> */}
				</div>
			</div>
		</div>
	)
}

export default NonSidebarChat
