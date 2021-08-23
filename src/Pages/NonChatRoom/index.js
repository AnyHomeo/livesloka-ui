import React from "react"
import NonSidebar from "./NonChat/NonSidebar"
import NonChat from "./NonChat/NonChat"
import "./index.css"
import {useParams} from "react-router"
import {makeStyles, Paper, Tab, Tabs} from "@material-ui/core"
import {useHistory} from "react-router-dom"

const ChatRoom = () => {
	const {roomID} = useParams()
	const history = useHistory()
	console.log(roomID)

	const useStyles = makeStyles({
		root: {
			flexGrow: 1,
		},
	})
	const classes = useStyles()
	const [value, setValue] = React.useState(1)

	const handleChange = (event, newValue) => {
		if (value !== newValue) {
			if (newValue === 1) {
				history.push("/nonroom")
			} else if (newValue === 0) {
				history.push("/room")
			}
		}
	}
	return (
		<div className="app">
			<div className="app_body">
				<NonSidebar></NonSidebar>
				{!!roomID ? (
					<NonChat />
				) : (
					<Paper className={classes.root}>
						<Tabs
							value={value}
							onChange={handleChange}
							indicatorColor="primary"
							textColor="primary"
							centered
						>
							<Tab label="Room" />
							<Tab label="Non Room" />
						</Tabs>
					</Paper>
				)}
			</div>
		</div>
	)
}

export default ChatRoom
