import React from "react"
import {ReactSVG} from "react-svg"
import {IconButton} from "@material-ui/core"
import TextareaAutosize from "react-autosize-textarea";
import "./SingleNotification.css"

function SingleNotification({icon, color, title, text, setNotificationData}) {
	return (
		<div className="notification-wrapper">
			<div
				className="icon-wrapper"
				style={{
					borderLeftColor: typeof color === "object" ? color.hex : color,
				}}
			>
				<ReactSVG
					style={{
						backgroundColor: typeof color === "object" ? color.hex : color,
					}}
					className="icon-circle"
					src={require(`./icons/${icon}.svg`)}
				/>
			</div>
			<div className="text-area">
				<input
					placeholder={"Type title here..."}
					className="title"
					value={title}
					onChange={(e) => setNotificationData((prev) => ({...prev, title: e.target.value}))}
				/>
				<TextareaAutosize
					placeholder={"Type text here..."}
					className="text"
					value={text}
					onChange={(e) => setNotificationData((prev) => ({...prev, text: e.target.value}))}
				/>
			</div>
			<IconButton size="small">
				<ReactSVG className="close-icon" src={require(`./icons/x.svg`)} />
			</IconButton>
		</div>
	)
}

export default SingleNotification
