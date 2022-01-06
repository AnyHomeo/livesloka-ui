import React from "react"
import {makeStyles, useTheme} from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"

import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import CloseIcon from "@material-ui/icons/Close"
import Chat from "@material-ui/icons/Chat"
import GlobalChat from "./GlobalChat"

const style = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	border: "solid 1px #ddd",
}

const drawerWidth = 350

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	appBar: {
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginRight: drawerWidth,
	},
	title: {
		flexGrow: 1,
	},
	hide: {
		display: "none",
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: "space-between",
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginRight: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginRight: 0,
	},
}))

export default function ChatDrawer({open, setOpen}) {
	// console.log(open)
	const classes = useStyles()
	// const [open, setOpen] = React.useState(false)

	// const handleDrawerOpen = () => {
	// 	if (setOpen !== undefined) {
	// 		setOpen(true)
	// 	}
	// }

	const handleDrawerClose = () => {
		if (setOpen !== undefined) {
			setOpen(false)
		}
	}

	return (
		<div className={classes.root}>
			<Resizable
				defaultSize={{
					width: 500,
					height: "100vh",
				}}
			>
				<div
					style={{
						marginTop: 80,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<IconButton>{<ChevronLeftIcon />}</IconButton>
					<div>Non Rooms</div>
					<IconButton onClick={handleDrawerClose}>{<CloseIcon />}</IconButton>
				</div>
				<Divider />

				{open && (
					<div>
						<GlobalChat />
					</div>
				)}
			</Resizable>
			{/* <Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="right"
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton>{<ChevronLeftIcon />}</IconButton>
					<div>Non Rooms</div>
					<IconButton onClick={handleDrawerClose}>{<CloseIcon />}</IconButton>
				</div>
				<Divider />
				{open && <GlobalChat />}
			</Drawer> */}
		</div>
	)
}
