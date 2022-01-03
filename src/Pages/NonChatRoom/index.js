import React, {useState} from "react"
import NonSidebar from "./NonChat/NonSidebar"
import NonChat from "./NonChat/NonChat"
import {useParams} from "react-router"
import {
	Box,
	FormControlLabel,
	makeStyles,
	Paper,
	Switch,
	Tab,
	Tabs,
	TextField,
} from "@material-ui/core"
import {useHistory} from "react-router-dom"

import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"

const ChatRoom = () => {
	const {roomID} = useParams()
	const history = useHistory()

	const useStyles = makeStyles({
		root: {
			flexGrow: 1,
		},
	})
	const classes = useStyles()
	const [value, setValue] = useState(1)
	const [isClosed, SetIsClosed] = useState(false)

	const handleChange = (event, newValue) => {
		console.log(newValue)
		if (value !== newValue) {
			if (newValue === 1) {
				history.push("/nonroom")
			} else if (newValue === 0) {
				history.push("/room")
			} else if (newValue === 2) {
				history.push("/group")
			}
		}
	}
	const handelClosed = async (event) => {
		SetIsClosed(event.target.checked)
		// try {
		// 	await axios.post(`${process.env.REACT_APP_API_KEY}/closeGroup`, {
		// 		groupID,
		// 		isClosed: event.target.checked,
		// 	})
		// } catch (error) {
		// 	SetIsClosed(isClosed)
		// }
	}
	return (
		<div className="app">
			<div className="app_body">
				<NonSidebar></NonSidebar>
				{!!roomID ? (
					<NonChat />
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

						<Box display="flex" justifyContent="center" alignItems="center" marginTop={"25vh"}>
							{" "}
							<Card style={{minWidth: 275}}>
								<CardContent>
									<Typography className={classes.title} color="textSecondary" gutterBottom>
										<TextField id="standard-basic" label="Standard" />
									</Typography>
									<FormControlLabel
										control={<Switch checked={isClosed} onChange={handelClosed} />}
										label={`${isClosed ? "Open Chat" : "Hide Chat"}`}
									/>
								</CardContent>
								<CardActions>
									<Button size="small">Learn More</Button>
								</CardActions>
							</Card>
						</Box>
					</Paper>
				)}
			</div>
		</div>
	)
}

export default ChatRoom
