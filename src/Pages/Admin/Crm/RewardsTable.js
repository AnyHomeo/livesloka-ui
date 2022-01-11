import React, {useEffect, useState} from "react"
import TableContainer from "@material-ui/core/TableContainer"
import {Paper} from "@material-ui/core"
import {Table} from "@material-ui/core"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import TableBody from "@material-ui/core/TableBody"
import Axios from "axios"

function RewardsTable({customerId}) {
	const [rewardsHistoryData, setRewardsHistoryData] = useState()
	useEffect(() => {
		getUserHistory()
	}, [])
	const getUserHistory = async () => {
		try {
			const data = await Axios.get(
				`${process.env.REACT_APP_API_KEY}/rewards/user/${customerId}?redeems=1`
			)

			setRewardsHistoryData(data?.data?.result?.redeems)
		} catch (error) {
			console.log(error)
		}
	}
	const rewardsHistory = [
		{
			prev: 0,
			next: 1,
			teacher: "Jill Mehta Bharatanatyam",
			comment: "Teacher Absent",
		},
		{
			prev: 1,
			next: 2,
			teacher: "Jill Mehta Bharatanatyam",
			comment: "Teacher Absent",
		},
		{
			prev: 2,
			next: 3,
			teacher: "Jill Mehta Bharatanatyam",
			comment: "Teacher Absent",
		},
		{
			prev: 3,
			next: 4,
			teacher: "Jill Mehta Bharatanatyam",
			comment: "Teacher Absent",
		},
		{
			prev: 4,
			next: 5,
			teacher: "Jill Mehta Bharatanatyam",
			comment: "Teacher Absent",
		},
	]

	return (
		<TableContainer component={Paper}>
			<Table aria-label="Rewards table">
				<TableHead>
					<TableRow>
						<TableCell>Previous </TableCell>
						<TableCell>Present </TableCell>
						<TableCell align="right">Comment</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rewardsHistoryData &&
						rewardsHistoryData.map((row) => (
							<TableRow key={row.name}>
								<TableCell component="th" scope="row">
									{row.prev}
								</TableCell>
								<TableCell align="right">{row.present}</TableCell>
								<TableCell align="right">{row.message}</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default RewardsTable
