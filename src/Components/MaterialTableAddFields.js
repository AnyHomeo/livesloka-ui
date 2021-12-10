/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from "react"
import MaterialTable, {MTableBodyRow} from "material-table"
import MuiAlert from "@material-ui/lab/Alert"
import {getData, addInField, editField, deleteField} from "../Services/Services"
import {Button, Chip, Snackbar, TextField} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import useWindowDimensions from "./useWindowDimensions"
import {isAutheticated} from "../auth"
import {firebase} from "../Firebase"

const DropdownEditor = ({onChange, value}) => {
	const [arr, setArr] = useState(value)
	const [options, setOptions] = useState([])

	useEffect(() => {
		getData("Subject")
			.then((response) => {
				console.log({result: response.data.result})
				setOptions(response.data.result)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	return (
		<Autocomplete
			multiple
			options={options}
			value={arr}
			filterSelectedOptions
			getOptionSelected={(option) => arr.map((i) => i._id).includes(option._id)}
			getOptionLabel={(option) => option.subjectName}
			onChange={(_, newVal) => {
				setArr(newVal)
				console.log(newVal)
				onChange(newVal.map((i) => i._id))
			}}
			renderInput={(params) => (
				<TextField {...params} label={"Subjects"} variant="standard" margin="dense" />
			)}
			renderTags={(value, getTagProps) =>
				value.map((option, index) => (
					<Chip variant="outlined" color="primary" size="small" label={option.subjectName} {...getTagProps({index})} />
				))
			}
		/>
	)
}

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

function humanReadable(name) {
	var words = name.match(/[A-Za-z][^_\-A-Z]*|[0-9]+/g) || []

	return words.map(capitalize).join(" ")
}

function capitalize(word) {
	return word.charAt(0).toUpperCase() + word.substring(1)
}

const MaterialTableAddFields = ({
	name,
	status,
	lookup,
	categoryLookup,
	subjectLookup,
	currencies,
}) => {
	const [column, setColumn] = useState([])
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)
	const [open, setOpen] = useState(false)
	const [success, setSuccess] = useState(false)
	const [response, setResponse] = useState("")
	const {height} = useWindowDimensions()
	const [imageLoading, setImageLoading] = useState(false)
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		getData(name).then((response) => {
			setData(response.data.result)
			setLoading(false)
		})
	}, [refresh])

	const handleFileUpload = async (e, props) => {
		setImageLoading(true)
		if (e.target.files) {
			let storageRef = firebase.storage().ref(`${e.target.files[0].type}/${e.target.files[0].name}`)
			await storageRef.put(e.target.files[0])

			storageRef
				.getDownloadURL()
				.then(async (url) => {
					if (url) {
						setImageLoading(false)
						return props.onChange(url)
					} else {
						setImageLoading(false)
					}
				})
				.catch((err) => {
					console.log(err)
					setImageLoading(false)
				})
		}
	}

	useEffect(() => {
		if (data.length) {
			let lengths = data.map((item) => Object.keys(item).length)
			let v = Object.keys(data[lengths.indexOf(Math.max(...lengths))]).map((key) => {
				if (key === "subjects") {
					return {
						title: humanReadable(key),
						field: key,
						render: (rowData) =>
							rowData[key] &&
							rowData[key].map((subject) => (
									<Chip variant="default" color="primary" size="small" key={subject._id} label={subject.subjectName} />
							)),
						editComponent: (props) => {
							return <DropdownEditor {...props} value={props?.rowData?.subjects || []} />
						},
					}
				}
				if (key === "isNotAvailableInBooking") {
					return {
						title: "Disable in Booking",
						type: "boolean",
						field: "isNotAvailableInBooking",
					}
				}
				if (name === "Time Zone" && key === "currency") {
					return {
						title: "Currency",
						lookup: currencies,
						field: "currency",
					}
				}
				if (name === "Agent" && key === "needToFinalizeSalaries") {
					return {
						title: "Need to Finalize Salaries",
						type: "boolean",
						field: "needToFinalizeSalaries",
					}
				}
				if (name === "Teacher" && key === "isDemoIncludedInSalaries") {
					return {
						title: "Include Demo Classes in Salaries",
						type: "boolean",
						field: "isDemoIncludedInSalaries",
					}
				}
				if (name === "Time Zone" && key === "timeZonePriority") {
					return {
						title: "Show in Auto Booking",
						field: key,
						type: "boolean",
					}
				}
				if (name === "Subject" && key === "category") {
					return {
						title: "Category",
						field: key,
						lookup: categoryLookup,
					}
				}
				if (name === "Teacher" && key === "category") {
					return {
						title: "Category",
						field: key,
						lookup: categoryLookup,
					}
				}
				if (name === "Teacher" && key === "subject") {
					return {
						title: "Subject",
						field: key,
						lookup: subjectLookup,
					}
				}
				if (
					key === "zoomJwt" ||
					key === "zoomSecret" ||
					key === "zoomApi" ||
					key === "summerCampDescription" ||
					key === "summerCampImageLink"
				) {
					return {
						title: humanReadable(key),
						field: key,
						render: (rowData) => (
							<span>
								{rowData[key] ? rowData[key].slice(0, 6) + "...." + rowData[key].slice(-10) : ""}
							</span>
						),
					}
				}
				if (
					key === "timeSlots" ||
					key === "id" ||
					key === "_id" ||
					key === "statusId" ||
					key === "tableData"
				) {
					return {title: humanReadable(key), field: key, hidden: true}
				} else if (key === "TeacherSubjectsId") {
					return {
						title: humanReadable(key),
						field: key,
						render: (rowData) =>
							rowData[key] &&
							rowData[key].map((subject) => (
								<Chip variant="outlined" key={subject._id} label={subject.className} />
							)),
						editComponent: (props) => (
							<DropdownEditor {...props} value={[{_id: "2345455", className: "CLASS OLD"}]} />
						),
					}
				} else if (key === status) {
					return {title: humanReadable(key), field: key, lookup}
				} else if (key === "amount") {
					return {
						title: humanReadable(key),
						field: key,
						type: "numeric",
						align: "left",
					}
				} else if (key === "AgentRole") {
					return {
						title: humanReadable(key),
						field: key,
						lookup: {3: "Admin", 4: "Sales", 5: "Customer Support"},
						editable: !(isAutheticated().roleId == 3) ? "never" : undefined,
					}
				} else if (key === "teacherImageLink") {
					return {
						title: humanReadable(key),
						field: key,
						type: "string",
						cellStyle: {whiteSpace: "nowrap"},
						headerStyle: {whiteSpace: "nowrap"},
						render: (rowData) => {
							return (
								<span>
									{rowData[key] === "" ? null : (
										<img style={{height: 50, width: 50}} src={rowData[key]} alt="" />
									)}
								</span>
							)
						},
						editComponent: (props) => (
							<input
								type="file"
								onChange={(e) => handleFileUpload(e, props)}
								style={{width: "200px"}}
							/>
						),
					}
				} else if (key === "color") {
					return {
						title: humanReadable(key),
						field: key,
						type: "file",
						cellStyle: {whiteSpace: "nowrap"},
						headerStyle: {whiteSpace: "nowrap"},
						render: (rowData) => {
							return (
								<span>
									<Button
										variant="contained"
										style={{background: rowData[key], height: 28, width: 100, marginLeft: 10}}
									></Button>
								</span>
							)
						},
					}
				} else {
					return {title: humanReadable(key), field: key}
				}
			})
			setColumn(v)
		}
	}, [lookup, categoryLookup, data, subjectLookup])

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setOpen(false)
	}

	return (
		<>
			<Snackbar open={open} autoHideDuration={6000} onClose={() => handleClose()}>
				<Alert onClose={() => handleClose()} severity={success ? "success" : "warning"}>
					{response}
				</Alert>
			</Snackbar>
			<MaterialTable
				title={`${name} Table`}
				columns={column}
				isLoading={loading || imageLoading}
				options={{
					paging: false,
					maxBodyHeight: height - 230,
					addRowPosition: "first",
					actionsColumnIndex: -1,
					exporting: true,
					grouping: name === "Teacher",
				}}
				components={{
					Row: (props) => (
						<MTableBodyRow
							{...props}
							onDoubleClick={(e) => {
								props.actions[1]().onClick(e, props.data)
							}}
						/>
					),
				}}
				data={data}
				editable={{
					isDeleteHidden: (rowData) => (rowData && rowData.statusId) || data.length === 1,
					onRowAdd: (newData) => {
						newData.isDemoIncludedInSalaries = !!newData.isDemoIncludedInSalaries
						return addInField(`Add ${name}`, newData)
							.then((fetchedData) => {
								if (fetchedData.data.status === "ok") {
									setSuccess(true)
									setRefresh(prev => !prev)
									setResponse(fetchedData.data.message)
									setOpen(true)
									setLoading(false)
								} else {
									setSuccess(false)
									setResponse(fetchedData.data.message)
									setOpen(true)
									setLoading(false)
								}
							})
							.catch((e) => {
								console.error(e, e.response)
							})
					},
					onRowUpdate: (newData, oldData) => {
						if (name === "Teacher") {
							newData.isDemoIncludedInSalaries = !!newData.isDemoIncludedInSalaries
							newData.isNotAvailableInBooking = !!newData.isNotAvailableInBooking
						}

						return editField(`Update ${name}`, newData).then((fetchedData) => {
							if (fetchedData.data.status === "OK") {
								
								setRefresh(prev => !prev)
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
						deleteField(`Delete ${name}`, oldData["id"])
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
export default MaterialTableAddFields
