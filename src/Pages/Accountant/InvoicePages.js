import MaterialTable from "material-table"
import React, {useState} from "react"

const InvoicePages = () => {
	const columnData = [
		{title: "Transaction", field: "transaction"},
		{title: "Amount", field: "amount"},
		{title: "Invoice Number", field: "invoiceNumber", type: "numeric"},
	]

	const [data, setData] = useState([
		{transaction: "Mehmet", amount: "Baran", invoiceNumber: 1987},
		{transaction: "Mehmet", amount: "Baran", invoiceNumber: 1987},
		{transaction: "Mehmet", amount: "Baran", invoiceNumber: 1987},
		{transaction: "Mehmet", amount: "Baran", invoiceNumber: 1987},
		{transaction: "Mehmet", amount: "Baran", invoiceNumber: 1987},
		{transaction: "Mehmet", amount: "Baran", invoiceNumber: 1987},
	])
	return (
		<div>
			<MaterialTable
				title="Invoice Management"
				columns={columnData}
				data={data}
				options={{
					search: true,
					exportButton: true,
					editable: true,
				}}
				editable={{
					onRowAdd: (newData) =>
						new Promise((resolve, reject) => {
							setTimeout(() => {
								setData([...data, newData])

								resolve()
							}, 1000)
						}),
					onRowUpdate: (newData, oldData) =>
						new Promise((resolve, reject) => {
							setTimeout(() => {
								const dataUpdate = [...data]
								const index = oldData.tableData.id
								dataUpdate[index] = newData
								setData([...dataUpdate])

								resolve()
							}, 1000)
						}),
					onRowDelete: (oldData) =>
						new Promise((resolve, reject) => {
							setTimeout(() => {
								const dataDelete = [...data]
								const index = oldData.tableData.id
								dataDelete.splice(index, 1)
								setData([...dataDelete])

								resolve()
							}, 1000)
						}),
				}}
			/>
		</div>
	)
}

export default InvoicePages
