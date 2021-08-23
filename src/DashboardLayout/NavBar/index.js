import React, {useEffect, useState} from "react"
import {Link as RouterLink, useLocation} from "react-router-dom"
import PropTypes from "prop-types"
import {Avatar, Box, Divider, Drawer, List, Typography, makeStyles} from "@material-ui/core"
import {isAutheticated} from "../../auth"
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
} from "react-feather"
import NavItem from "./NavItem"
import useWindowDimensions from "../../Components/useWindowDimensions"
import AccountBalanceOutlinedIcon from "@material-ui/icons/AccountBalanceOutlined"

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
			title: "Customers Data",
		},
		{
			href: "/summercamps",
			icon: Sun,
			title: "Summer Camp Data",
		},
		{
			href: "/add-fields",
			icon: Edit,
			title: "Add Fields",
		},
		{
			href: "/attendance",
			icon: Trello,
			title: "Attendance",
		},
		{
			href: "/scheduler",
			icon: UserIcon,
			title: "Timetable",
		},
		{
			href: "/meeting-scheduler",
			icon: SettingsIcon,
			title: "Scheduler",
		},
		{
			href: "/leaves",
			icon: UserMinus,
			title: "Leaves",
		},
		{
			href: "/reset/password",
			icon: LockIcon,
			title: "Reset Password",
		},
		{
			href: "/zoom-dashboard",
			icon: Video,
			title: "Zoom Dashboard",
		},
		{
			href: "/teacherDetails",
			icon: Trello,
			title: "Teachers Data",
		},
		{
			href: "/teacher-salary",
			icon: BarChart2,
			title: "Teachers Salary",
		},
		{
			href: "/statistics",
			icon: BarChart,
			title: "Statistics",
		},
		{
			href: "/dashboard",
			icon: DollarSign,
			title: "Financial Dashboard",
		},
		{
			href: "/room",
			icon: DollarSign,
			title: "Rooms",
		},
		{
			href: "/nonroom",
			icon: DollarSign,
			title: "Non Rooms",
		},
		{
			href: "/payments",
			icon: DollarSign,
			title: "Payments",
		},
		{
			href: "/update/classes",
			icon: UserCheck,
			title: "Update Classes Paid",
		},
		{
			href: "/inclass",
			icon: Users,
			title: "Demo/Inclass Students",
		},
		{
			href: "/careers",
			icon: Trello,
			title: "Careers Applications",
		},
		{
			href: "/notifications",
			icon: MessageCircle,
			title: "Broadcast a Notification",
		},
		{
			href: "/financial",
			icon: AccountBalanceOutlinedIcon,
			title: "Financial",
		},
	]

	const SalesTeam = [
		{
			href: width <= 550 ? "/customer-data-mobile" : "/customer-data",
			icon: FileText,
			title: "Customers Data",
		},
		{
			href: "/meeting-scheduler",
			icon: SettingsIcon,
			title: "Scheduler",
		},
		{
			href: "/scheduler",
			icon: UserIcon,
			title: "Timetable",
		},
		{
			href: "/payments",
			icon: DollarSign,
			title: "Payments",
		},
		{
			href: "/room",
			icon: DollarSign,
			title: "Rooms",
		},
		{
			href: "/nonroom",
			icon: DollarSign,
			title: "Non Rooms",
		},
		{
			href: "/statistics",
			icon: BarChart,
			title: "Statistics",
		},
		{
			href: "/reset/password",
			icon: LockIcon,
			title: "Reset Password",
		},
		{
			href: "/teacher",
			icon: Trello,
			title: "Teacher Data",
		},
	]

	const CustomerSupport = [
		{
			href: width <= 550 ? "/customer-data-mobile" : "/customer-data",
			icon: FileText,
			title: "Customers Data",
		},
		{
			href: "/attendance",
			icon: Trello,
			title: "Attendance",
		},
		{
			href: "/meeting-scheduler",
			icon: SettingsIcon,
			title: "Scheduler",
		},
		{
			href: "/scheduler",
			icon: UserIcon,
			title: "Timetable",
		},

		{
			href: "/reset/password",
			icon: LockIcon,
			title: "Reset Password",
		},

		{
			href: "/statistics",
			icon: BarChart,
			title: "Statistics",
		},

		{
			href: "/scheduler",
			icon: UserIcon,
			title: "Timetable",
		},

		{
			href: "/payments",
			icon: DollarSign,
			title: "Payments",
		},
		{
			href: "/leaves",
			icon: UserMinus,
			title: "Leaves",
		},
		{
			href: "/teacher",
			icon: Trello,
			title: "Teacher Data",
		},
	]

	const classes = useStyles()
	const location = useLocation()
	const [userDetails, setUserDetails] = useState()
	useEffect(() => {
		if (openMobile && onMobileClose) {
			onMobileClose()
		}
	}, [location.pathname])

	useEffect(() => {
		getUserDetails()
	}, [])

	const [roleID, setRoleID] = useState()

	useEffect(() => {
		setAuth()
	}, [])

	const setAuth = () => {
		if (isAutheticated().roleId) {
			setRoleID(isAutheticated().roleId)
		}
	}

	const getUserDetails = () => {
		const data = isAutheticated()
		setUserDetails(data)
	}
	const content = (
		<Box height="100%" display="flex" flexDirection="column" className="backgroundimage">
			<Box alignItems="center" display="flex" flexDirection="column" p={2}>
				<Avatar className={classes.avatar} component={RouterLink} to="/dashboard">
					<Typography color="textSecondary" variant="body2" className={classes.iconName}>
						{userDetails && userDetails.username[0]}
					</Typography>
				</Avatar>
				<Typography className={classes.name} color="textPrimary" variant="h5">
					{userDetails && userDetails.username}
				</Typography>
				<Typography color="textSecondary" variant="body2" className={classes.name}>
					Admin
				</Typography>
			</Box>
			<Divider />
			<Box p={2}>
				<List>
					{roleID && roleID === 3
						? items.map((item) => (
								<NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
						  ))
						: roleID && roleID === 4
						? SalesTeam.map((item) => (
								<NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
						  ))
						: roleID && roleID === 5
						? CustomerSupport.map((item) => (
								<NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
						  ))
						: ""}
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
