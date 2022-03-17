import React from "react"
import {Grid, Card, CardContent, Typography, Box, LinearProgress, Chip} from "@material-ui/core/"
import {useHistory} from "react-router-dom"
const OccupancyBars = ({setTeacher, setTeacherId, categorizedData, setCategory}) => {
	// console.log(categorizedData)

	const history = useHistory()
	return (
		<>
			<div style={{padding: "30px"}}>
				<Grid container spacing={3}>
					{Object.keys(categorizedData).map((category) => {
						return (
							<React.Fragment key={category}>
								{Object.keys(categorizedData[category]).length ? (
									<Grid item xs={12} sm={4} md={4} lg={3}>
										<Card style={{height: "100%"}}>
											<CardContent>
												<Typography
													variant="h4"
													align={"center"}
													style={{textTransform: "uppercase"}}
												>
													{category}
												</Typography>
												<Grid container direction="row">
													{categorizedData[category].map((item) => {
														return (
															<Chip
																onClick={() => {
																	// setTeacher(teacher)
																	// setTeacherId(id)
																	// setCategory(category)
																	history.push(`/scheduler/mobile/${item.id}`)
																}}
																style={{margin: 5}}
																label={item.TeacherName}
																size="small"
															/>
														)
													})}
													{/* {Object.keys(categorizedData[category]).map((teacher) => {
														// console.log(teacher)
														let {availableSlots, scheduledSlots, id} =
															categorizedData[category][teacher]
														return (
															<Chip
																onClick={() => {
																	setTeacher(teacher)
																	setTeacherId(id)
																	setCategory(category)
																}}
																style={{margin: 5}}
																label={teacher.TeacherName}
																size="small"
															/>
														)
													})} */}
												</Grid>
											</CardContent>
										</Card>
									</Grid>
								) : (
									<span />
								)}
							</React.Fragment>
						)
					})}
				</Grid>
			</div>
		</>
	)
}

export default OccupancyBars
