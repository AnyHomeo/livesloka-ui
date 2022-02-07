import {Menu, MenuItem} from "@material-ui/core"
import Axios from "axios"
import MaterialTable from "material-table"
import moment from "moment"
import React, {useEffect, useState} from "react"
import {DollarSign, Filter, Settings} from "react-feather"

const InvoicePages = () => {
	// const useStyles = makeStyles((theme) => ({
	// 	root: {
	// 		"& .MuiDataGrid-row:nth-child(odd)": {
	// 			backgroundColor:
	// 				theme.palette.mode === "light"
	// 					? theme.palette.secondary[300]
	// 					: theme.palette.secondary[900],
	// 		},
	// 	},
	// }))

	const generateMonths = () => {
		var dateStart = moment("2022-1-1")
		var dateEnd = moment()

		var timeValues = []

		while (dateEnd > dateStart || dateStart.format("M") === dateEnd.format("M")) {
			let obj = {
				title: dateStart.format("MMM YYYY"),
				month: dateStart.format("YYYY-MM"),
			}
			timeValues.push(obj)
			dateStart.add(1, "month")
		}

		return timeValues
	}

	const [monthArr] = useState(generateMonths())
	const [anchorEl, setAnchorEl] = useState(null)
	const [selectedDate, setSelectedDate] = useState(moment().subtract(1, "months").format("YYYY-MM"))
	const [loading, setLoading] = useState(false)
	const [enableFilter, setEnableFilter] = useState(false)
	const columnData2 = [
		{
			title: "Invoice no",
			field: "id",
			render: (rowData) => <p style={{color: "#3867d6", fontWeight: "bold"}}>{rowData.id}</p>,
		},
		{
			title: "Date",
			field: "paymentDate",
			render: (rowData) => moment(rowData?.paymentDate).format("MMM Do YY"),
		},
		{title: "Name", field: "customer.person"},
		{
			title: "Currency",
			field: "currency",
			render: (rowData) =>
				rowData?.paymentMethod === "Paypal" ? (
					<div
						style={{
							height: 30,
							width: 30,
							borderRadius: "50%",
							backgroundColor: "#20bf6b",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							color: "white",
						}}
					>
						<DollarSign style={{height: 20, width: 20}} />
					</div>
				) : (
					<div
						style={{
							height: 30,
							width: 30,
							borderRadius: "50%",
							backgroundColor: "#fa8231",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							color: "white",
						}}
					>
						<p style={{fontSize: 20}}>₹</p>{" "}
					</div>
				),
		},
		{
			title: "Gross",
			field: "taxableValue",
			render: (rowData) => (
				<p>
					{rowData.paymentMethod === "Paypal"
						? `$${rowData.taxableValue}`
						: `₹${rowData.taxableValue}`}
				</p>
			),
		},
		{
			title: "Fee",
			field: "transactionFee",
			render: (rowData) => (
				<p style={{color: "#eb3b5a", fontWeight: "bold"}}>{rowData.transactionFee}</p>
			),
		},
		{
			title: "Net",
			field: "net",
			render: (rowData) => (
				<p style={{color: "#26de81", fontWeight: "bold"}}>
					{rowData.paymentMethod === "Paypal" ? `$${rowData.net}` : `₹${rowData.net}`}
				</p>
			),
		},
		// {title: "Balance", field: "balance"},
		{
			title: "Exchange",
			field: "exchangeRate",
			render: (rowData) => rowData?.exchangeRate,
		},
		{
			title: "Received",
			field: "recieved",
			render: (rowData) => rowData?.recieved,
		},
		{
			title: "Turnover",
			field: "turnover",
			render: (rowData) => rowData?.turnover,
		},
		// {title: "Difference", field: "difference"},
		{
			title: "PayPal Fee",
			field: "feeInInr",
			render: (rowData) => rowData?.feeInInr,
		},
		// {title: "Fx Loss", field: "fxLoss"},
		{
			title: "Recieved",
			field: "recieved",
			render: (rowData) => rowData?.recieved,
		},
	]

	useEffect(() => {
		fetchData()
	}, [])

	const [data, setData] = useState([])
	const [data2, setData2] = useState([])
	const fetchData = async (date) => {
		setLoading(true)
		let month, year
		if (date === undefined) {
			month = moment().subtract(1, "months").format("MM")
			year = moment().format("YYYY")
		} else {
			month = moment(date).format("MM")
			year = moment(date).format("YYYY")
		}

		const data = await Axios.get(
			`${process.env.REACT_APP_API_KEY}/invoices?month=${month}&year=${year}`
		)
		setData(data?.data?.result)

		setLoading(false)
	}

	const fetchDataByDate = (date) => {
		fetchData(date)
		setSelectedDate(date)
		handleClose()
	}
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<div>
			<div style={{padding: 20}}>
				<MaterialTable
					title={<p style={{fontSize: 20}}>GST Data</p>}
					columns={columnData2}
					isLoading={loading}
					data={data}
					options={{
						search: true,
						exportButton: true,
						editable: true,
						filtering: enableFilter,
						paging: false,

						headerStyle: {
							backgroundColor: "#f1f2f6",
							// boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
						},

						rowStyle: (rowData, index) => {
							return {
								backgroundColor: index % 2 ? "aliceblue" : "white",
								borderBottom: "3px solid white",
								borderTop: "3px solid white",
							}
						},
					}}
					actions={[
						{
							icon: () => <p style={{fontSize: 18}}>{moment(selectedDate).format("MMM YYYY")}</p>,
							tooltip: "Filter",
							isFreeAction: true,
							onClick: (event) => handleClick(event),
						},
						{
							icon: () => <Filter />,
							tooltip: "Filters",
							isFreeAction: true,
							onClick: () => setEnableFilter(!enableFilter),
						},
					]}
					icons={{Filter: () => <div />}}
				/>
			</div>

			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{monthArr.map((date) => (
					<MenuItem
						onClick={() => {
							fetchDataByDate(date.month)
						}}
					>
						{date.title}
					</MenuItem>
				))}
			</Menu>
		</div>
	)
}

export default InvoicePages
