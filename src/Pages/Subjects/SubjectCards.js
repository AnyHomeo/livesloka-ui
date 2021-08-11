import {makeStyles} from "@material-ui/core"
import React from "react"
import {Calendar, Trash2, Copy} from "react-feather"
import {Avatar, IconButton} from "@material-ui/core"
import moment from "moment"
const useStyles = makeStyles({
	container: {
		marginTop: 30,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	card: {
		height: 80,
		width: "100%",
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
		borderRadius: 10,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
	},
	info: {
		display: "flex",
		alignItems: "center",
		flex: 0.333,
	},
})
const SubjectCards = ({data}) => {
	const classes = useStyles()
	return (
		<>
			{data && (
				<div style={{marginTop: 30}}>
					<div className={classes.card}>
						<div className={classes.info}>
							<Avatar style={{backgroundColor: "#e67e22"}}>{data.name[0]}</Avatar>
							<div>
								<p style={{marginLeft: 10}}>{data.name}</p>
								<p style={{marginLeft: 10, fontSize: 12}}>{data.description}</p>
							</div>
						</div>

						<div style={{display: "flex", flex: 0.333}}>
							<Calendar />{" "}
							<p style={{marginLeft: 10}}>{moment(data.create_time).format("MMMM Do YYYY")}</p>
						</div>

						<div>
							<IconButton>
								<Copy />
							</IconButton>
							<IconButton>
								<Trash2 />
							</IconButton>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default SubjectCards
