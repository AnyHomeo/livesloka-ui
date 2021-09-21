import {Container, Grid, makeStyles, MenuItem, Menu} from "@material-ui/core"
import React, {useState, useEffect} from "react"
import Foldercard from "./Foldercard"
import {FolderPlus} from "react-feather"
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
				<Grid container direction="row" justifyContent="center" alignItems="center">
					{folderData &&
						folderData.map((item) => (
							<Grid onContextMenu={handleContainerClick} item sm={3} key={item._id}>
								<Link to={`/video-folders/${item._id}`}>
									<Foldercard item={item} />
								</Link>
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
				<MenuItem onClick={() => setOpenAddFolder(!openAddFolder)} style={{width: 200}}>
					<FolderPlus style={{marginRight: 20}} /> <p style={{marginLeft: 20}}> New Folder</p>
				</MenuItem>
			</Menu>

			<Menu
				keepMounted
				open={folderRightClick.mouseY !== null}
				onClose={handleFolderClose}
				anchorReference="anchorPosition"
				anchorPosition={
					folderRightClick.mouseY !== null && folderRightClick.mouseX !== null
						? {top: folderRightClick.mouseY, left: folderRightClick.mouseX}
						: undefined
				}
			>
				<MenuItem onClick={handleFolderClose}>Testin</MenuItem>
				<MenuItem onClick={handleFolderClose}>Print</MenuItem>
				<MenuItem onClick={handleFolderClose}>Highlight</MenuItem>
				<MenuItem onClick={handleFolderClose}>Email</MenuItem>
			</Menu>

			<AddFolderModal open={openAddFolder} setOpen={setOpenAddFolder} getBackData={getBackData} />
		</div>
	)
}

export default Folders
