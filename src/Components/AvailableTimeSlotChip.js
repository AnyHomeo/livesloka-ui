import React from "react"
import {makeStyles, useTheme} from "@material-ui/core/styles"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import Chip from "@material-ui/core/Chip"
import {ChevronLeft} from "@material-ui/icons"
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

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
}

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

	const handleChange = (event) => {
		setState(event.target.value)
	}

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
								<Chip
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
									label={
										timeSlots ? valueFinder(item) : labelFinder(item) + " - " + valueFinder(item)
									}
									clickable
									color="primary"
									onClick={() =>
										handleChipChange(
											timeSlots ? valueFinder(item) : labelFinder(item) + " - " + valueFinder(item)
										)
									}
									// deleteIcon={<DoneIcon />}
									variant="outlined"
								/>
							)
						})}
				</Grid>
			</FormControl>
		</div>
	)
}
