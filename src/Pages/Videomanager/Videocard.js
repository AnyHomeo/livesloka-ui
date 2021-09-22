import {makeStyles} from "@material-ui/core"
import {Film} from "react-feather"
import React from "react"
import Vimeo from "@u-wave/react-vimeo"
const useStyles = makeStyles(() => ({
	folderCard: {
		height: 250,
		width: 250,
		border: "0.5px solid #34495e",
		borderRadius: 5,
		display: "flex",
		alignItems: "center",
		cursor: "pointer",
		margin: 10,
		flexDirection: "column",
		overflow: "hidden",
	},
}))

const Videocard = ({item}) => {
	var url = item.url
	var regExp = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:(?:[a-z0-9]*\/)*\/?)?([0-9]+)/
	var match = url.match(regExp)
	const classes = useStyles()
	return (
		<div className={classes.folderCard}>
			{match && <Vimeo width="250px" height="150px" video={match[1]} />}

			<div style={{display: "flex", padding: 5}}>
				<Film style={{color: "#636e72"}} />

				<p style={{marginLeft: 10, color: "#636e72"}}>{item.name}</p>
			</div>
			<p style={{padding: 5, textAlign: "center", color: "#636e72"}}>{item.description}</p>
		</div>
	)
}

export default Videocard
