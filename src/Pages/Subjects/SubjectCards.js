import {Chip, Fab, makeStyles, Typography} from "@material-ui/core"
import React, {useState} from "react"
import {Calendar, Trash2, Copy, Edit} from "react-feather"
import {Avatar, IconButton, Grid} from "@material-ui/core"
import moment from "moment"
import Collapse from "@material-ui/core/Collapse"

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
		justifyContent:'space-around',
		flexDirection: "column",
		overflow: "hidden",
		padding: 10
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
	planActions:{
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		gap:10
	},
	planTitle:{
		textAlign: "center",
		padding:"10px 0"
	},
	status:{
		transform: "translateX(-20px)",
		width:"fit-content"
	}
})
const SubjectCards = ({data}) => {
	const classes = useStyles()
	const [isPlansOpen, setIsPlansOpen] = useState(false)

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
								<Typography variant="h3" className={classes.planTitle} > {data.name} Plans </Typography>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={4} md={3}>
										<div className={classes.addNewPlan}>Add New Plan</div>
									</Grid>
									<Grid item xs={12} sm={4} md={3}>
										<div className={classes.planCard}>
											<Chip size="small" color="primary" className={classes.status} label=",  ACTIVE" />
											<Typography variant="h3" style={{textAlign: "center"}} >One Month Plan</Typography>
											<Typography variant="caption">
												this is a description for 1 month plan
											</Typography>
											<div className={classes.planActions}>
												<Fab size="small" >
													<Edit />
												</Fab>
												<Fab size="small" >
													<Trash2 />
												</Fab>
											</div>
										</div>
									</Grid>
									<Grid item xs={12} sm={4} md={3}>
										<div className={classes.planCard}>
											<Chip size="small" color="secondary" className={classes.status} label=",  INACTIVE" />
											<Typography variant="h3" style={{textAlign: "center"}} >Six Month Plan</Typography>
											<Typography variant="caption">
												this is a description for 6 month plan
											</Typography>
											<div className={classes.planActions}>
												<Fab size="small" >
													<Edit />
												</Fab>
												<Fab size="small" >
													<Trash2 />
												</Fab>
											</div>
										</div>
									</Grid>
									<Grid item xs={12} sm={4} md={3}>
										<div className={classes.planCard}>
											<Chip size="small" color="primary" className={classes.status} label=",  ACTIVE" />
											<Typography variant="h3" style={{textAlign: "center"}} >One Year Plan</Typography>
											<Typography variant="caption">
												this is a description for 1 year plan
											</Typography>
											<div className={classes.planActions}>
												<Fab size="small" >
													<Edit />
												</Fab>
												<Fab size="small" >
													<Trash2 />
												</Fab>
											</div>
										</div>
									</Grid>
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
