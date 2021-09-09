import {Chip, Fab, makeStyles, Typography} from "@material-ui/core"
import React, {useEffect, useState} from "react"
import {Calendar, Trash2, Copy, Edit} from "react-feather"
import {Avatar, IconButton, Grid} from "@material-ui/core"
import moment from "moment"
import Collapse from "@material-ui/core/Collapse"
import Axios from "axios"

const useStyles = makeStyles({
	container: {
		marginTop: 30,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	card: {
		width: "100%",
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
		borderRadius: 10,
		padding: 20,
		marginTop: 30,
		cursor: "pointer",
	},
	infoContainer: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	info: {
		display: "flex",
		alignItems: "center",
		flex: 0.333,
	},
	plansWrapper: {
		padding: 10,
		boxSizing: "border-box",
	},
	planCard: {
		borderRadius: 10,
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
		minHeight: 200,
		display: "flex",
		justifyContent: "space-around",
		flexDirection: "column",
		overflow: "hidden",
		padding: 10,
	},
	addNewPlan: {
		borderRadius: 10,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "2px dashed #aaa",
		minHeight: 200,
		fontSize: "1rem",
	},
	planActions: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		gap: 10,
	},
	planTitle: {
		textAlign: "center",
		padding: "10px 0",
	},
	status: {
		transform: "translateX(-20px)",
		width: "fit-content",
	},
})
const SubjectCards = ({data, refresh}) => {
	const classes = useStyles()
	const [isPlansOpen, setIsPlansOpen] = useState(false)
	const [plans, setPlans] = useState()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (isPlansOpen) {
			getProducts()
		}
		console.log(isPlansOpen)
	}, [isPlansOpen, refresh])

	const getProducts = async () => {
		setLoading(true)
		try {
			const res = await Axios.get(
				`${process.env.REACT_APP_API_KEY}/subscriptions/get/plans/${data.id}`
			)
			setPlans(res?.data?.result?.plans || [])
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	return (
		<>
			{data && (
				<>
					<div className={classes.card} onClick={() => setIsPlansOpen((prev) => !prev)}>
						<div className={classes.infoContainer}>
							<div className={classes.info}>
								<Avatar style={{backgroundColor: "#e67e22"}}>{data.name[0]}</Avatar>
								<div>
									<p style={{marginLeft: 10}}>{data.name}</p>
									<p style={{marginLeft: 10, fontSize: 12}}>{data.description}</p>
								</div>
							</div>
							<div style={{display: "flex", flex: 0.333}}>
								<Calendar />{" "}
								<p style={{marginLeft: 10}}>{moment(data.create_time).format("MMMM Do YYYY")}</p>
							</div>
							<div>
								<IconButton>
									<Edit />
								</IconButton>
								<IconButton>
									<Trash2 />
								</IconButton>
							</div>
						</div>
						<Collapse in={isPlansOpen}>
							<div className={classes.plansWrapper}>
								<Typography variant="h3" className={classes.planTitle}>
									{" "}
									{data.name} Plans{" "}
								</Typography>
								<Grid container spacing={2}>
									{/* <Grid item xs={12} sm={4} md={3}>
										<div className={classes.addNewPlan}>Add New Plan</div>
									</Grid> */}

									{plans &&
										plans.map((item, i) => (
											<Grid key={i} item xs={12} sm={4} md={3}>
												<div className={classes.planCard}>
													<Chip
														size="small"
														color="primary"
														className={classes.status}
														label={`,    ${item.status}`}
													/>
													<Typography variant="h3" style={{textAlign: "center"}}>
														{item.name}
													</Typography>
													<Typography variant="caption">{item.description}</Typography>
													<div className={classes.planActions}>
														<Fab size="small">
															<Edit />
														</Fab>
														<Fab size="small">
															<Trash2 />
														</Fab>
													</div>
												</div>
											</Grid>
										))}
								</Grid>
							</div>
						</Collapse>
					</div>
				</>
			)}
		</>
	)
}

export default SubjectCards
