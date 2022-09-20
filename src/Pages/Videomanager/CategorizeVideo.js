import {Container, Grid, IconButton, makeStyles} from "@material-ui/core"
import Axios from "axios"
import React, {useState, useEffect} from "react"
import {Plus} from "react-feather"
import {useParams} from "react-router-dom"
import AddCertificateModal from "./AddCertificateModal"
import AddVideoModal from "./AddVideoModal"
import VideoPage from "./VideoPage"
import CertificatePage from "./CetrificatePage"
import BulkUploadCertificate from "./BulkUploadCertificate"

const CategorizeVideo = () => {
	const params = useParams()

	const [openAddVideo, setOpenAddVideo] = useState(false)
	const [openAddCertificate, setOpenAddCertificate] = useState(false)
	const [videoData, setVideoData] = useState()
	const [certificateData, setCertificateData] = useState()
	const [newVideo, setNewVideo] = useState()
	const [updateVideoData, setUpdateVideoData] = useState()
	const [updateVidoeFlag, setUpdateVidoeFlag] = useState(false)
	const [updateCertificateFlag, setUpdateCertificateFlag] = useState(false)
	const [updateCertificateData, setUpdateCertificateData] = useState()
	const [bulkUploadCertificate, setBulkUploadCertificate] = useState(false)
	useEffect(() => {
		getVideosById()
	}, [])
	const getVideosById = async () => {
		const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/videos/category/${params.id}`)
		setVideoData(data?.data?.result)
		let video = []
		let certificate = []
		data?.data?.result.map((item) => {
			if (item?.url === "") {
				certificate.push(item)
				setCertificateData(certificate)
			} else {
				video.push(item)
				setNewVideo(video)
			}
		})
	}

	const getBackData = (flag) => {
		if (flag) {
			getVideosById()
		}
	}
	return (
		<div style={{height: "100vh", width: "100%"}}>
			<Container>
				<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
					<div></div>

					<div style={{display: "flex"}}>
						{params.type === "video" ? (
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
										marginBottom: 10,
									}}
									onClick={() => {
										setUpdateVidoeFlag(false)
										setUpdateVideoData()
										setOpenAddVideo(!openAddVideo)
									}}
								>
									<Plus style={{color: "white"}} />
								</IconButton>
								<p>Add Video</p>
							</div>
						) : (
							<>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										marginTop: 10,
										marginRight: 10,
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
										onClick={() => {
											setBulkUploadCertificate(!bulkUploadCertificate)
										}}
									>
										<Plus style={{color: "white"}} />
									</IconButton>
									<p>Buld upload</p>
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
										onClick={() => {
											setUpdateCertificateFlag(false)
											setUpdateCertificateData()
											setOpenAddCertificate(!openAddCertificate)
										}}
									>
										<Plus style={{color: "white"}} />
									</IconButton>
									<p>Add Certificate</p>
								</div>
							</>
						)}
					</div>
				</div>

				<Grid container direction="row" justifyContent="center" alignItems="center">
					{params.type === "video" ? (
						<VideoPage
							data={videoData}
							getBackData={getBackData}
							open={openAddVideo}
							setOpen={setOpenAddVideo}
							setUpdateVidoeFlag={setUpdateVidoeFlag}
							setUpdateVideoData={setUpdateVideoData}
						/>
					) : (
						<CertificatePage
							data={videoData}
							getBackData={getBackData}
							open={openAddCertificate}
							setOpen={setOpenAddCertificate}
							setUpdateCertificateFlag={setUpdateCertificateFlag}
							setUpdateCertificateData={setUpdateCertificateData}
						/>
					)}
				</Grid>
			</Container>

			<AddVideoModal
				open={openAddVideo}
				setOpen={setOpenAddVideo}
				category={params.id}
				getBackData={getBackData}
				updateVideoData={updateVideoData}
				updateVidoeFlag={updateVidoeFlag}
			/>

			<AddCertificateModal
				open={openAddCertificate}
				setOpen={setOpenAddCertificate}
				category={params.id}
				getBackData={getBackData}
				updateCertificateData={updateCertificateData}
				updateCertificateFlag={updateCertificateFlag}
			/>

			<BulkUploadCertificate
				open={bulkUploadCertificate}
				setOpen={setBulkUploadCertificate}
				category={params.id}
				getBackData={getBackData}
			/>
		</div>
	)
}

export default CategorizeVideo
