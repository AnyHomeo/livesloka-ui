import React, {useCallback, useEffect, useMemo, useState} from "react"
import {getComments, updateComment, deleteComment, addComments} from "../../../Services/Services"
import MaterialTable from "material-table"
import moment from "moment"
import {Button, Card, Dialog, IconButton, Slide, TextField} from "@material-ui/core"

import clsx from "clsx"
import {makeStyles} from "@material-ui/core/styles"
import {Clock, Delete, Edit, Trash} from "react-feather"

const useStyles = makeStyles({
	list: {
		width: 250,
	},
	fullList: {
		width: "auto",
	},
})
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const Comments = ({
	commentsCustomerId,
	name,
	isCommentsOpen,
	setIsCommentsOpen,
	drawerState,
	setDrawerState,
}) => {
	const [comments, setComments] = useState([])

	const [text, setText] = useState("")
	const [isUpdate, setIsUpdate] = useState(false)
	const [updatedComment, setUpdatedComment] = useState({})
	const [refreshData, setRefreshData] = useState([])
	const fetchData = useCallback(async () => {
		let {data} = await getComments(commentsCustomerId)
		console.log(commentsCustomerId)
		console.log(data)
		setComments(data.result)
	}, [commentsCustomerId])

	useEffect(() => {
		fetchData()
	}, [fetchData, refreshData])

	const onRowUpdate = useCallback(async (newData, oldData) => {
		console.log(newData)
		await updateComment(newData)
		setRefreshData((prev) => !prev)
		setText("")
		setIsUpdate(false)
		setUpdatedComment({})
	}, [])

	const onRowDelete = useCallback(async (rowData) => {
		await deleteComment(rowData)
		setRefreshData((prev) => !prev)
	}, [])

	const columns = useMemo(
		() => [
			{
				title: "Time stamp",
				field: "timeStamp",
				type: "date",
				editable: "never",
				render: (rowData) => moment(rowData.timeStamp).format("MMM Do YY, h:mm A"),
			},
			{
				title: "Comment",
				field: "text",
				editComponent: (props) => (
					<>
						<textarea
							style={{height: 100, width: 600}}
							onChange={(e) => props.onChange(e.target.value)}
						></textarea>
					</>
				),
			},
		],
		[]
	)

	const onRowAdd = useCallback(
		async (newData) => {
			console.log(newData)
			await addComments({
				...newData,
				customer: commentsCustomerId,
			})
			setRefreshData((prev) => !prev)
			setText("")
			setIsUpdate(false)
			setUpdatedComment({})
		},
		[commentsCustomerId]
	)

	const classes = useStyles()

	return (
		<>
			{/* <Dialog
			open={isCommentsOpen}
			fullWidth
			maxWidth="md"
			onClose={() => setIsCommentsOpen(false)}
			aria-labelledby="form-dialog-title"
			TransitionComponent={Transition}
		>
			<MaterialTable
				style={{padding: "0px 20px", margin: 20}}
				title={`${name}'s comments`}
				columns={columns}
				data={comments}
				options={{
					padding: 20,
					paging: false,
					maxBodyHeight: 600,
					actionsColumnIndex: -1,
				}}
				editable={{
					onRowUpdate,
					onRowDelete,
					onRowAdd,
				}}
			/>
		</Dialog> */}

			<div
				className={clsx(classes.list, {
					[classes.fullList]: "left" === "top" || "left" === "bottom",
				})}
				role="presentation"
			>
				<h2 style={{textAlign: "center"}}>Comments</h2>

				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<textarea
						style={{
							height: 150,
							width: "90%",
							borderRadius: 10,
							outline: "none",
							padding: 10,
							fontSize: 14,
						}}
						value={text}
						onChange={(e) => setText(e.target.value)}
					></textarea>

					<Button
						style={{marginTop: 10}}
						variant="contained"
						color="primary"
						onClick={() => {
							if (isUpdate) {
								onRowUpdate({...updatedComment, text})
							} else {
								onRowAdd({text, timeStamp: new Date()})
							}
						}}
					>
						Submit
					</Button>

					{comments.map((item) => (
						<Card
							style={{
								height: "auto",
								width: "90%",
								borderRadius: 10,
								margin: 5,
								boxShadow:
									"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
								padding: 0,
							}}
						>
							<div
								style={{
									height: "auto",
									width: "100%",
									background: "linear-gradient(135deg,#6253E1,#04BEFE)",
									color: "white",
									padding: 10,
								}}
							>
								<p
									style={{
										fontSize: 14,
										display: "flex",
										alignItems: "center",
									}}
								>
									<Clock style={{height: 15, width: 15, marginRight: 5}} />{" "}
									{moment(item.timeStamp).format("MMM Do YY, h:mm A")}
								</p>
								<p>{item.text}</p>
							</div>

							<div style={{display: "flex", justifyContent: "space-between", padding: 5}}>
								<Button
									style={{
										height: 40,
										width: "40%",
										borderRadius: 10,
										background: "linear-gradient(135deg,#40E495,#30DD8A,#2BB673)",
									}}
									onClick={() => {
										setText(item.text)
										setUpdatedComment(item)
										setIsUpdate(true)
									}}
								>
									<Edit />
								</Button>
								<Button
									style={{
										height: 40,
										width: "40%",
										borderRadius: 10,
										background: "linear-gradient(135deg,#EB3941,#F15E64,#E2373f)",
									}}
									onClick={() => onRowDelete(item)}
								>
									<Trash />
								</Button>
							</div>
						</Card>
					))}
				</div>
			</div>
		</>
	)
}

export default Comments
