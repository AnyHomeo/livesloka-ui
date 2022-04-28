import {
	Box,
	Divider,
	Grid,
	IconButton,
	makeStyles,
	MenuItem,
	Select,
	Switch,
	Tooltip,
	Typography,
} from "@material-ui/core"
import moment from "moment"
import React, {useCallback, useEffect, useState} from "react"
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined"

import {Check, Edit, X} from "react-feather"
import {isAutheticated} from "../../auth"
import {copyToClipboard, truncate} from "../../Services/utils"
import useLookups from "../../context/useLookups"
import {editCustomer} from "../../Services/Services"

const DynamicInput = ({type, value, onChange, lookup}) => {
	return (() => {
		switch (type) {
			case "number":
				return (
					<input
						onChange={(e) => onChange(e.target.value)}
						value={value}
						style={{padding: 5}}
						type="number"
					/>
				)
			case "select":
				return (
					<Select value={value} onChange={(e) => onChange(e.target.value)}>
						{Object.entries(lookup).map(([key, value]) => (
							<MenuItem value={key}>{value}</MenuItem>
						))}
					</Select>
				)
			default:
				return (
					<input
						onChange={(e) => onChange(e.target.value)}
						style={{padding: 5}}
						value={value}
						type="text"
					/>
				)
		}
	})()
}

const CustomerRow = ({row, customer, isEditing, setIsEditing, setCustomer, refresh}) => {
	const classes = useStyles()
	const [value, setValue] = useState()

	useEffect(() => {
		setValue(customer[row.field])
	}, [customer, row.field, isEditing])

	const handleChange = useCallback((value) => {
		setValue(value)
	}, [])

	const handleSubmit = useCallback(async () => {
		try {
			await editCustomer({_id: customer._id, [row.field]: value})
			setCustomer((prev) => ({...prev, [row.field]: value}))
			refresh()
			setIsEditing("")
		} catch (error) {
			console.log(error)
		}
	}, [customer._id, refresh, row.field, setCustomer, setIsEditing, value])

	return (
		<Grid container spacing={1} className={classes.row}>
			<Grid item md={5} align="right">
				<Box className={classes.boldHeading}>{row.title}: </Box>
			</Grid>
			<Grid item md={5} align="left">
				{isEditing !== row.field ? (
					row.render ? (
						row.render(customer)
					) : row.lookup ? (
						row.lookup[customer[row.field]]
					) : (
						truncate(customer[row.field], 30)
					)
				) : (
					<DynamicInput
						type={row.lookup ? "select" : row.type}
						lookup={row.lookup}
						value={value}
						onChange={handleChange}
					/>
				)}
			</Grid>
			{!row?.isNotEditable && (
				<>
					{isEditing !== row.field ? (
						<Grid item xs={1} align="right" className="edit">
							<IconButton size="small" onClick={() => setIsEditing(row.field)}>
								<Edit size={16} />
							</IconButton>
						</Grid>
					) : (
						<Grid item xs={1} align="right">
							<Box className={classes.flexCenter}>
								<div>
									<IconButton size="small" onClick={handleSubmit}>
										<Check size={16} />
									</IconButton>
								</div>
								<div>
									<IconButton size="small" onClick={() => setIsEditing("")}>
										<X size={16} />
									</IconButton>
								</div>
							</Box>
						</Grid>
					)}
				</>
			)}
		</Grid>
	)
}

