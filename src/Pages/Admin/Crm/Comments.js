import React, {useCallback, useEffect, useRef, useState} from "react"
import {getComments, updateComment, deleteComment, addComments} from "../../../Services/Services"
import moment from "moment"
import {Box, Button, Card, Chip, Drawer, Fab, TextField, Tooltip} from "@material-ui/core"

import {makeStyles} from "@material-ui/core/styles"
import {Edit, Trash} from "react-feather"
import {useConfirm} from "material-ui-confirm"
import {useSnackbar} from "notistack"

const useStyles = makeStyles({
	list: {
		width: 250,
	},
	textAreaWrapper: {
		padding: 10,
		display: "flex",
		gap: 10,
		flexDirection: "column",
	},
	commentsWrapper: {
		display: "flex",
		padding: 10,
		gap: 10,
		flexDirection: "column",
	},
	commentActionsWrapper: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		gap: 10,
		marginBottom: 5,
	},
	timeStamp: {
		position: "absolute",
		left: 10,
		top: 10,
	},
	card: {
		padding: 10,
		position: "relative",
	},
})

const Comments = ({commentsCustomerId, drawerState, setDrawerState}) => {
	const [comments, setComments] = useState([])
	const [comment, setComment] = useState("")
	const headingEl = useRef(null)
	const inputEl = useRef(null)
	const confirm = useConfirm()
	const {enqueueSnackbar} = useSnackbar()

	const [editingId, setEditingId] = useState("")
	const [refresh, setRefresh] = useState(false)

	const fetchData = useCallback(async () => {
		let {data} = await getComments(commentsCustomerId)
		setComments(data.result)
		setComment("")
		setEditingId("")
	}, [commentsCustomerId])

	useEffect(() => {
		fetchData()
	}, [fetchData, refresh])

	const onCommentSubmit = useCallback(async () => {
		if (!comment) {
			return enqueueSnackbar("Message is required", {
				variant: "error",
			})
		}
		if (editingId) {
			await updateComment({_id: editingId, text: comment})
			enqueueSnackbar("Updated comment successfully", {
				variant: "success",
			})
		} else {
			await addComments({
				customer: commentsCustomerId,
				text: comment,
			})
			enqueueSnackbar("Added message successfully", {
				variant: "success",
			})
		}
		setRefresh((prev) => !prev)
		setComment("")
		setEditingId("")
	}, [editingId, commentsCustomerId, comment, enqueueSnackbar])

	const onRowDelete = useCallback(
		async (rowData) => {
			try {
				await confirm({
					description: "Do you really wanna delete the comment ?",
					confirmationText: "Yes, Delete",
					cancellationText: "No",
				})
				await deleteComment(rowData)
				setRefresh((prev) => !prev)
			} catch (error) {
				console.log(error)
			}
		},
		[confirm]
	)

	const classes = useStyles()

	return (
		<Drawer
			anchor="left"
			open={!!commentsCustomerId}
			onClose={() => setDrawerState({...drawerState, left: false})}
		>
			<div className={classes.list} role="presentation">
				<h2 style={{textAlign: "center"}} ref={headingEl}>
					Comments
				</h2>
				<div className={classes.textAreaWrapper}>
					<TextField
						value={comment}
						variant="outlined"
						multiline
						rows={5}
						fullWidth
						onChange={(e) => setComment(e.target.value)}
						inputRef={inputEl}
						label={editingId ? "Edit Comment" : "Add comment"}
					/>
					<Button variant="contained" color="primary" fullWidth onClick={onCommentSubmit}>
						Submit
					</Button>
				</div>
				<Box className={classes.commentsWrapper}>
					{comments.map((item) => (
						<Card className={classes.card}>
							<Tooltip title={moment(item.timeStamp).format("LLL")} placement="top-start">
								<Chip
									label={moment(item.timeStamp).fromNow()}
									size="small"
									className={classes.timeStamp}
								/>
							</Tooltip>

							<div className={classes.commentActionsWrapper}>
								<Fab
									color="primary"
									variant="extended"
									size="small"
									onClick={() => {
										setComment(item.text)
										setEditingId(item._id)
										headingEl.current.scrollIntoView({
											behavior: "smooth",
											block: "nearest",
											inline: "start",
										})

										setTimeout(() => {
											inputEl.current.focus()
										}, 500)
									}}
								>
									<Edit size={15} />
								</Fab>
								<Fab onClick={() => onRowDelete(item)} variant="extended" size="small">
									<Trash size={15} />
								</Fab>
							</div>
							<p>{item.text}</p>
						</Card>
					))}
				</Box>
			</div>
		</Drawer>
	)
}

export default Comments
