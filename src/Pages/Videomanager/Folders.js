import {Container, Grid, makeStyles, MenuItem, Menu, IconButton} from "@material-ui/core"
import React, {useState, useEffect} from "react"
import Foldercard from "./Foldercard"
import {Plus} from "react-feather"
import AddFolderModal from "./AddFolderModal"
import Axios from "axios"
const useStyles = makeStyles(() => ({
	root: {
		cursor: "context-menu",
		height: "100vh",
		width: "100%",
	},
}))

const Folders = () => {
	useEffect(() => {
		getFolderNames()
	}, [])
	const classes = useStyles()
	const [openAddFolder, setOpenAddFolder] = useState(false)
	const [folderData, setFolderData] = useState()
	const [updateFlag, setUpdateFlag] = useState(false)
	const [updateId, setUpdateId] = useState("")
	const getFolderNames = async () => {
		try {
			const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/admin/get/VideoCategories`)
			setFolderData(data?.data?.result)
		} catch (error) {}
	}

	const getBackData = (flag) => {
		if (flag) {
			getFolderNames()
		}
	}
	return (
		<div className={classes.root}>
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
								onClick={() => {
									setUpdateId()
									setUpdateFlag(false)
									setOpenAddFolder(!openAddFolder)
								}}
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
							<Grid item sm={3} key={item._id}>
								<Foldercard
									item={item}
									getBackData={getBackData}
									open={openAddFolder}
									setOpen={setOpenAddFolder}
									setUpdateFlag={setUpdateFlag}
									updateFlag={updateFlag}
									setUpdateId={setUpdateId}
								/>
							</Grid>
						))}
				</Grid>
			</Container>

			<AddFolderModal
				open={openAddFolder}
				setOpen={setOpenAddFolder}
				getBackData={getBackData}
				updateFlag={updateFlag}
				updateId={updateId}
			/>
		</div>
	)
}

export default Folders
