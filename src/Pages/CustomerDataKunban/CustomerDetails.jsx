import {Box, Divider, Grid, IconButton, makeStyles, Switch, Tooltip, Typography} from "@material-ui/core"
import moment from "moment"
import React from "react"
import WhatsAppIcon from "@material-ui/icons/WhatsApp"
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined"

import {Edit} from "react-feather"
import {isAutheticated} from "../../auth"
import {copyToClipboard, replaceSpecialCharacters} from "../../Services/utils"
import useLookups from "../../context/useLookups"

function CustomerDetails({customer, refresh}) {
	const classes = useStyles()
	const {
		agentLookup,
		classStatusLookup,
		timeZoneLookup,
		subjectDropdown,
		classLookup,
		subjectLookup,
		teachersLookup,
		countriesLookup,
		currencyLookup,
		categoryDropdown,
	} = useLookups()

	const customerDisplayFormat = [
		{
			title: "Join",
			editable: "never",
			field: "isJoinButtonEnabledByAdmin",
			type: "boolean",
			render: (row) => <Switch />
		},
		{
			title: "Subscription",
			editable: "never",
			field: "isSubscription",
			type: "boolean",
		},
		{
			title: "New",
			editable: "never",
			field: "autoDemo",
			type: "boolean",
		},
		{
			title: "Customer Status",
			field: "classStatusId",
			lookup: classStatusLookup,
		},
		{
			title: "Entry Date",
			field: "createdAt",
			editable: "never",
			type: "datetime",
			render: (rowData) => moment(rowData.createdAt).format("MMMM Do YYYY"),
		},
		{
			title: "Agent",
			field: "agentId",
			lookup: agentLookup,
			editable: isAutheticated().roleId === 3 ? undefined : "never",
		},
		{
			title: "Time Zone",
			field: "timeZoneId",
			lookup: timeZoneLookup,
		},
		{
			title: "Student Name",
			field: "firstName",
		},
		{
			title: "Requested Subjects",
			field: "requestedSubjects",
			editable: "never",
			render: (row) => (
				<div>
					{Array.isArray(row.requestedSubjects)
						? row.requestedSubjects.map((subject) => <div>{subjectDropdown[subject]}</div>)
						: ""}
				</div>
			),
		},
		{
			title: "Guardian",
			field: "lastName",
		},
		{
			title: "Age",
			field: "age",
			type: "numeric",
		},
		{
			title: "Class left",
			field: "numberOfClassesBought",
			type: "numeric",
			editable: "never",
		},
		{
			title: "Rewards",
			field: "login.rewards",
			type: "numeric",
			editable: "never",
		},
		{
			title: "Email",
			field: "emailId",
		},
		{
			title: "Default classes",
			field: "noOfClasses",
			type: "numeric",
		},
		{
			title: "Due Date",
			field: "paidTill",
			type: "date",
			render: (rowData) =>
				rowData.paidTill ? moment(rowData.paidTill).format("MMM DD, yyyy") : "",
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
			title: "Subject Name",
			field: "subjectId",
			lookup: subjectLookup,
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
							{rowData.email}
						</div>
					) : (
						<span />
					)}
				</>
			),
		},
		{
			title: "Country Code",
			field: "countryCode",
		},
		{
			title: "Whatsapp",
			field: "whatsAppnumber",
			render: (rowData) =>
				rowData.whatsAppnumber ? (
					<div className={classes.flexCenter}>
						<a
							className={classes.link}
							target="__blank"
							href={`https://api.whatsapp.com/send?phone=${replaceSpecialCharacters(
								rowData.countryCode + rowData.whatsAppnumber
							)}`}
						>
							<Tooltip title={`Message ${rowData.firstName}`}>
								<WhatsAppIcon />
							</Tooltip>
						</a>
						{rowData.countryCode}
						{rowData.whatsAppnumber}
					</div>
				) : (
					""
				),
		},
		{
			title: "Group",
			field: "oneToOne",
			type: "boolean",
		},
		{
			title: "Teacher",
			field: "teacherId",
			lookup: teachersLookup,
		},
		{
			title: "Country",
			field: "countryId",
			lookup: countriesLookup,
		},
		{
			title: "Students",
			field: "numberOfStudents",
			type: "numeric",
		},
		{
			title: "Amount",
			field: "proposedAmount",
			type: "numeric",
		},
		{
			title: "Discount",
			field: "discount",
			type: "numeric",
		},
		{
			title: "Currency",
			field: "proposedCurrencyId",
			lookup: currencyLookup,
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
	]

	return (
		<Box className={classes.customerDetailsWrapper}>
			<Typography variant="h3">{customer.firstName} details</Typography>
			<Divider className={classes.divider} />
			<Box className={classes.customerDetails}>
				{customerDisplayFormat.map((row, index) => (
					<Grid container spacing={1} key={index} className={classes.row}>
						<Grid item xs={12} lg={5} align="right">
							<Box className={classes.boldHeading}>{row.title}: </Box>
						</Grid>
						<Grid item xs={11} lg={5} align="left">
							{row.render
								? row.render(customer)
								: row.lookup
								? row.lookup[customer[row.field]] + "yes"
								: customer[row.field]}
						</Grid>
						<Grid item xs={1} align="right" className="edit">
							<IconButton size="small">
								<Edit size={16} />
							</IconButton>
						</Grid>
					</Grid>
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
}))
