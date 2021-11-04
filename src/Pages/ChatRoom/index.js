import React, {useEffect} from "react"
import Sidebar from "./Chat/Sidebar"
import Chat from "./Chat/Chat"
import {useParams} from "react-router"
import {makeStyles, Paper, Tab, Tabs} from "@material-ui/core"
import {useHistory} from "react-router-dom"

const ChatRoom = () => {
	const {roomID} = useParams()
	const history = useHistory()

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
			} else if (newValue === 2) {
				history.push("/group")
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
					<Paper
						className={classes.root}
						style={{
							flex: "0.75 1",
						}}
					>
						<Tabs
							value={value}
							onChange={handleChange}
							indicatorColor="primary"
							textColor="primary"
							centered
						>
							<Tab label="Room" />
							<Tab label="Non Room" />
							<Tab label="Groups" />
						</Tabs>
					</Paper>
				)}
			</div>
		</div>
	)
}

export default ChatRoom
