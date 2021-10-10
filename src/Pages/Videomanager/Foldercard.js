import {makeStyles} from "@material-ui/core"
import {Folder} from "react-feather"
import React from "react"
const useStyles = makeStyles(() => ({
	folderCard: {
		height: 50,
		width: "auto",
		border: "0.5px solid #34495e",
		borderRadius: 5,
		display: "flex",
		alignItems: "center",
		padding: 5,
		cursor: "pointer",
		margin: 10,
	},
}))

const Foldercard = ({item}) => {
	const classes = useStyles()

	return (
		<div className={classes.folderCard}>
			<Folder style={{color: "#636e72"}} />

			<p style={{marginLeft: 10, color: "#636e72"}}>{item.name}</p>
		</div>
	)
}

export default Foldercard
