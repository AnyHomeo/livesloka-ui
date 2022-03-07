import React, {useCallback, useEffect, useMemo, useState} from "react"
import {
	getComments,
	updateComment,
	deleteComment,
	getData,
	addComments,
} from "../../../Services/Services"
import MaterialTable from "material-table"
import moment from "moment"
import {Dialog, Slide} from "@material-ui/core"
import CommentAutoComplete from "./CommentAutoComplete"

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const Comments = ({commentsCustomerId, name, isCommentsOpen, setIsCommentsOpen}) => {
	const [comments, setComments] = useState([])
	const [messageTemplates, setMessageTemplates] = useState([])
	const [refreshData, setRefreshData] = useState([])
	const fetchData = useCallback(async () => {
		let {data} = await getComments(commentsCustomerId)
		setComments(
			data.result.map((comment) => ({
				message: comment?.message?._id,
				timeStamp: comment.timeStamp,
				_id: comment._id,
			}))
		)
	}, [commentsCustomerId])

	useEffect(() => {
		fetchData()
	}, [fetchData, refreshData])

	const onRowUpdate = useCallback(async (newData, oldData) => {
		await updateComment(newData)
		setRefreshData(prev => !prev)
	}, [])

	const onRowDelete = useCallback(async (rowData) => {
		await deleteComment(rowData)
		setRefreshData(prev => !prev)
	}, [])

	useEffect(() => {
		getData("Comments").then((data) => {
			setMessageTemplates(data?.data?.result || [])
		})
	}, [])

	const columns = useMemo(
		() => [
			{
				title: "Comment",
				field: "message",
				lookup: messageTemplates.reduce((acc, message) => {
					acc[message._id] = message.text
					return acc
				}, {}),
			},
			{
				title: "Time stamp",
				field: "timeStamp",
				type: "date",
				render: (rowData) => moment(rowData.timeStamp).format("MMM Do YY, h:mm A"),
			},
		],
		[messageTemplates]
	)

	const addComment = useCallback(
		async (id) => {
			addComments({
				message: id,
				timeStamp: new Date(),
				customer: commentsCustomerId,
			})
			setRefreshData((prev) => !prev)
		},
		[commentsCustomerId]
	)

	return (
		<Dialog
			open={isCommentsOpen}
			fullWidth
			maxWidth="md"
			onClose={() => setIsCommentsOpen(false)}
			aria-labelledby="form-dialog-title"
			TransitionComponent={Transition}
		>
			<CommentAutoComplete
				options={messageTemplates}
				setOptions={setMessageTemplates}
				addComment={addComment}
			/>
			<MaterialTable
				style={{padding: "0px 20px", margin: 20}}
				title={`${name}'s comments`}
				columns={columns}
				data={comments}
				options={{
					padding: 20,
					paging: false,
					maxBodyHeight: 600,
				}}
				editable={{
					onRowUpdate,
					onRowDelete,
				}}
			/>
		</Dialog>
	)
}

export default Comments
