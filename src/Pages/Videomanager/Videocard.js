import {IconButton, makeStyles} from "@material-ui/core"
import {Edit, Trash} from "react-feather"
import React from "react"
import Vimeo from "@u-wave/react-vimeo"
import {useConfirm} from "material-ui-confirm"

import Axios from "axios"
const useStyles = makeStyles(() => ({
	folderCard: {
		height: 250,
		width: 250,
		borderRadius: 10,
		display: "flex",
		alignItems: "center",
		cursor: "pointer",
		margin: 10,
		flexDirection: "column",
		overflow: "hidden",
		backgroundColor: "white",
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
	},
}))

const Videocard = ({item, getBackData, open, setOpen, setUpdateVidoeFlag, setUpdateVideoData}) => {
	const confirm = useConfirm()

	const classes = useStyles()
	if (item.url === "") {
		return null
	}

	let url = item.url
	let regExp = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:(?:[a-z0-9]*\/)*\/?)?([0-9]+)/
	let match = url.match(regExp)

	const deleteVideo = async () => {
		confirm({title: "Do you want to Delete the video?", confirmationText: "Delete"}).then(
			async () => {
				try {
					const data = await Axios.post(
						`${process.env.REACT_APP_API_KEY}/admin/delete/Videos/${item.id}`
					)

					if (data.status === 200) {
						getBackData(true)
					}
				} catch (error) {}
			}
		)
	}

	const updateVideo = () => {
		setOpen(!open)
		setUpdateVidoeFlag(true)
		setUpdateVideoData(item)
	}
	return (
		<div className={classes.folderCard}>
			{match && <Vimeo width="250px" height="150px" video={match[1]} />}

			<div
				style={{
					display: "flex",
					alignItems: "center",
					width: "100%",
					padding: 10,
					flexDirection: "column",
				}}
			>
				<div>
					<div>
						<p style={{marginLeft: 10, fontWeight: "bold"}}>{item.name}</p>
					</div>
				</div>
				<div>
					<div>
						<IconButton onClick={deleteVideo}>
							<Trash />
						</IconButton>
						<IconButton onClick={updateVideo}>
							<Edit />
						</IconButton>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Videocard
