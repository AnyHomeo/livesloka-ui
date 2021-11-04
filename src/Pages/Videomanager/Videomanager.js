import {Container, Grid, IconButton, makeStyles, Menu, MenuItem} from "@material-ui/core"
import Axios from "axios"
import React, {useState, useEffect} from "react"
import {Folder, Plus} from "react-feather"
import {useParams} from "react-router-dom"
import AddCertificateModal from "./AddCertificateModal"
import AddVideoModal from "./AddVideoModal"
import Videocard from "./Videocard"
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

	const [openAddVideo, setOpenAddVideo] = useState(false)
	const [openAddCertificate, setOpenAddCertificate] = useState(false)
	const [videoData, setVideoData] = useState()
	useEffect(() => {
		getVideosById()
	}, [])
	const getVideosById = async () => {
		const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/videos/category/${params.id}`)

		setVideoData(data?.data?.result)
	}

	const getBackData = (flag) => {
		if (flag) {
			getVideosById()
		}
	}

	return (
		<div style={{height: "100vh", width: "100%"}}>
			<Container>
				{/* <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
					<div></div>

					<div style={{display: "flex"}}>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								marginTop: 10,
							}}
						>
							<IconButton
								style={{
									backgroundColor: "#3867d6",
									boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
									height: 55,
									width: 55,
									marginLeft: 10,
									marginBottom: 10,
								}}
								onClick={() => setOpenAddVideo(!openAddVideo)}
							>
								<Plus style={{color: "white"}} />
							</IconButton>
							<p>Add Video</p>
						</div>

						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								marginTop: 10,
							}}
						>
							<IconButton
								style={{
									backgroundColor: "#3867d6",
									boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
									height: 55,
									width: 55,
									marginLeft: 10,
									marginBottom: 10,
								}}
								onClick={() => setOpenAddCertificate(!openAddCertificate)}
							>
								<Plus style={{color: "white"}} />
							</IconButton>
							<p style={{marginLeft: 20}}>Add Certificate</p>
						</div>
					</div>
				</div> */}

				<Grid container direction="row" justifyContent="center" alignItems="center">
					{/* {videoData &&
						videoData.map((item) => (
							<Grid item sm={3} key={item._id}>
								<Videocard item={item} />
							</Grid>
						))} */}

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

			{/* <AddVideoModal
				open={openAddVideo}
				setOpen={setOpenAddVideo}
				category={params.id}
				getBackData={getBackData}
			/>

			<AddCertificateModal
				open={openAddCertificate}
				setOpen={setOpenAddCertificate}
				category={params.id}
				getBackData={getBackData}
			/> */}
		</div>
	)
}

export default Videomanager
