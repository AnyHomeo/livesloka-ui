import {Container, Grid, Menu, MenuItem} from "@material-ui/core"
import Axios from "axios"
import React, {useState, useEffect} from "react"
import {FolderPlus} from "react-feather"
import {useParams} from "react-router-dom"
import AddVideoModal from "./AddVideoModal"
import Videocard from "./Videocard"
const initialState = {
	mouseX: null,
	mouseY: null,
}

const Videomanager = () => {
	const params = useParams()

	const [containerRightClick, setContainerRightClick] = useState(initialState)
	const [openAddVideo, setOpenAddVideo] = useState(false)
	const [videoData, setVideoData] = useState()
	useEffect(() => {
		getVideosById()
	}, [])
	const getVideosById = async () => {
		const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/videos/category/${params.id}`)

		console.log(data)
		setVideoData(data?.data?.result)
	}

	const handleContainerClick = (event) => {
		event.preventDefault()
		setContainerRightClick({
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
		})
	}

	const handleContainerClose = () => {
		setContainerRightClick(initialState)
	}

	const getBackData = (flag) => {
		if (flag) {
			getVideosById()
		}
	}

	return (
		<div style={{height: "100vh", width: "100%"}} onContextMenu={handleContainerClick}>
			<Container>
				<Grid container direction="row" justifyContent="center" alignItems="center">
					{videoData &&
						videoData.map((item) => (
							<Grid item sm={3} key={item._id}>
								<Videocard item={item} />
							</Grid>
						))}
				</Grid>
			</Container>
			<Menu
				keepMounted
				open={containerRightClick.mouseY !== null}
				onClose={handleContainerClose}
				anchorReference="anchorPosition"
				anchorPosition={
					containerRightClick.mouseY !== null && containerRightClick.mouseX !== null
						? {top: containerRightClick.mouseY, left: containerRightClick.mouseX}
						: undefined
				}
			>
				<MenuItem
					onClick={() => {
						setOpenAddVideo(!openAddVideo)
					}}
					style={{width: 200}}
				>
					<FolderPlus style={{marginRight: 20}} /> <p style={{marginLeft: 20}}> New Video</p>
				</MenuItem>
			</Menu>

			<AddVideoModal
				open={openAddVideo}
				setOpen={setOpenAddVideo}
				category={params.id}
				getBackData={getBackData}
			/>
		</div>
	)
}

export default Videomanager
