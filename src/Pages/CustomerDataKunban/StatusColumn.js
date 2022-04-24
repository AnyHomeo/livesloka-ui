import {makeStyles} from "@material-ui/core"
import React from "react"

const useStyles = makeStyles({
	root: {
		height: 60,
		width: 250,
		borderTop: "4px solid #45aaf2",
		borderRadius: 3,
		padding: 5,
		background: "#f5f6fa",
		// marginBottom: 15,
		boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
	},
})
const StatusColumn = ({data}) => {
	const classes = useStyles()
	return (
		<div className={classes.root}>
			<p style={{fontWeight: 600}}>{data.data.classStatusName}</p>
			<span style={{display: "flex", justifyContent: "space-between"}}>
				<p style={{fontSize: 14}}>{"$50.00"}</p>
				<p style={{fontSize: 14, color: "#2d3436"}}> {data.data.admission} Admission</p>
			</span>
		</div>
	)
}

export default StatusColumn
