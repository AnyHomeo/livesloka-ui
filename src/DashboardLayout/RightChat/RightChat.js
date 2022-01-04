import React from "react"
import {Resizable} from "re-resizable"

import GlobalChat from "../../Components/GlobalChat"
export default function RightChat({rightChatOpen, setRightChatOpen}) {
	const style = {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "solid 1px #ddd",
	}

	return (
		<div
		// style={style}
		// defaultSize={{
		// 	width: 1000,
		// 	height: "100vh",
		// }}
		>
			<GlobalChat rightChatOpen={rightChatOpen} setRightChatOpen={setRightChatOpen} />
		</div>
	)
}
