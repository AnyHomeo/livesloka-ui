import {Container, Grid, makeStyles} from "@material-ui/core"
import React from "react"
import {Folder} from "react-feather"
import {useParams} from "react-router-dom"
import {Link} from "react-router-dom"
const useStyles = makeStyles(() => ({
	folderCard: {
		height: 50,
		width: 150,
		border: "0.5px solid #34495e",
		borderRadius: 5,
		display: "flex",
		alignItems: "center",
		padding: 5,
		cursor: "pointer",
		margin: 10,
		justifyContent: "space-between",
	},
	menuIcons: {
		color: "#34495e",
		marginRight: 20,
	},
}))

const Videomanager = () => {
	const classes = useStyles()
	const params = useParams()

	return (
		<div style={{height: "100vh", width: "100%"}}>
			<Container>
				<Grid container direction="row" justifyContent="center" alignItems="center">
					<div className={classes.folderCard}>
						<Link to={`/video-folders/video/${params.id}`}>
							<div style={{display: "flex"}}>
								<Folder style={{color: "#636e72"}} />

								<p style={{marginLeft: 10, color: "#636e72"}}>Videos</p>
							</div>
						</Link>
					</div>

					<div className={classes.folderCard}>
						<Link to={`/video-folders/certificates/${params.id}`}>
							<div style={{display: "flex"}}>
								<Folder style={{color: "#636e72"}} />

								<p style={{marginLeft: 10, color: "#636e72"}}>Certificates</p>
							</div>
						</Link>
					</div>
				</Grid>
			</Container>
		</div>
	)
}

export default Videomanager
