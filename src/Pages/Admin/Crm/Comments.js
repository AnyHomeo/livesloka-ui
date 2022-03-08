import React, {useCallback, useEffect, useState} from "react"
import {getComments, updateComment, deleteComment, getData} from "../../../Services/Services"
import MaterialTable from "material-table"
import moment from "moment"
import CloseIcon from "@material-ui/icons/Close"
import {
	AppBar,
	Button,
	Dialog,
	IconButton,
	makeStyles,
	Slide,
	Toolbar,
	Typography,
} from "@material-ui/core"

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const Comments = ({commentsCustomerId, name, isCommentsOpen, setIsCommentsOpen}) => {
	const classes = useStyles()
	const [comments, setComments] = useState([])
	const [columns, setColumns] = useState([])
	const fetchData = useCallback(async () => {
		let {data} = await getComments(commentsCustomerId)
		setComments(data)
	}, [commentsCustomerId])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	useEffect(() => {
		getData("Customer Message Templates").then((data) => {
			setColumns([
				{
					title: "Comment",
					field: "message.text",
					lookup: data.data.result.reduce((acc, message) => {
						acc[message._id] = message.text
						return acc
					}, {}),
				},
				// {
				// 	title: "Agent",
				// 	field: "createdBy.AgentName",
				// 	editable: "never",
				// },
				{
					title: "Created at",
					field: "timeStamp",
					type: "date",
					render: (rowData) => moment(rowData.timeStamp).format("MMMM Do YYYY"),
				},
			])
		})
	}, [])

	return (
		<Dialog
			open={isCommentsOpen}
			fullWidth
			maxWidth="md"
			onClose={() => setIsCommentsOpen(false)}
			aria-labelledby="form-dialog-title"
			TransitionComponent={Transition}
		>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={() => setIsCommentsOpen(false)}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						See all {name}'s Comments here
					</Typography>
					<Button autoFocus color="inherit" onClick={() => setIsCommentsOpen(false)}>
						Cancel
					</Button>
				</Toolbar>
			</AppBar>
			<MaterialTable
				title={`comments of ${name}`}
				columns={columns}
				data={comments}
				editable={{
					onRowAdd: (newData) =>
						new Promise((resolve, reject) => {
							resolve()
						}),
					onRowUpdate: (newData) => {},
					onRowDelete: (oldData) => {},
				}}
			/>
		</Dialog>
	)
}

export default Comments

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: "relative",
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
}))
