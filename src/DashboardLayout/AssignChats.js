import React, {useState} from "react"
import clsx from "clsx"
import {makeStyles} from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import {Avatar, Badge, IconButton, ListItemAvatar, ListItemSecondaryAction} from "@material-ui/core"
import {Add, PersonAdd} from "@material-ui/icons"
import Alert from "@material-ui/lab/Alert"
import {useHistory} from "react-router"

const useStyles = makeStyles({
	list: {
		width: 250,
	},
	fullList: {
		width: "auto",
	},
})

export default function AssignChats() {
	const classes = useStyles()
	const history = useHistory()

	const [chats, setChats] = useState([])
	const [nonChats, setNonChats] = useState([])

	const [state, setState] = React.useState({
		right: false,
	})

	const toggleDrawer = (anchor, open) => (event) => {
		if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
			return
		}

		setState({...state, [anchor]: open})
	}

	const list = (anchor) => (
		<div
			className={clsx(classes.list, {
				[classes.fullList]: anchor === "top" || anchor === "bottom",
			})}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<h3
				style={{
					textAlign: "center",
					marginTop: "10px",
				}}
			>
				Assign Website Chats
			</h3>

			<List
				style={{
					maxHeight: "43vh",
					overflow: "auto",
					marginBottom: "10px",
				}}
			>
				{chats.map((el) => (
					<ListItem>
						<ListItemAvatar>
							<Avatar>S</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Sumanth Ale" secondary={true ? "Hello" : null} />
						<ListItemSecondaryAction>
							<IconButton edge="end" aria-label="delete" onClick={() => history.push("/nonroom")}>
								<Add />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
				{chats.length <= 0 && <Alert severity="success">No New Chats</Alert>}
			</List>
			<h3
				style={{
					textAlign: "center",
					marginTop: "10px",
				}}
			>
				Assign User Chats
			</h3>

			<List style={{maxHeight: "44vh", overflow: "auto"}}>
				{nonChats.map((el) => (
					<ListItem>
						<ListItemAvatar>
							<Avatar>S</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Sumanth Ale" secondary={true ? "I am a message" : null} />
						<ListItemSecondaryAction>
							<IconButton edge="end" aria-label="delete">
								<Add />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
				{nonChats.length <= 0 && <Alert severity="success">No New Chats </Alert>}
			</List>
		</div>
	)

	return (
		<div>
			<React.Fragment key={"right"}>
				<Badge
					onClick={toggleDrawer("right", true)}
					style={{
						cursor: "pointer",
					}}
					badgeContent={chats.length + nonChats.length}
					color="error"
				>
					<PersonAdd />
				</Badge>
				<Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false)}>
					{list("right")}
				</Drawer>
			</React.Fragment>
		</div>
	)
}
