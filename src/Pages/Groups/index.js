import React from "react"
import Group from "./Group/Group"
import GroupSidebar from "./Group/GroupSidebar"
import {useParams} from "react-router"
import {makeStyles, Paper, Tab, Tabs} from "@material-ui/core"
import {useHistory} from "react-router-dom"

const Groups = React.memo(() => {
	const {groupID} = useParams()
	const history = useHistory()
	console.log("Groups Rerendering")

	const useStyles = makeStyles({
		root: {
			flexGrow: 1,
		},
	})
	const classes = useStyles()
	const [value, setValue] = React.useState(2)

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
	}

	return (
		<div className="app">
			<div className="app_body">
				<GroupSidebar></GroupSidebar>
				{!!groupID ? (
					<Group />
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
})

export default Groups
