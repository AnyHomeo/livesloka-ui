import MaterialTable from "material-table"
import React from "react"
import useWindowDimensions from "./../../Components/useWindowDimensions"
import {
	deleteATeacherLeave,
	getAllTeacherLeaves,
	updateTeacherLeave,
} from "./../../Services/Services"
import {useEffect} from "react"
import {useState} from "react"
import {Button, Chip} from "@material-ui/core"
import moment from "moment"

import {useSnackbar} from "notistack"
import ApplyTeacherLeaves from "./ApplyTeacherLeaves"

const TeacherLeaves = () => {
	const {height} = useWindowDimensions()
	const [rows, setRows] = useState([])
	const [refresh, setRefresh] = useState(false)
	const [isAddLeaveDialogOpen, setIsAddLeaveDialogOpen] = useState(false)

	const {enqueueSnackbar} = useSnackbar()

	useEffect(() => {
		getAllTeacherLeaves()
			.then((data) => {
				setRows(data.data.result)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [refresh])

	return (
		<div>
			<ApplyTeacherLeaves
				isAddLeaveDialogOpen={isAddLeaveDialogOpen}
				setIsAddLeaveDialogOpen={setIsAddLeaveDialogOpen}
				setRefresh={setRefresh}
			/>
			<h1
				style={{
					textAlign: "center",
				}}
			>
				{" "}
				Leaves Applied by Teachers{" "}
			</h1>
			<Button
				style={{marginLeft: "20px"}}
				onClick={() => setIsAddLeaveDialogOpen(true)}
				color="primary"
				variant="contained"
			>
				Apply Leave
			</Button>
			<MaterialTable
				title=""
				columns={[
					{
						title: "Teacher",
						field: "teacherId.TeacherName",
						type: "string",
						editable: "never",
					},
					{
						title: "Teacher",
						field: "reason",
						type: "string",
						render: (rowData) => rowData.reason ? rowData.reason : '-'
					},
					{
						title: "Class Name",
						field: "scheduleId.className",
						editable: "never",
						type: "string",
						render: (row) =>
							row.scheduleId ? (
								row.scheduleId.className
							) : (
								<Chip size="small" color="secondary" label="Entire Day" />
							),
					},
					{
						title: "Date(User TimeZone)",
						field: "date",
						type: "datetime",
						customFilterAndSearch: (filter, row, col) => {
							return col.render(row).toLowerCase().indexOf(filter.toLowerCase()) !== -1
						},
						render: (rowData) => moment(rowData.date).format("MMMM Do YYYY, h:mm:ss A"),
					},
				]}
				style={{
					margin: "20px",
					padding: "20px",
				}}
				data={rows}
				options={{
					exportButton: true,
					paging: false,
					maxBodyHeight: height - 240,
				}}
				editable={{
					onRowUpdate: (newData, oldData) =>
						updateTeacherLeave(newData._id, {
							date: newData.date,
							teacherId: newData.teacherId.id,
						})
							.then((data) => {
								setRefresh((prev) => !prev)
								enqueueSnackbar(data.data.message, {variant: "success"})
							})
							.catch((err) => {
								console.log(err.response)
								enqueueSnackbar(err.response.data.error, {variant: "error"})
							}),
					onRowDelete: (oldData) =>
						deleteATeacherLeave(oldData._id)
							.then((data) => {
								setRefresh((prev) => !prev)
								enqueueSnackbar(data.data.message, {variant: "success"})
							})
							.catch((err) => {
								console.log(err.response)
								enqueueSnackbar(err.response.data.error, {variant: "error"})
							}),
				}}
			/>
		</div>
	)
}

export default TeacherLeaves
