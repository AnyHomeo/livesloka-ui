/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from "react"
import MaterialTable from "material-table"
import Axios from "axios"

const Expensestable = ({date}) => {
	const [column, setColumn] = useState([])
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/salary/all?month=${date}`)

		let finalArr = []

		data &&
			data.data.finalDataObjectArr.forEach((item) => {
				let finalAmount = item.totalSalary

				item.extras.forEach((extra) => {
					finalAmount = finalAmount + extra.amount
				})

				let obj = {
					teacherName: item.name,
					amount: finalAmount,
				}
				finalArr.push(obj)
			})
		setData(finalArr)

		setLoading(false)
	}
	useEffect(() => {
		if (data.length) {
			let v = [
				{
					title: "Teacher Name",
					field: "teacherName",
					alignItems: "center",
				},
				{
					title: "Amount",
					field: "amount",
					alignItems: "center",
				},
			]
			setColumn(v)
		}
	}, [data])

	return (
		<>
			<MaterialTable
				title={``}
				columns={column}
				isLoading={loading}
				options={{
					search: true,
					paging: false,
				}}
				data={data}
			/>
		</>
	)
}
export default Expensestable
