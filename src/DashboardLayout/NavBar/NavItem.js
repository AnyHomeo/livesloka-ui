import React from "react"
import {NavLink as RouterLink} from "react-router-dom"
import clsx from "clsx"
import PropTypes from "prop-types"
import {
	Button,
	Collapse,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
} from "@material-ui/core"
import InboxIcon from "@material-ui/icons/MoveToInbox"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"

const useStyles = makeStyles((theme) => ({
	item: {
		display: "flex",
		paddingTop: 0,
		paddingBottom: 0,
	},
	button: {
		color: theme.palette.text.secondary,
		fontWeight: theme.typography.fontWeightMedium,
		justifyContent: "flex-start",
		letterSpacing: 0,
		padding: "10px 8px",
		textTransform: "none",
		width: "100%",
	},
	icon: {
		marginRight: theme.spacing(1),
	},
	title: {
		marginRight: "auto",
		fontWeight: "bold",
	},
	active: {
		color: theme.palette.primary.main,
		"& $title": {
			fontWeight: "bold",
		},
		"& $icon": {
			color: theme.palette.primary.main,
			fontWeight: "bold",
		},
	},
}))

const NavItem = ({className, href, icon: Icon, title, onClick, ...rest}) => {
	const classes = useStyles()

	const [open, setOpen] = React.useState(true)

	const handleClick = () => {
		setOpen(!open)
	}

	return (
		<>
			<List component="div" disablePadding>
				<ListItem
					className={clsx(classes.item, className)}
					disableGutters
					onClick={onClick}
					{...rest}
				>
					<Button
						activeClassName={classes.active}
						className={classes.button}
						component={RouterLink}
						to={href}
					>
						{Icon && <Icon className={classes.icon} size="20" />}
						<span className={classes.title}>{title}</span>
					</Button>
				</ListItem>
			</List>
		</>
	)
}

NavItem.propTypes = {
	className: PropTypes.string,
	href: PropTypes.string,
	icon: PropTypes.elementType,
	title: PropTypes.string,
}

export default NavItem
