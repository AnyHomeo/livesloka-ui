import React from "react"
import {Link as RouterLink} from "react-router-dom"
import PropTypes from "prop-types"
import {Avatar, Box, Divider, Drawer, List, Typography, makeStyles} from "@material-ui/core"
import {
	Lock as LockIcon,
	Settings as SettingsIcon,
	User as UserIcon,
	FileText,
	Edit,
	Trello,
	DollarSign,
	BarChart,
	Video,
	BarChart2,
	UserMinus,
	UserCheck,
	Sun,
	Users,
	MessageCircle,
	AlignJustify,
	Film,
} from "react-feather"
import NavItem from "./NavItem"
import useWindowDimensions from "../../Components/useWindowDimensions"
import AccountBalanceOutlinedIcon from "@material-ui/icons/AccountBalanceOutlined"
import {isAutheticated} from "../../auth"

const useStyles = makeStyles(() => ({
	mobileDrawer: {
		width: 256,
	},
	desktopDrawer: {
		width: 256,
		top: 64,
		height: "calc(100% - 64px)",
	},
	avatar: {
		cursor: "pointer",
		width: 64,
		height: 64,
		backgroundColor: "#f39c12",
	},
	name: {
		fontWeight: "bold",
		marginTop: "10px",
		textTransform: "capitalize",
	},
	iconName: {
		fontWeight: "bold",
		textTransform: "capitalize",
		fontSize: 20,
		color: "white",
	},
}))

const NavBar = ({onMobileClose, openMobile}) => {
	const {width} = useWindowDimensions()

	const items = [
		{
			href: width <= 550 ? "/customer-data-mobile" : "/customer-data",
			icon: FileText,
			title: "Customer Data",
			permission: "Customer Data",
		},
		{
			href: "/summercamps",
			icon: Sun,
			title: "Summer Camp Data",
			permission: "Customer Data",
		},
		{
			href: "/add-fields",
			icon: Edit,
			title: "Add Fields",
			permission: "Add Fields",
		},
		{
			href: "/attendance",
			icon: Trello,
			title: "Attendance",
			permission: "Attendance",
		},
		{
			href: "/scheduler",
			icon: UserIcon,
			title: "Timetable",
			permission: "Timetable",
		},
		{
			href: "/meeting-scheduler",
			icon: SettingsIcon,
			title: "Scheduler",
			permission: "Timetable",
		},
		{
			href: "/leaves",
			icon: UserMinus,
			title: "Leaves",
			permission: "Leaves",
		},
		{
			href: "/reset/password",
			icon: LockIcon,
			title: "Reset Password",
			permission: "Reset Password",
		},
		{
			href: "/zoom-dashboard",
			icon: Video,
			title: "Zoom Dashboard",
			permission: "Zoom Dashboard",
		},
		{
			href: "/teacherDetails",
			icon: Trello,
			title: "Teachers Data",
			permission: "Teachers Data",
		},
		{
			href: "/teacher-salary",
			icon: BarChart2,
			title: "Teachers Salary",
			permission: "Teachers Salary",
		},
		{
			href: "/statistics",
			icon: BarChart,
			title: "Statistics",
			permission: "Statistics",
		},
		{
			href: "/dashboard",
			icon: DollarSign,
			title: "Financial Dashboard",
			permission: "Financial Dashboard",
		},
		{
			href: "/room",
			icon: MessageCircle,
			title: "Rooms",
			permission: "Messages",
		},
		{
			href: "/nonroom",
			icon: MessageCircle,
			title: "Non Rooms",
			permission: "Messages",
		},
		{
			href: "/payments",
			icon: DollarSign,
			title: "Payments",
			permission: "Payments",
		},
		{
			href: "/update/classes",
			icon: UserCheck,
			title: "Update Classes Paid",
			permission: "Update Classes Paid",
		},
		{
			href: "/inclass",
			icon: Users,
			title: "Demo/Inclass Students",
			permission: "Demo/Inclass Students",
		},
		{
			href: "/careers",
			icon: Trello,
			title: "Careers Applications",
			permission: "Careers Applications",
		},
		{
			href: "/notifications",
			icon: MessageCircle,
			title: "Broadcast Notifications",
			permission: "Broadcast Notifications",
		},
		{
			href: "/financial",
			icon: AccountBalanceOutlinedIcon,
			title: "Financial Dashboard",
			permission: "Financial Dashboard",
		},
		{
			href: "/options",
			icon: AlignJustify,
			title: "Options",
			permission: "Options",
		},
		{
			href: "/products",
			icon: DollarSign,
			title: "Paypal & Stripe",
			permission: "Paypal & Stripe",
		},
		{
			href: "/video-folders",
			icon: Film,
			title: "Video Manager",
			permission: "Video Manager",
		},

		{
			href: "/accountant/finance",
			icon: BarChart,
			title: "Financial Dashboard",
			permission: "Financial Dashboard",
		},
	]

	const classes = useStyles()
	const user = isAutheticated()

	console.log(user)

	const content = (
		<Box height="100%" display="flex" flexDirection="column" className="backgroundimage">
			<Box alignItems="center" display="flex" flexDirection="column" p={2}>
				<Avatar className={classes.avatar} component={RouterLink} to="/dashboard">
					<Typography color="textSecondary" variant="body2" className={classes.iconName}>
						{user.AgentName[0]}
					</Typography>
				</Avatar>
				<Typography className={classes.name} color="textPrimary" variant="h5">
					{user.AgentName}
				</Typography>
				<Typography color="textSecondary" variant="body2" className={classes.name}>
					{user?.role?.name}
				</Typography>
			</Box>
			<Divider />
			<Box p={2}>
				<List>
					{items.reduce((navItems, item) => {
						if (user?.role?.permissions?.includes(item.permission)) {
							navItems.push(
								<NavItem
									href={item.href}
									key={item.title}
									onClick={onMobileClose}
									title={item.title}
									icon={item.icon}
								/>
							)
						}
						return navItems
					}, [])}
				</List>
			</Box>
			<Box flexGrow={1} />
		</Box>
	)

	return (
		<>
			<Drawer
				anchor="left"
				classes={{paper: classes.mobileDrawer}}
				onClose={onMobileClose}
				open={openMobile}
				variant="temporary"
			>
				{content}
			</Drawer>
		</>
	)
}

NavBar.propTypes = {
	onMobileClose: PropTypes.func,
	openMobile: PropTypes.bool,
}

NavBar.defaultProps = {
	onMobileClose: () => {},
	openMobile: false,
}

export default NavBar
