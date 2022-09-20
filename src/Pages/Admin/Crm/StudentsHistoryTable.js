import React from "react"
import useWindowDimensions from "../../../Components/useWindowDimensions"

import {makeStyles} from "@material-ui/core/styles"
import moment from "moment"
import {Button, IconButton} from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import {Link} from "react-router-dom"
import {isAutheticated} from "../../../auth"
import ClassesLeftMobile from "./MobileViews/ClassesLeftMobile"
import {Edit, X} from "react-feather"
const useStyles = makeStyles((theme) => ({
	root: {
		width: "90%",
		margin: "0 auto",
	},
	heading: {
		fontSize: "15px",
		fontWeight: "bold",
	},
	formControl: {
		width: "100%",
		marginBottom: "20px",
	},

	isPresentClass: {},
}))

const StudentHistoryTable = ({data, id, setHistoryOpen}) => {
	const {width} = useWindowDimensions()

	const classes = useStyles()
	return (
		<div>
			<div className={classes.root}>
				<div style={{display: "flex", justifyContent: "space-between"}}>
					<div>
						{isAutheticated().roleId === 3 ? (
							<Link to={"/update/classes/" + id}>
								<IconButton>
									<Edit />
								</IconButton>
							</Link>
						) : (
							""
						)}
					</div>

					<IconButton onClick={() => setHistoryOpen(false)}>
						<X />
					</IconButton>
				</div>

				{width > 768 ? (
					<>
						{" "}
						{data.data.result.length === 0 ? (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<p>No Data Found</p>
							</div>
						) : (
							<TableContainer component={Paper} style={{margin: "40px 0"}}>
								<Table className={classes.table} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>Prev Class Count</TableCell>
											<TableCell>Next Class Count</TableCell>
											<TableCell>Date</TableCell>
											<TableCell>Comment</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data &&
											data.data.result.map((data) => {
												return (
													<TableRow key={data._id}>
														<TableCell component="th" style={{color: "black"}} scope="row">
															{data.previousValue}
														</TableCell>
														<TableCell component="th" style={{color: "black"}} scope="row">
															{data.nextValue}
														</TableCell>
														<TableCell style={{color: "black"}}>
															{moment(data.createdAt).format("LLL")}
														</TableCell>
														<TableCell style={{color: "black"}}>{data.comment}</TableCell>
													</TableRow>
												)
											})}
									</TableBody>
								</Table>
							</TableContainer>
						)}
					</>
				) : (
					<>
						{data &&
							data.data.result.map((data) => {
								return <ClassesLeftMobile data={data} />
							})}
					</>
				)}
			</div>
		</div>
	)
}

export default StudentHistoryTable
