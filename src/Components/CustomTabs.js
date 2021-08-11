import React, {useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core/styles"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Box from "@material-ui/core/Box"
import MaterialTableAddFields from "./MaterialTableAddFields"
import {getData} from "../Services/Services"
import useDocumentTitle from "./useDocumentTitle"
import AddFieldsHolder from "../Pages/Admin/Crm/MobileViews/AddFieldsHolder"
import useWindowDimensions from "./useWindowDimensions"

const TabPanel = (props) => {
	const {children, value, index, ...other} = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<div>{children}</div>
				</Box>
			)}
		</div>
	)
}

function a11yProps(index) {
	return {
		id: `scrollable-auto-tab-${index}`,
		"aria-controls": `scrollable-auto-tabpanel-${index}`,
	}
}

const useStyles = makeStyles((theme) => ({
	root: {
		display: "block",
		margin: "0 auto",
		width: "95%",
		marginTop: "40px",
		backgroundColor: theme.palette.background.paper,
		[theme.breakpoints.down("sm")]: {
			width: "100%",
		},
	},
}))

const CustomTabs = () => {
	useDocumentTitle("Add Fields")
	const classes = useStyles()
	const [value, setValue] = useState(0)
	const [lookup, setLookup] = useState({})
	const [categoryLookup, setCategoryLookup] = useState({})

	const tabs = [
		"Class",
		"Time Zone",
		"Subject",
		"Zoom Account",
		"Class Status",
		"Currency",
		"Status",
		"Country",
		"Agent",
		"Category",
	]

	const status = [
		"classesStatus",
		"timeZoneStatus",
		"",
		"",
		"status",
		"currencyStatus",
		"",
		"countryStatus",
		"TeacherStatus",
		"AgentStatus",
		"categoryStatus",
	]

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const [statusMobile, setStatusMobile] = useState()
	const [catogeryMob, setcatogeryMob] = useState()

	useEffect(() => {
		getData("Status").then((data) => {
			let dummyLookup = {}
			data.data.result.forEach((data) => {
				dummyLookup[data.statusId] = data.statusName
			})
			setLookup(dummyLookup)
			setStatusMobile(data)
		})
		if (value === 2) {
			getData("Category").then((data) => {
				setCategoryLookup(
					data.data.result.reduce((obj, item, i) => {
						obj[item.id] = item.categoryName
						return obj
					}, {})
				)
			})
		}
	}, [value])
	const {width} = useWindowDimensions()

	return (
		<div className={classes.root}>
			<Tabs
				value={value}
				onChange={handleChange}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				aria-label="scrollable auto tabs"
			>
				{tabs.map((item, index) => {
					return <Tab label={item} {...a11yProps(index)} key={index} />
				})}
			</Tabs>
			{tabs.map((item, index) => (
				<TabPanel value={value} key={index} index={index}>
					{width > 750 ? (
						<MaterialTableAddFields
							name={item}
							status={status[index]}
							lookup={lookup}
							categoryLookup={categoryLookup}
						/>
					) : (
						<AddFieldsHolder
							statusMob={statusMobile}
							category={catogeryMob}
							name={item}
							status={status[index]}
							lookup={lookup}
							categoryLookup={categoryLookup}
						/>
					)}
				</TabPanel>
			))}
		</div>
	)
}

export default CustomTabs
