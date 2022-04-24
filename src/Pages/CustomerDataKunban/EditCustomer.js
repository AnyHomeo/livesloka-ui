import {Button, makeStyles} from "@material-ui/core"
import React, {useState} from "react"
import {Check, XCircle} from "react-feather"
import {editCustomer} from "../../Services/Services"
const useStyles = makeStyles({
	leftFont: {
		fontSize: 16,
		fontWeight: 600,
		width: "48%",
		textAlign: "right",
	},
	rightFont: {
		fontSize: 16,
		width: "48%",
		textAlign: "left",
		marginLeft: 10,
	},
	hover: {
		padding: 5,
		borderRadius: 5,
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "#95a5a658",
		},
	},
	input: {
		height: 30,
		outlineColor: "#45aaf2",
		borderRadius: 5,
		border: "1px solid #CACACA",
		padding: 5,
		width: "40%",
	},
})

const EditCustomer = ({selectedCustomer, fetchData}) => {
	const classes = useStyles()
	function capitalize(word) {
		return word.charAt(0).toUpperCase() + word.substring(1)
	}

	const [editingData, setEditingData] = useState(selectedCustomer)
	function humanReadable(name) {
		var words = name.match(/[A-Za-z][^_\-A-Z]*|[0-9]+/g) || []
		return words.map(capitalize).join(" ")
	}

	const [display, setDisplay] = useState("notdisplayed")
	const showButton = (e) => {
		e.preventDefault()
		setDisplay("displayed")
	}

	const hideButton = (e) => {
		e.preventDefault()
		setDisplay("notdisplayed")
	}

	const [hoveredFields, setHoveredFields] = useState("")
	const [isInput, setIsInput] = useState(false)

	const handleFormValueChange = (e) => {
		setEditingData({
			...editingData,
			[e.target.name]: e.target.value,
		})
	}

	const onCustomerUpdate = async () => {
		try {
			const res = await editCustomer({...editingData, _id: editingData._id})
			if (res.status === 200) {
				fetchData()
			}
		} catch (error) {
			console.log(error.response)
		}
	}

	let fields = [
		{
			name: "Student Name",
			field: "firstName",
			type: "string",
		},
		{
			name: "Parent Name",
			field: "lastName",
			type: "string",
		},
		{
			name: "Student Name",
			field: "firstName",
			type: "string",
		},
		{
			name: "Student Name",
			field: "firstName",
			type: "string",
		},
		{
			name: "Student Name",
			field: "firstName",
			type: "string",
		},
		{
			name: "Student Name",
			field: "firstName",
			type: "string",
		},
	]

	return (
		<div style={{width: 650, padding: 20}}>
			<p style={{fontSize: 18, fontWeight: 600}}>Customer Details</p>
			<hr style={{marginTop: 20}} />

			<div style={{marginTop: 10}}>
				{Object.keys(editingData).map((item, i) => {
					// console.log(editingData[item])

					if (
						item === "_id" ||
						humanReadable(item).includes(" id") ||
						humanReadable(item).includes(" Id") ||
						item === "createdAt" ||
						item === "updatedAt" ||
						humanReadable(item) === "V"
					) {
						return null
					}

					if (typeof editingData[item] === "object") {
						if (editingData[item]?.subjectName) {
							return (
								<div
									style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
									onMouseEnter={(e) => {
										showButton(e)
										setHoveredFields(item)
									}}
									onMouseLeave={(e) => {
										hideButton(e)
										setHoveredFields("")
									}}
								>
									<div style={{flex: 0.9, marginRight: 10}}>
										<span
											className={classes.hover}
											key={i}
											style={{display: "flex", justifyContent: "space-between"}}
										>
											<p className={classes.leftFont}>{humanReadable(item)}</p>

											{isInput && item === hoveredFields ? (
												<input
													name={item}
													onChange={handleFormValueChange}
													value={editingData[item]}
													className={classes.input}
													type="text"
												/>
											) : (
												<p className={classes.rightFont}>{editingData[item]?.subjectName}</p>
											)}
										</span>
									</div>

									{item === hoveredFields && (
										<div className={display}>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#2ecc71",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
												}}
												onClick={() => setIsInput(!isInput)}
											>
												<Check style={{height: 18, width: 18}} />
											</div>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#e74c3c",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
													marginLeft: 10,
												}}
												onClick={() => setIsInput(false)}
											>
												<XCircle style={{height: 18, width: 18}} />
											</div>
										</div>
									)}
								</div>
							)
						}

						if (editingData[item]?.AgentName) {
							return (
								<div
									style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
									onMouseEnter={(e) => {
										showButton(e)
										setHoveredFields(item)
									}}
									onMouseLeave={(e) => {
										hideButton(e)
										setHoveredFields("")
									}}
								>
									<div style={{flex: 0.9, marginRight: 10}}>
										<span
											className={classes.hover}
											key={i}
											style={{display: "flex", justifyContent: "space-between"}}
										>
											<p className={classes.leftFont}>{humanReadable(item)}</p>

											{isInput && item === hoveredFields ? (
												<input
													name={item}
													onChange={handleFormValueChange}
													value={editingData[item]}
													className={classes.input}
													type="text"
												/>
											) : (
												<p className={classes.rightFont}>{editingData[item]?.AgentName}</p>
											)}
										</span>
									</div>

									{item === hoveredFields && (
										<div className={display}>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#2ecc71",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
												}}
												onClick={() => setIsInput(!isInput)}
											>
												<Check style={{height: 18, width: 18}} />
											</div>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#e74c3c",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
													marginLeft: 10,
												}}
												onClick={() => setIsInput(false)}
											>
												<XCircle style={{height: 18, width: 18}} />
											</div>
										</div>
									)}
								</div>
							)
						}

						if (editingData[item]?.currencyName) {
							return (
								<div
									style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
									onMouseEnter={(e) => {
										showButton(e)
										setHoveredFields(item)
									}}
									onMouseLeave={(e) => {
										hideButton(e)
										setHoveredFields("")
									}}
								>
									<div style={{flex: 0.9, marginRight: 10}}>
										<span
											className={classes.hover}
											key={i}
											style={{display: "flex", justifyContent: "space-between"}}
										>
											<p className={classes.leftFont}>{humanReadable(item)}</p>

											{isInput && item === hoveredFields ? (
												<input
													name={item}
													onChange={handleFormValueChange}
													value={editingData[item]}
													className={classes.input}
													type="text"
												/>
											) : (
												<p className={classes.rightFont}>{editingData[item]?.AgentName}</p>
											)}
										</span>
									</div>

									{item === hoveredFields && (
										<div className={display}>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#2ecc71",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
												}}
												onClick={() => setIsInput(!isInput)}
											>
												<Check style={{height: 18, width: 18}} />
											</div>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#e74c3c",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
													marginLeft: 10,
												}}
												onClick={() => setIsInput(false)}
											>
												<XCircle style={{height: 18, width: 18}} />
											</div>
										</div>
									)}
								</div>
							)
						}

						if (editingData[item]?.TeacherName) {
							return (
								<div
									style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
									onMouseEnter={(e) => {
										showButton(e)
										setHoveredFields(item)
									}}
									onMouseLeave={(e) => {
										hideButton(e)
										setHoveredFields("")
									}}
								>
									<div style={{flex: 0.9, marginRight: 10}}>
										<span
											className={classes.hover}
											key={i}
											style={{display: "flex", justifyContent: "space-between"}}
										>
											<p className={classes.leftFont}>{humanReadable(item)}</p>

											{isInput && item === hoveredFields ? (
												<input
													name={item}
													onChange={handleFormValueChange}
													value={editingData[item]}
													className={classes.input}
													type="text"
												/>
											) : (
												<p className={classes.rightFont}>{editingData[item]?.TeacherName}</p>
											)}
										</span>
									</div>

									{item === hoveredFields && (
										<div className={display}>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#2ecc71",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
												}}
												onClick={() => setIsInput(!isInput)}
											>
												<Check style={{height: 18, width: 18}} />
											</div>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#e74c3c",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
													marginLeft: 10,
												}}
												onClick={() => setIsInput(false)}
											>
												<XCircle style={{height: 18, width: 18}} />
											</div>
										</div>
									)}
								</div>
							)
						}

						if (editingData[item]?.timeZoneName) {
							return (
								<div
									style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
									onMouseEnter={(e) => {
										showButton(e)
										setHoveredFields(item)
									}}
									onMouseLeave={(e) => {
										hideButton(e)
										setHoveredFields("")
									}}
								>
									<div style={{flex: 0.9, marginRight: 10}}>
										<span
											className={classes.hover}
											key={i}
											style={{display: "flex", justifyContent: "space-between"}}
										>
											<p className={classes.leftFont}>{humanReadable(item)}</p>

											{isInput && item === hoveredFields ? (
												<input
													name={item}
													onChange={handleFormValueChange}
													value={editingData[item]}
													className={classes.input}
													type="text"
												/>
											) : (
												<p className={classes.rightFont}>{editingData[item]?.timeZoneName}</p>
											)}
										</span>
									</div>

									{item === hoveredFields && (
										<div className={display}>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#2ecc71",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
												}}
												onClick={() => setIsInput(!isInput)}
											>
												<Check style={{height: 18, width: 18}} />
											</div>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#e74c3c",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
													marginLeft: 10,
												}}
												onClick={() => setIsInput(false)}
											>
												<XCircle style={{height: 18, width: 18}} />
											</div>
										</div>
									)}
								</div>
							)
						}

						if (editingData[item]?.classStatusName) {
							return (
								<div
									style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
									onMouseEnter={(e) => {
										showButton(e)
										setHoveredFields(item)
									}}
									onMouseLeave={(e) => {
										hideButton(e)
										setHoveredFields("")
									}}
								>
									<div style={{flex: 0.9, marginRight: 10}}>
										<span
											className={classes.hover}
											key={i}
											style={{display: "flex", justifyContent: "space-between"}}
										>
											<p className={classes.leftFont}>{humanReadable(item)}</p>

											{isInput && item === hoveredFields ? (
												<input
													name={item}
													onChange={handleFormValueChange}
													value={editingData[item]}
													className={classes.input}
													type="text"
												/>
											) : (
												<p className={classes.rightFont}>{editingData[item]?.classStatusName}</p>
											)}
										</span>
									</div>

									{item === hoveredFields && (
										<div className={display}>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#2ecc71",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
												}}
												onClick={() => setIsInput(!isInput)}
											>
												<Check style={{height: 18, width: 18}} />
											</div>
											<div
												style={{
													height: 25,
													width: 25,
													backgroundColor: "#e74c3c",
													borderRadius: 50,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "white",
													marginLeft: 10,
												}}
												onClick={() => setIsInput(false)}
											>
												<XCircle style={{height: 18, width: 18}} />
											</div>
										</div>
									)}
								</div>
							)
						}

						return null
					}
					return (
						<div
							style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
							onMouseEnter={(e) => {
								showButton(e)
								setHoveredFields(item)
							}}
							onMouseLeave={(e) => {
								hideButton(e)
								setHoveredFields("")
							}}
						>
							<div style={{flex: 0.9, marginRight: 10}}>
								<span
									className={classes.hover}
									key={i}
									style={{display: "flex", justifyContent: "space-between"}}
								>
									<p className={classes.leftFont}>{humanReadable(item)}</p>

									{isInput && item === hoveredFields ? (
										<input
											name={item}
											onChange={handleFormValueChange}
											value={editingData[item]}
											className={classes.input}
											type="text"
										/>
									) : (
										<p className={classes.rightFont}>{editingData[item]}</p>
									)}
								</span>
							</div>

							{item === hoveredFields && (
								<div className={display}>
									<div
										style={{
											height: 25,
											width: 25,
											backgroundColor: "#2ecc71",
											borderRadius: 50,
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											color: "white",
										}}
										onClick={() => {
											setIsInput(!isInput)
											if (isInput) {
												onCustomerUpdate()
											}
										}}
									>
										<Check style={{height: 18, width: 18}} />
									</div>
									<div
										style={{
											height: 25,
											width: 25,
											backgroundColor: "#e74c3c",
											borderRadius: 50,
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											color: "white",
											marginLeft: 10,
										}}
										onClick={() => setIsInput(false)}
									>
										<XCircle style={{height: 18, width: 18}} />
									</div>
								</div>
							)}
						</div>
					)
				})}
			</div>

			{/* <div style={{display: "flex"}}>
				<Button style={{backgroundColor: "#2ecc71", color: "white"}} onClick={onCustomerUpdate}>
					Submit
				</Button>
			</div> */}
		</div>
	)
}

export default EditCustomer
