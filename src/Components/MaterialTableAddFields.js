import React, {useState, useEffect} from "react"
import MaterialTable, {MTableBodyRow, MTableToolbar} from "material-table"
import {getData, addInField, editField, deleteField} from "../Services/Services"
import {Button, Chip, TextField} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import useWindowDimensions from "./useWindowDimensions"
import {isAutheticated} from "../auth"
import {firebase} from "../Firebase"
import Permissions from "./Permissions"
import WhatsApp from "@material-ui/icons/WhatsApp"
import {useSnackbar} from "notistack"

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
					<Chip
						variant="outlined"
						color="primary"
						size="small"
						label={option.subjectName}
						{...getTagProps({index})}
					/>
				))
			}
		/>
	)
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
	permissions,
	roles,
	setSelectedSubject,
	selectedSubject,
}) => {
	const {enqueueSnackbar} = useSnackbar()
	const [columns, setColumns] = useState([])
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)
	const {height} = useWindowDimensions()
	const [imageLoading, setImageLoading] = useState(false)
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		getData(name).then((response) => {
			setData(
				selectedSubject
					? response.data.result.filter((data) => data.subject === selectedSubject)
					: response.data.result
			)
			setLoading(false)
		})
	}, [refresh, name, selectedSubject])

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
			let keys = Object.keys(data[lengths.indexOf(Math.max(...lengths))])
			if (name === "Teacher") {
				keys = [
					"demoPriority",
					"TeacherName",
					"subject",
					"Commission_Amount_One",
					"Commission_Amount_Many",
					...keys,
				]
			}
			setColumns(
				keys.map((key) => {
					if (key === "joinLink") {
						return {
							title: "Join Link",
							field: key,
						}
					}
					if (key === "statusOrder") {
						return {
							title: "Order",
							field: key,
							type: "numeric",
						}
					}
					if (key === "statusCategory") {
						return {
							title: "Category",
							field: key,
							lookup: {SALES: "SALES", SUPPORT: "SUPPORT"},
						}
					}
					if (key === "role") {
						return {
							title: "Role",
							field: key,
							lookup: roles,
						}
					}
					if (key === "permissions") {
						return {
							title: "Permissions",
							type: "string",
							field: "permissions",
							editable: "never",
							render: (rowData) => (
								<Permissions
									allPermissions={permissions}
									availablePermissions={rowData.permissions}
									roleId={rowData._id}
									setRoles={setData}
								/>
							),
						}
					}
					if (key === "rewards") {
						return {
							title: "Rewards",
							type: "numeric",
							field: "rewards",
						}
					}
					if (key === "subjects") {
						return {
							title: humanReadable(key),
							field: key,
							render: (rowData) =>
								rowData[key] &&
								rowData[key].map((subject) => (
									<Chip
										variant="default"
										color="primary"
										size="small"
										key={subject._id}
										label={subject.subjectName}
									/>
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
							editable: !(parseInt(isAutheticated().roleId) === 3) ? "never" : undefined,
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
			)
		}
	}, [lookup, categoryLookup, data, subjectLookup, name, status, currencies, permissions, roles])

	return (
		<>
			<MaterialTable
				title={`${name} Table`}
				columns={columns}
				isLoading={loading || imageLoading}
				options={{
					paging: false,
					padding: 20,
					maxBodyHeight: height - 180,
					addRowPosition: "first",
					actionsColumnIndex: 0,
					exporting: true,
				}}
				components={{
					Row: (props) => (
						<MTableBodyRow
							{...props}
							onDoubleClick={(e) => {
								props.actions[name === "Teacher" ? 2 : 1]().onClick(e, props.data)
							}}
						/>
					),
					Toolbar: (props) => (
						<div>
							<MTableToolbar {...props} />
							{name === "Teacher" ? (
								<div style={{display: "flex", gap: 5, padding: "0 10px"}}>
									{Object.keys(subjectLookup).map((subjectId) => (
										<Chip
											label={subjectLookup[subjectId]}
											size="small"
											variant={selectedSubject === subjectId ? "default" : "outlined"}
											color="secondary"
											onClick={() =>
												setSelectedSubject((prev) => (prev === subjectId ? "" : subjectId))
											}
											style={{marginRight: 5, cursor: "pointer"}}
										/>
									))}
								</div>
							) : (
								""
							)}
						</div>
					),
				}}
				actions={
					name === "Teacher"
						? [
								{
									icon: () => <WhatsApp />,
									tooltip: "Open teachet whatsapp",
									onClick: (event, data) => {
										window.open(
											`https://api.whatsapp.com/send?phone=${data?.Phone_number?.replace(
												"+",
												""
											).replace(" ", "")}`
										)
									},
								},
						  ]
						: []
				}
				data={data}
				editable={{
					isDeleteHidden: (rowData) => (rowData && rowData.statusId) || data.length === 1,
					onRowAdd: (newData) => {
						newData.isDemoIncludedInSalaries = !!newData.isDemoIncludedInSalaries
						return addInField(`Add ${name}`, newData)
							.then((fetchedData) => {
								enqueueSnackbar(fetchedData.data.message, {variant: "success"})
								setRefresh((prev) => !prev)
								setLoading(false)
							})
							.catch((e) => {
								console.error(e.response)
								enqueueSnackbar(e?.response?.data?.message, {variant: "error"})
							})
					},
					onRowUpdate: (newData) => {
						if (name === "Teacher") {
							newData.isDemoIncludedInSalaries = !!newData.isDemoIncludedInSalaries
							newData.isNotAvailableInBooking = !!newData.isNotAvailableInBooking
						}

						return editField(`Update ${name}`, newData).then((fetchedData) => {
							setRefresh((prev) => !prev)
							enqueueSnackbar("Updated successfully", {variant: "success"})
						})
					},
					onRowDelete: (oldData) =>
						deleteField(`Delete ${name}`, oldData["id"])
							.then((fetchedData) => {
								const dataDelete = [...data]
								const index = oldData.tableData.id
								dataDelete.splice(index, 1)
								setData([...dataDelete])
								enqueueSnackbar("Deleted successfully", {variant: "success"})
							})
							.catch((err) => {
								console.error(err, err.response)
								enqueueSnackbar(err.response.data.message || "Something went wrong!", {
									variant: "error",
								})
							}),
				}}
			/>
		</>
	)
}
export default MaterialTableAddFields
