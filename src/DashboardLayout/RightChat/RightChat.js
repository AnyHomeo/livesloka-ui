import React from "react"
import {makeStyles, useTheme} from "@material-ui/core/styles"
import GlobalChat from "../../Components/GlobalChat"
export default function RightChat({rightChatOpen, setRightChatOpen}) {
	return (
		<div>
			<GlobalChat rightChatOpen={rightChatOpen} setRightChatOpen={setRightChatOpen} />
		</div>
	)
}
