import React, {useEffect} from "react"
import Sidebar from "./Chat/Sidebar"
import Chat from "./Chat/Chat"
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
	const [value, setValue] = React.useState(0)

	const handleChange = (event, newValue) => {
		if (value !== newValue) {
			if (newValue === 1) {
				history.push("/nonroom")
			} else if (newValue === 0) {
				history.push("/room")
			}
		}
		// setValue(newValue)
	}

	return (
		<div className="app">
			<div className="app_body">
				<Sidebar></Sidebar>
				{!!roomID ? (
					<Chat />
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
