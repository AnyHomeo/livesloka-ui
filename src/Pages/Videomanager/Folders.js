import {Container, Grid, makeStyles, MenuItem, Menu, IconButton} from "@material-ui/core"
import React, {useState, useEffect} from "react"
import Foldercard from "./Foldercard"
import {FolderPlus, Plus} from "react-feather"
import AddFolderModal from "./AddFolderModal"
import Axios from "axios"
import {Link} from "react-router-dom"
const useStyles = makeStyles(() => ({
	root: {
		cursor: "context-menu",
		height: "100vh",
		width: "100%",
	},
}))
const initialState = {
	mouseX: null,
	mouseY: null,
}

const Folders = () => {
	useEffect(() => {
		getFolderNames()
	}, [])
	const classes = useStyles()
	const [openAddFolder, setOpenAddFolder] = useState(false)
	const [containerRightClick, setContainerRightClick] = useState(initialState)
	const [folderData, setFolderData] = useState()
	const [folderRightClick, setfolderRightClick] = useState(initialState)
	const handleContainerClick = (event) => {
		event.preventDefault()
		setContainerRightClick({
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
		})
	}
	const handleFolderClick = (event) => {
		event.preventDefault()
		setfolderRightClick({
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
		})
	}

	const handleContainerClose = () => {
		setContainerRightClick(initialState)
	}

	const handleFolderClose = () => {
		setfolderRightClick(initialState)
	}

	const getFolderNames = async () => {
		try {
			const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/admin/get/VideoCategories`)

			console.log(data)
			setFolderData(data?.data?.result)
		} catch (error) {}
	}

	const getBackData = (flag) => {
		if (flag) {
			getFolderNames()
		}
	}
	return (
		<div className={classes.root} onContextMenu={handleContainerClick}>
			<Container>
				<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
					<div></div>

					<div>
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
								onClick={() => setOpenAddFolder(!openAddFolder)}
							>
								<Plus style={{color: "white"}} />
							</IconButton>
							<p>Add Folder</p>
						</div>
					</div>
				</div>
				<Grid container direction="row" justifyContent="center" alignItems="center">
					{folderData &&
						folderData.map((item) => (
							<Grid onContextMenu={handleContainerClick} item sm={3} key={item._id}>
								<Foldercard item={item} />
							</Grid>
						))}
				</Grid>
			</Container>

			<AddFolderModal open={openAddFolder} setOpen={setOpenAddFolder} getBackData={getBackData} />
		</div>
	)
}

export default Folders
