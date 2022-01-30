import Table from "@material-ui/core/Table"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import {makeStyles} from "@material-ui/core/styles"
import "./financial.css"
import {Dialog, DialogContent, DialogTitle} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
	dialogPaper: {
		width: "700px",
	},
}))

function MoreinfoFinancial({open, setOpen, data}) {
	const classes = useStyles()

	// console.log(data)
	const handleClose = () => {
		setOpen(false)
	}

	data && Object.keys(data.customer).map((item) => console.log(data[item]))
	return (
		<Dialog maxWidth={800} open={open} onClose={handleClose}>
			<DialogTitle>{"Invoice Info"}</DialogTitle>

			<DialogContent>
				{data &&
					Object.keys(data.customer).map((item) => {
						return (
							<div className="row-style">
								<p style={{fontWeight: "bold", textTransform: "capitalize"}}>{item}</p>
								<p style={{textTransform: "capitalize"}}>{data.customer[item]}</p>
							</div>
						)
					})}

				{/* {data &&
					Object.keys(data.company).map((item) => {
						return (
							<div className="row-style">
								<p style={{fontWeight: "bold", textTransform: "capitalize"}}>{item}</p>
								<p style={{textTransform: "capitalize"}}>{data.company[item]}</p>
							</div>
						)
					})} */}
			</DialogContent>
		</Dialog>
	)
}

export default MoreinfoFinancial
