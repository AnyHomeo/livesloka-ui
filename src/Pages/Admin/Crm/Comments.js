import React, {useCallback, useEffect, useMemo, useState} from "react"
import {getComments, updateComment, deleteComment, addComments} from "../../../Services/Services"
import MaterialTable from "material-table"
import moment from "moment"
import {Dialog, Slide} from "@material-ui/core"

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const Comments = ({commentsCustomerId, name, isCommentsOpen, setIsCommentsOpen}) => {
	const [comments, setComments] = useState([])
	const [refreshData, setRefreshData] = useState([])
	const fetchData = useCallback(async () => {
		let {data} = await getComments(commentsCustomerId)

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
		</Dialog>
	)
}

export default Comments
