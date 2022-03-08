/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from "react"
import MaterialTable from "material-table"
import MuiAlert from "@material-ui/lab/Alert"
import {IconButton, Snackbar} from "@material-ui/core"
import GetAppIcon from "@material-ui/icons/GetApp"
import Axios from "axios"
import moment from "moment"

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

const Expensestable = ({date}) => {
	const [column, setColumn] = useState([])
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)
	const [open, setOpen] = useState(false)
	const [success, setSuccess] = useState(false)
	const [response, setResponse] = useState("")

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/expenses?month=${date}`)

		if (data) {
			setData(data?.data?.result)
		}

		setLoading(false)
	}

	function download(url, filename) {
		fetch(url)
			.then((response) => response.blob())
			.then((blob) => {
				const link = document.createElement("a")
				link.href = URL.createObjectURL(blob)
				link.download = filename
				link.click()
			})
			.catch(console.error)
	}

	function getFileExtension(dataurl) {
		let patternFileExtension = /\.([0-9a-z]+)(?:[\?#]|$)/i

		let fileExtension = dataurl.match(patternFileExtension)

		return fileExtension[1]
	}

	useEffect(() => {
		if (data.length) {
			let v = [
				{
					title: "Name",
					field: "name",
				},
				{
					title: "Description",
					field: "description",
				},
				{
					title: "Dollar Amount",
					field: "dollarAmount",
				},
				{
					title: "Indian Amount",
					field: "amount",
				},
				{
					title: "GST",
					field: "gst",
				},
				{
					title: "Date",
					field: "date",
					render: (rowData) => moment(rowData.createdAt).format("MMMM Do YYYY"),
				},
				{
					title: "Attachment",
					field: "attachment",
					render: (rowData) => (
						<a href={rowData.attachment} target="_blank">
							<IconButton>
								<GetAppIcon />
							</IconButton>
						</a>
					),
				},
			]
			setColumn(v)
		}
	}, [data])

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setOpen(false)
	}

	const editField = async (newData) => {
		return await Axios.post(`${process.env.REACT_APP_API_KEY}/admin/update/expenses`, newData)
	}

	const deleteField = async (id) => {
		return await Axios.post(`${process.env.REACT_APP_API_KEY}/admin/delete/expenses/${id}`)
	}

	return (
		<>
			<Snackbar open={open} autoHideDuration={6000} onClose={() => handleClose()}>
				<Alert onClose={() => handleClose()} severity={success ? "success" : "warning"}>
					{response}
				</Alert>
			</Snackbar>
			<MaterialTable
				title={`Table`}
				columns={column}
				isLoading={loading}
				options={{
					search: true,
					paging: false,
				}}
				data={data}
				editable={{
					onRowUpdate: (newData, oldData) => {
						return editField(newData).then((fetchedData) => {
							if (fetchedData.data.status === "OK") {
								const dataUpdate = [...data]
								const index = oldData.tableData.id
								dataUpdate[index] = newData
								setData([...dataUpdate])
								setSuccess(true)
								setResponse(fetchedData.data.message)
								setOpen(true)
							} else {
								setSuccess(false)
								setResponse(fetchedData.data.message)
								setOpen(true)
							}
						})
					},
					onRowDelete: (oldData) =>
						deleteField(oldData.id)
							.then((fetchedData) => {
								if (fetchedData.data.status === "ok") {
									const dataDelete = [...data]
									const index = oldData.tableData.id
									dataDelete.splice(index, 1)
									setData([...dataDelete])
									setSuccess(true)
									setResponse(fetchedData.data.message)
									setOpen(true)
								} else {
									setSuccess(false)
									setResponse(fetchedData.data.message || "Something went wrong,Try again later")
									setOpen(true)
								}
							})
							.catch((err) => {
								console.error(err, err.response)
								setSuccess(false)
								setResponse("Something went wrong,Try again later")
								setOpen(true)
							}),
				}}
			/>
		</>
	)
}
export default Expensestable
