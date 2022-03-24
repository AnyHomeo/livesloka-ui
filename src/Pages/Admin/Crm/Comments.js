import React, {useCallback, useEffect, useState} from "react"
import {getComments, updateComment, deleteComment, addComments} from "../../../Services/Services"
import moment from "moment"
import {Button, Card, IconButton} from "@material-ui/core"

import clsx from "clsx"
import {makeStyles} from "@material-ui/core/styles"
import {Clock, Edit, Trash} from "react-feather"

const useStyles = makeStyles({
	list: {
		width: 250,
	},
	fullList: {
		width: "auto",
	},
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
							background: "linear-gradient(135deg,#6253E1,#04BEFE)",
							display: "flex",
						}}
					>
						<div
							style={{
								height: "auto",
								width: "100%",

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
								{moment(item.timeStamp).format("MMM Do YY")}
							</p>
							<p>{item.text}</p>
						</div>

						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								padding: 5,
								flexDirection: "column",
							}}
						>
							<IconButton
								onClick={() => {
									setText(item.text)
									setUpdatedComment(item)
									setIsUpdate(true)
								}}
							>
								<Edit style={{color: "white"}} />
							</IconButton>
							<IconButton onClick={() => onRowDelete(item)}>
								<Trash style={{color: "#EB3941"}} />
							</IconButton>
						</div>
					</Card>
				))}
			</div>
		</div>
	)
}

export default Comments
