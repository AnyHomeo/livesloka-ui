import {IconButton, makeStyles, MenuItem, Menu} from "@material-ui/core"
import {Folder, Edit, Trash} from "react-feather"
import React from "react"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import {Link} from "react-router-dom"
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
		justifyContent: "space-between",
	},
	menuIcons: {
		color: "#34495e",
		marginRight: 20,
	},
}))

const Foldercard = ({item}) => {
	const classes = useStyles()

	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<>
			<div className={classes.folderCard}>
				<Link to={`/video-folders/${item._id}`}>
					<div style={{display: "flex"}}>
						<Folder style={{color: "#636e72"}} />

						<p style={{marginLeft: 10, color: "#636e72"}}>{item.name}</p>
					</div>
				</Link>
				<div>
					<IconButton>
						<MoreVertIcon onClick={handleClick} />
					</IconButton>
				</div>
			</div>

			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<MenuItem onClick={handleClose}>
					{" "}
					<Edit className={classes.menuIcons} /> Edit
				</MenuItem>
				<MenuItem style={{marginTop: 10}} onClick={handleClose}>
					{" "}
					<Trash className={classes.menuIcons} /> Delete
				</MenuItem>
			</Menu>
		</>
	)
}

export default Foldercard
