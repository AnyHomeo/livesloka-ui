import {IconButton, Popover} from "@material-ui/core"
import React from "react"

const copyToClipboard = (text) => {
	var textField = document.createElement("textarea")
	textField.innerText = text
	document.body.appendChild(textField)
	textField.select()
	document.execCommand("copy")
	textField.remove()
}

function CopyIcon({Icon, text}) {
	const [anchorEl, setAnchorEl] = React.useState(null)

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
		copyToClipboard(text)
		setTimeout(() => {
			setAnchorEl(null)
		}, 1000)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const open = Boolean(anchorEl)

	return (
		<>
			<Popover
				id={open ? "simple-popover" : undefined}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
			>
				Copied to clipboard
			</Popover>
			<IconButton
				aria-describedby={open ? "simple-popover" : undefined}
				variant="contained"
				color="primary"
				onClick={handleClick}
			>
				<Icon />
			</IconButton>
		</>
	)
}

export default CopyIcon
