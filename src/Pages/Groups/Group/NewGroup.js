import React, {useState} from "react"
import {makeStyles} from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Checkbox from "@material-ui/core/Checkbox"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import {TextField} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
	root: {
		margin: "auto",
	},
	paper: {
		width: 300,
		height: 230,
		overflow: "auto",
	},
	button: {
		margin: theme.spacing(0.5, 0),
	},
}))

function not(a, b) {
	return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a, b) {
	return a.filter((value) => b.indexOf(value) !== -1)
}

export default function TransferList({toRoom, inRoom, dataToParent, type}) {
	const classes = useStyles()
	const [checked, setChecked] = React.useState([])

	const [left, setLeft] = React.useState(toRoom.filter((el) => !inRoom.includes(el)))
	const [right, setRight] = React.useState(inRoom)

	const [leftSearch, setLeftSearch] = useState("")
	const [rightSearch, setRightSearch] = useState("")

	const leftChecked = intersection(checked, left)
	const rightChecked = intersection(checked, right)

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value)
		const newChecked = [...checked]

		if (currentIndex === -1) {
			newChecked.push(value)
		} else {
			newChecked.splice(currentIndex, 1)
		}

		setChecked(newChecked)
	}

	const handleAllRight = () => {
		setRight(right.concat(left))
		setLeft([])
		dataToParent(right.concat(left), type)
	}

	const handleCheckedRight = () => {
		setRight(right.concat(leftChecked))
		setLeft(not(left, leftChecked))
		setChecked(not(checked, leftChecked))
		dataToParent(right.concat(leftChecked), type)
	}

	const handleCheckedLeft = () => {
		setLeft(left.concat(rightChecked))
		setRight(not(right, rightChecked))
		setChecked(not(checked, rightChecked))
		dataToParent(not(right, rightChecked), type)
	}

	const handleAllLeft = () => {
		setLeft(left.concat(right))
		setRight([])
		dataToParent([], type)
	}
	const handelChange = (e, type) => {
		const value = e.target.value
		console.log(value)
		if (type === "left") {
			setLeftSearch(value)
		} else if (type === "right") {
			setRightSearch(value)
		}
	}

	const customList = (items) => (
		<Paper className={classes.paper}>
			<List dense component="div" role="list">
				{items.map((value, idx) => {
					const labelId = `transfer-list-item-${value}-label`

					return (
						<ListItem key={value + idx} role="listitem" button onClick={handleToggle(value)}>
							<ListItemIcon>
								<Checkbox
									checked={checked.indexOf(value) !== -1}
									tabIndex={-1}
									disableRipple
									inputProps={{"aria-labelledby": labelId}}
								/>
							</ListItemIcon>
							<ListItemText id={labelId} primary={value.split("|")[0]} />
						</ListItem>
					)
				})}
				<ListItem />
			</List>
		</Paper>
	)

	return (
		<Grid
			container
			spacing={2}
			justifyContent="center"
			alignItems="center"
			className={classes.root}
		>
			<Grid item>
				{customList([...left].filter((el) => el.toLowerCase().includes(leftSearch.toLowerCase())))}
				<TextField
					onChange={(e) => handelChange(e, "left")}
					value={leftSearch}
					label="Search"
					fullWidth
				/>
			</Grid>
			<Grid item>
				<Grid container direction="column" alignItems="center">
					<Button
						variant="outlined"
						size="small"
						className={classes.button}
						onClick={handleAllRight}
						disabled={left.length === 0}
						aria-label="move all right"
					>
						≫
					</Button>
					<Button
						variant="outlined"
						size="small"
						className={classes.button}
						onClick={handleCheckedRight}
						disabled={leftChecked.length === 0}
						aria-label="move selected right"
					>
						&gt;
					</Button>
					<Button
						variant="outlined"
						size="small"
						className={classes.button}
						onClick={handleCheckedLeft}
						disabled={rightChecked.length === 0}
						aria-label="move selected left"
					>
						&lt;
					</Button>
					<Button
						variant="outlined"
						size="small"
						className={classes.button}
						onClick={handleAllLeft}
						disabled={right.length === 0}
						aria-label="move all left"
					>
						≪
					</Button>
				</Grid>
			</Grid>
			<Grid item>
				{customList(
					[...right].filter((el) => el.toLowerCase().includes(rightSearch.toLowerCase()))
				)}
				<TextField
					onChange={(e) => handelChange(e, "right")}
					value={rightSearch}
					label="Search"
					fullWidth
				/>
			</Grid>
		</Grid>
	)
}
