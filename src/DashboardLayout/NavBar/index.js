import React from "react"
import {Link as RouterLink} from "react-router-dom"
import PropTypes from "prop-types"
import {
	Avatar,
	Box,
	Divider,
	Drawer,
	List,
	Typography,
	makeStyles,
	ListItemText,
	ListItem,
	Collapse,
} from "@material-ui/core"
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
import EventNoteOutlinedIcon from "@material-ui/icons/EventNoteOutlined"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import ContactSupportOutlinedIcon from "@material-ui/icons/ContactSupportOutlined"
import {useState} from "react"
import support from "../../Images/Navicons/support.png"
import EventsPng from "../../Images/Navicons/events.png"
import FinancePng from "../../Images/Navicons/finance.png"
import management from "../../Images/Navicons/management.png"
import ReportsPng from "../../Images/Navicons/reports.png"
import SalesPng from "../../Images/Navicons/sales.png"
import teacherPng from "../../Images/Navicons/teacher.png"
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
			href: "/accountant/invoice",
			icon: FileText,
			title: "GST Data",
			permission: "Accounts",
		},
		{
			href: "/accountant/finance",
			icon: BarChart,
			title: "Accountant Dashboard",
			permission: "Accounts",
		},
	]

	const Support = [
		{
			href: "/statistics",
			icon: BarChart,
			title: "Statistics",
			permission: "Statistics",
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
			href: "/zoom-dashboard",
			icon: Video,
			title: "Zoom Dashboard",
			permission: "Zoom Dashboard",
		},
		{
			href: "/reset/password",
			icon: LockIcon,
			title: "Reset Password",
			permission: "Reset Password",
		},
		{
			href: "/leaves",
			icon: UserMinus,
			title: "Leaves",
			permission: "Leaves",
		},
		{
			href: "/attendance",
			icon: Trello,
			title: "Attendance",
			permission: "Attendance",
		},
	]

	const Management = [
		{
			href: "/add-fields",
			icon: Edit,
			title: "Add Fields",
			permission: "Add Fields",
		},
		{
			href: "/scheduler",
			icon: UserIcon,
			title: "Timetable",
			permission: "Timetable",
		},
		{
			href: "/leaves",
			icon: UserMinus,
			title: "Leaves",
			permission: "Leaves",
		},
		{
			href: "/zoom-dashboard",
			icon: Video,
			title: "Zoom Dashboard",
			permission: "Zoom Dashboard",
		},
	]

	const Sales = [
		{
			href: width <= 550 ? "/customer-data-mobile" : "/customer-data",
			icon: FileText,
			title: "Customer Data",
			permission: "Customer Data",
		},
		{
			href: "/options",
			icon: AlignJustify,
			title: "Options",
			permission: "Options",
		},
		{
			href: "/scheduler",
			icon: UserIcon,
			title: "Timetable",
			permission: "Timetable",
		},
		{
			href: "/reset/password",
			icon: LockIcon,
			title: "Reset Password",
			permission: "Reset Password",
		},
		{
			href: "/products",
			icon: DollarSign,
			title: "Paypal & Stripe",
			permission: "Paypal & Stripe",
		},
	]

	const Finance = [
		{
			href: "/payments",
			icon: DollarSign,
			title: "Payments",
			permission: "Payments",
		},
		{
			href: "/dashboard",
			icon: DollarSign,
			title: "Financial Dashboard",
			permission: "Financial Dashboard",
		},
		{
			href: "/accountant/invoice",
			icon: FileText,
			title: "GST Data",
			permission: "Accounts",
		},
		{
			href: "/accountant/finance",
			icon: BarChart,
			title: "Accountant Dashboard",
			permission: "Accounts",
		},
	]

	const Teacher = [
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
	]

	const Events = [
		{
			href: "/video-folders",
			icon: Film,
			title: "Video Manager",
			permission: "Video Manager",
		},
	]

	const Reports = [
		{
			href: "/teacher/reporting",
			icon: Film,
			title: "Teacher Reporting",
			permission: "Video Manager",
		},
	]

	const classes = useStyles()
	const user = isAutheticated()

	const [supportOpen, setSupportOpen] = useState(true)
	const [managementOpen, setManagementOpen] = useState(false)
	const [sales, setSales] = useState(false)
	const [finance, setFinance] = useState(false)
	const [teachers, setTeachers] = useState(false)
	const [events, setEvents] = useState(false)
	const [reports, setReports] = useState(false)

	const handleClick = (menu) => {
		if (menu === "Support") {
			setSupportOpen(!supportOpen)
		} else if (menu === "Management") {
			setManagementOpen(!managementOpen)
		} else if (menu === "sales") {
			setSales(!sales)
		} else if (menu === "finance") {
			setFinance(!finance)
		} else if (menu === "events") {
			setEvents(!events)
		} else if (menu === "reports") {
			setReports(!reports)
		} else if (menu === "teachers") {
			setTeachers(!teachers)
		}
	}

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
					<ListItem
						style={{
							cursor: "pointer",
							display: "flex",
							paddingTop: 0,
							paddingBottom: 0,
							marginBottom: 5,
						}}
						onClick={() => handleClick("Support")}
					>
						<img
							src={support}
							style={{height: 20, width: 20, marginRight: 10, objectFit: "cover"}}
							alt=""
						/>
						{/* <ContactSupportOutlinedIcon style={{height: 20, width: 20, marginRight: 10}} /> */}
						<ListItemText primary="Support" />
						{supportOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={supportOpen} timeout="auto" unmountOnExit style={{marginLeft: 20}}>
						{Support.reduce((navItems, item) => {
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
					</Collapse>
				</List>

				<List>
					<ListItem
						style={{
							cursor: "pointer",
							display: "flex",
							paddingTop: 0,
							paddingBottom: 0,
							marginBottom: 5,
						}}
						onClick={() => handleClick("Management")}
					>
						<img
							src={management}
							style={{height: 20, width: 20, marginRight: 10, objectFit: "cover"}}
							alt=""
						/>
						<ListItemText primary="Management" />
						{managementOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={managementOpen} timeout="auto" unmountOnExit style={{marginLeft: 20}}>
						{Management.reduce((navItems, item) => {
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
					</Collapse>
				</List>

				<List>
					<ListItem
						style={{
							cursor: "pointer",
							display: "flex",
							paddingTop: 0,
							paddingBottom: 0,
							marginBottom: 5,
						}}
						onClick={() => handleClick("sales")}
					>
						<img
							src={SalesPng}
							style={{height: 20, width: 20, marginRight: 10, objectFit: "cover"}}
							alt=""
						/>
						<ListItemText primary="Sales" />
						{sales ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={sales} timeout="auto" unmountOnExit style={{marginLeft: 20}}>
						{Sales.reduce((navItems, item) => {
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
					</Collapse>
				</List>

				<List>
					<ListItem
						style={{
							cursor: "pointer",
							display: "flex",
							paddingTop: 0,
							paddingBottom: 0,
							marginBottom: 5,
						}}
						onClick={() => handleClick("finance")}
					>
						<img
							src={FinancePng}
							style={{height: 20, width: 20, marginRight: 10, objectFit: "cover"}}
							alt=""
						/>
						<ListItemText primary="Finance" />
						{finance ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={finance} timeout="auto" unmountOnExit style={{marginLeft: 20}}>
						{Finance.reduce((navItems, item) => {
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
					</Collapse>
				</List>

				<List>
					<ListItem
						style={{
							cursor: "pointer",
							display: "flex",
							paddingTop: 0,
							paddingBottom: 0,
							marginBottom: 5,
						}}
						onClick={() => handleClick("teachers")}
					>
						<img
							src={teacherPng}
							style={{height: 20, width: 20, marginRight: 10, objectFit: "cover"}}
							alt=""
						/>
						<ListItemText primary="Teachers" />
						{teachers ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={teachers} timeout="auto" unmountOnExit style={{marginLeft: 20}}>
						{Teacher.reduce((navItems, item) => {
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
					</Collapse>
				</List>

				<List>
					<ListItem
						style={{
							cursor: "pointer",
							display: "flex",
							paddingTop: 0,
							paddingBottom: 0,
							marginBottom: 5,
						}}
						onClick={() => handleClick("events")}
					>
						<img
							src={EventsPng}
							style={{height: 20, width: 20, marginRight: 10, objectFit: "cover"}}
							alt=""
						/>
						<ListItemText primary="Events" />
						{events ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={events} timeout="auto" unmountOnExit style={{marginLeft: 20}}>
						{Events.reduce((navItems, item) => {
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
					</Collapse>
				</List>

				<List>
					<ListItem
						style={{
							cursor: "pointer",
							display: "flex",
							paddingTop: 0,
							paddingBottom: 0,
							marginBottom: 5,
						}}
						onClick={() => handleClick("reports")}
					>
						<img
							src={ReportsPng}
							style={{height: 20, width: 20, marginRight: 10, objectFit: "cover"}}
							alt=""
						/>
						<ListItemText primary="Reports" />
						{reports ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={reports} timeout="auto" unmountOnExit style={{marginLeft: 20}}>
						{Reports.reduce((navItems, item) => {
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
					</Collapse>
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
