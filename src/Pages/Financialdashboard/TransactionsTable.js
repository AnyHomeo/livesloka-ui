/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from "react"
import MaterialTable from "material-table"
import Axios from "axios"
import moment from "moment"
import razorpay from "../../Images/razorpay.svg"
import paypal from "../../Images/paypal.svg"
import TransactionTablenew from "./TransactionsTablenew"
const TransactionsTable = ({date}) => {
	const [column, setColumn] = useState([])
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		const data = await Axios.get(
			`${process.env.REACT_APP_API_KEY}/transactions/table/?month=${date}`
		)
		setData(data?.data?.result)

		setLoading(false)
	}
	useEffect(() => {
		if (data.length) {
			let v = [
				{
					title: "Transaction ID",
					field: "id",
				},
				{
					title: "Amount",
					field: "amount",
				},
				// {
				// 	title: "Payment mode",
				// 	field: "mode",
				// 	render: (rowData) => {
				// 		if (rowData.mode === "PAYPAL") {
				// 			return <img src={paypal} style={{height: 80, width: 80}} alt="" />
				// 		} else {
				// 			return <img src={razorpay} style={{height: 80, width: 80}} alt="" />
				// 		}
				// 	},
				// },
				{
					title: "Date",
					field: "date",
					render: (rowData) => moment(rowData.date).format("MMMM Do YYYY"),
				},
			]
			setColumn(v)
		}
	}, [data])

	return (
		<>
			<MaterialTable
				options={{
					search: true,
					pageSizeOptions: [5, 20, 30, 40, 50, data.length],
				}}
				title={`Table`}
				columns={column}
				// isLoading={loading}
				data={data}
				detailPanel={(rowData) => {
					return (
						<div style={{padding: 20, backgroundColor: "#f1f2f6"}}>
							<TransactionTablenew id={rowData.id} />
						</div>
					)
				}}
			/>
		</>
	)
}
export default TransactionsTable