const CustomerDetails = ({customer, refresh, setCustomer}) => {
	const [isEditing, setIsEditing] = useState("")
	const classes = useStyles()
	const {
		agentLookup,
		classStatusLookup,
		timeZoneLookup,
		classLookup,
		subjectLookup,
		teachersLookup,
		countriesLookup,
		currencyLookup,
		categoryDropdown,
	} = useLookups()

	const customerDisplayFormat = [
		{
			title: "Student Name",
			field: "firstName",
		},
		{
			title: "Parent Name",
			field: "lastName",
		},
		{
			title: "Whatsapp",
			field: "whatsAppnumber",
			render: (rowData) =>
				rowData.whatsAppnumber ? (
					<div className={classes.flexCenter}>
						{rowData.countryCode}
						{rowData.whatsAppnumber}
					</div>
				) : (
					""
				),
		},
		{
			title: "Time Zone",
			field: "timeZoneId",
			lookup: timeZoneLookup,
		},
		{
			title: "Subject Name",
			field: "subjectId",
			lookup: subjectLookup,
		},
		{
			title: "Teacher",
			field: "teacherId",
			lookup: teachersLookup,
		},
		{
			title: "Due Date",
			field: "paidTill",
			type: "date",
			render: (rowData) =>
				rowData.paidTill ? moment(rowData.paidTill).format("MMM DD, yyyy") : "",
		},
		{
			title: "Class left",
			field: "numberOfClassesBought",
			type: "number",
			editable: "never",
		},
		{
			title: "Customer Status",
			field: "classStatusId",
			lookup: classStatusLookup,
		},
		{
			title: "Login",
			field: "email",
			render: (rowData) => (
				<>
					{rowData.email ? (
						<div style={{display: "flex", alignItems: "center"}}>
							<Tooltip title={`Copy to Clipboard`}>
								<FileCopyOutlinedIcon
									style={{
										marginRight: "10px",
									}}
									onClick={() => copyToClipboard(rowData.email)}
								/>
							</Tooltip>
							{truncate(rowData.email, 10)}
						</div>
					) : (
						<span />
					)}
				</>
			),
		},
		{
			title: "Age",
			field: "age",
			type: "number",
		},
		{
			title: "Agent",
			field: "agentId",
			lookup: agentLookup,
			isNotEditable: isAutheticated().roleId !== 3,
		},
		{
			title: "Students",
			field: "numberOfStudents",
			type: "number",
		},
		{
			title: "Amount",
			field: "proposedAmount",
			type: "number",
		},
		{
			title: "Currency",
			field: "proposedCurrencyId",
			lookup: currencyLookup,
		},
		{
			title: "Entry Date",
			field: "createdAt",
			type: "datetime",
			isNotEditable: true,
			render: (row) => moment(row.createdAt).format("MMMM Do YYYY"),
		},
		{
			title: "Rewards",
			field: "login.rewards",
			type: "number",
			editable: "never",
		},
		{
			title: "Email",
			field: "emailId",
		},
		{
			title: "Default classes",
			field: "noOfClasses",
			type: "number",
		},
		{
			title: "Gender",
			field: "gender",
			lookup: {male: "Male", female: "Female"},
		},
		{
			title: "Class",
			field: "classId",
			lookup: classLookup,
		},
		{
			title: "Country Code",
			field: "countryCode",
		},
		{
			title: "Group",
			field: "oneToOne",
			type: "boolean",
		},
		{
			title: "Country",
			field: "countryId",
			lookup: countriesLookup,
		},

		{
			title: "Discount",
			field: "discount",
			type: "number",
		},
		{
			title: "Place Of Stay",
			field: "placeOfStay",
		},
		{
			title: "Schedule",
			field: "scheduleDescription",
		},
		{
			title: "Category",
			field: "categoryId",
			lookup: categoryDropdown,
		},
		{
			title: "Phone",
			field: "phone",
		},
		{
			title: "Join",
			isNotEditable: true,
			field: "isJoinButtonEnabledByAdmin",
			type: "boolean",
			render: (row) => <Switch className={classes.mtminus} />,
		},
		{
			title: "Subscription",
			isNotEditable: true,
			field: "isSubscription",
			type: "boolean",
			render: (row) => <Switch className={classes.mtminus} />,
		},
		{
			title: "New",
			isNotEditable: true,
			field: "autoDemo",
			type: "boolean",
			render: (row) => <Switch className={classes.mtminus} />,
		},
	]

	return (
		<Box className={classes.customerDetailsWrapper}>
			<Typography variant="h3">{customer.firstName} details</Typography>
			<Divider className={classes.divider} />
			<Box className={classes.customerDetails}>
				{customerDisplayFormat.map((row, index) => (
					<CustomerRow
						row={row}
						key={index}
						customer={customer}
						isEditing={isEditing}
						setIsEditing={setIsEditing}
						setCustomer={setCustomer}
						refresh={refresh}
					/>
				))}
			</Box>
		</Box>
	)
}

export default CustomerDetails

const useStyles = makeStyles((theme) => ({
	customerDetailsWrapper: {
		width: 500,
		maxWidth: "90vh",
		padding: theme.spacing(2),
	},
	divider: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(2),
	},
	customerDetails: {
		padding: theme.spacing(2),
	},
	boldHeading: {
		fontWeight: 700,
	},
	flexCenter: {
		display: "flex",
		alignItems: "center",
	},
	row: {
		padding: theme.spacing(0.2),
		"&:hover": {
			backgroundColor: theme.palette.grey["200"],
		},
		"&:hover .edit": {
			display: "block",
		},

		"& .edit": {
			display: "none",
		},
	},
	mtminus: {
		marginTop: -8,
	},
}))
