import React, {useEffect, useState} from "react"
import {makeStyles} from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import Axios from "axios"
import moment from "moment"
import InfoIcon from "@material-ui/icons/Info"
import {IconButton, LinearProgress} from "@material-ui/core"
import MoreinfoFinancial from "../Accountant/MoreinfoFinancial"
const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
})

function createData(name, calories, fat, carbs, protein) {
	return {name, calories, fat, carbs, protein}
}

const rows = [
	createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
	createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
	createData("Eclair", 262, 16.0, 24, 6.0),
]

export default function TransactionTablenew({id, type}) {
	const classes = useStyles()
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState()
	const [selectedData, setSelectedData] = useState()
	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/invoices/transactions/${id}`)
		setData(data?.data?.result)

		setLoading(false)
	}

	return (
		<TableContainer style={{backgroundColor: "#f1f2f6"}} component={Paper}>
			{loading && <LinearProgress />}

			<Table className={classes.table} aria-label="caption table">
				<TableHead>
					<TableRow>
						<TableCell>More Info</TableCell>
						<TableCell>Invoice no</TableCell>
						<TableCell align="right">Customer name</TableCell>
						<TableCell align="right">Amount {type === "PAYPAL" ? "(USD)" : "(INR)"}</TableCell>
						<TableCell align="right">Transaction Fee</TableCell>
						<TableCell align="right">Date</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data &&
						data.map((row) => (
							<TableRow key={row.name}>
								<TableCell component="th" scope="row">
									<IconButton
										onClick={() => {
											setSelectedData(row)
											setOpen(!open)
										}}
									>
										<InfoIcon />
									</IconButton>
								</TableCell>

								<TableCell component="th" scope="row">
									{row.id}
								</TableCell>
								<TableCell align="right">{row.customer.person}</TableCell>
								<TableCell align="right">{row.taxableValue}</TableCell>
								<TableCell align="right">{row.transactionFee}</TableCell>
								<TableCell align="right">
									{moment(row.paymentDate).format("MMMM Do YYYY")}
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>

			<MoreinfoFinancial open={open} setOpen={setOpen} data={selectedData} />
		</TableContainer>
	)
}
