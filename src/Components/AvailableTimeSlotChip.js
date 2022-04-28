import React from "react"
import {makeStyles} from "@material-ui/core/styles"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import Chip from "@material-ui/core/Chip"
import {Grid} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		maxWidth: 300,
	},
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		margin: 2,
	},
	noLabel: {
		marginTop: theme.spacing(3),
	},
}))

export default function AvailableTimeSlotChip({
	data,
	state,
	setState,
	timeSlots,
	valueFinder,
	label,
	labelFinder,
}) {
	const classes = useStyles()

	const handleChipChange = (event) => {
		setState((prev) => {
			let prevData = [...prev]
			if (prevData.includes(event)) {
				prevData.splice(prevData.indexOf(event), 1)
				return prevData
			} else {
				return [...prevData, event]
			}
		})
	}

	const labelGenerator = (label) => {
		return `${label.split(" ")[0].split("-")[1]} ${label.split(" ")[2]} `
	}

	return (
		<div>
			<FormControl variant="outlined" className={classes.formControl}>
				<InputLabel id="label">{label}</InputLabel>
				{/* <Select
					style={{width: "300px"}}
					labelId="label"
					id="demo-mutiple-chip"
					multiple
					value={state}
					variant="outlined"
					onChange={handleChange}
					input={<Chip id="select-multiple-chip" variant="outlined" />}
					renderValue={(selected) => {
						return (
							<div className={classes.chips}>
								{selected &&
									selected.map((value) => {
										return (
											<Chip
												key={value}
												label={timeSlots ? value : value.split("!@#$%^&*($%^")[0]}
												className={classes.chip}
											/>
										)
									})}
							</div>
						)
					}}
					MenuProps={MenuProps}
				>
					{data &&
						data.map((item) => {
							return (
								<Chip
									key={
										timeSlots
											? valueFinder(item)
											: labelFinder(item) + "!@#$%^&*($%^" + valueFinder(item)
									}
									value={
										timeSlots
											? valueFinder(item)
											: labelFinder(item) + "!@#$%^&*($%^" + valueFinder(item)
									}
								>
									{labelFinder(item)}
								</Chip>
							)
						})}
				</Select> */}

				<Grid
					container
					style={{
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{data &&
						data.map((item) => {
							return (
								<>
									{/* <Chip
									key={
										timeSlots ? valueFinder(item) : labelFinder(item) + " - " + valueFinder(item)
									}
									style={{
										margin: 5,
										backgroundColor: state.includes(
											timeSlots ? valueFinder(item) : labelFinder(item) + " - " + valueFinder(item)
										)
											? "#3867d6"
											: "white",
										color: state.includes(
											timeSlots ? valueFinder(item) : labelFinder(item) + " - " + valueFinder(item)
										)
											? "white"
											: "black",
									}}
									label={labelGenerator(
										timeSlots ? valueFinder(item) : labelFinder(item) + " - " + valueFinder(item)
									)}
									clickable
									color="primary"
									onClick={() =>
										handleChipChange(
											timeSlots ? valueFinder(item) : labelFinder(item) + " - " + valueFinder(item)
										)
									}
									// deleteIcon={<DoneIcon />}
									variant="outlined"
								/> */}

									<Chip
										key={labelFinder(item)}
										style={{
											margin: 5,
											backgroundColor: state.includes(labelFinder(item)) ? "#3867d6" : "white",
											color: state.includes(labelFinder(item)) ? "white" : "black",
										}}
										label={labelGenerator(labelFinder(item))}
										clickable
										color="primary"
										onClick={() => handleChipChange(labelFinder(item))}
										// deleteIcon={<DoneIcon />}
										variant="outlined"
									/>
								</>
							)
						})}
				</Grid>
			</FormControl>
		</div>
	)
}
