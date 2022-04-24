import {Dialog, Button} from "@material-ui/core"
import React from "react"
import {DateRangePicker} from "react-date-range"

const DateRangeDialog = ({open, setOpen, setFilteredDate, filteredDate, fetchData}) => {
	return (
		<div>
			<Dialog fullWidth={true} maxWidth={"md"} onClose={() => setOpen(false)} open={open}>
				<div
					style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20}}
				>
					<DateRangePicker
						onChange={(item) => setFilteredDate([item.selection])}
						showSelectionPreview={true}
						moveRangeOnFirstSelection={false}
						months={2}
						ranges={filteredDate}
						direction="horizontal"
					/>

					<Button
						style={{
							backgroundColor: "#3867d6",
							marginTop: 10,
							color: "white",
							width: 100,
							marginBottom: 20,
						}}
						onClick={() => {
							fetchData()
							setOpen(false)
							localStorage.setItem("filteredDate", JSON.stringify(filteredDate))
						}}
					>
						Apply
					</Button>
				</div>
			</Dialog>
		</div>
	)
}

export default DateRangeDialog
