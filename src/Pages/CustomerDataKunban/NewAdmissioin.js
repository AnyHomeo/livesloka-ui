import {Button, makeStyles} from "@material-ui/core"
import React, {useState} from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import {AddCustomer} from "../../Services/Services"
const useStyles = makeStyles({
	input: {
		height: 30,
		width: "70%",
		outlineColor: "#45aaf2",
		borderRadius: 5,
		border: "1px solid #CACACA",
		padding: 5,
		flex: 0.7,
	},
})

const NewAdmissioin = () => {
	const classes = useStyles()
	const [firstName, setFirstName] = useState("")
	const [whatsAppnumber, setWhatsAppnumber] = useState("")
	const onSubmit = async () => {
		let formData = {
			firstName,
			whatsAppnumber,
			subject: "Sloka",
		}
		try {
			let data = await AddCustomer(formData)
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<div style={{width: 400, padding: 20}}>
			<p style={{fontSize: 18, fontWeight: 600}}>Create Admission</p>
			<hr style={{marginTop: 20, height: 1}} />

			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					alignItems: "center",
					marginTop: 20,
				}}
			>
				<p style={{flex: 0.3, fontWeight: 600}}>Name</p>
				<input
					className={classes.input}
					type="text"
					onChange={(e) => setFirstName(e.target.value)}
				/>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					alignItems: "center",
					marginTop: 20,
				}}
			>
				<p style={{flex: 0.3, fontWeight: 600}}>Number</p>
				{/* <input className={classes.input} type="text" /> */}
				<PhoneInput
					style={{flex: 0.7}}
					onlyCountries={["us", "gb", "sg", "au", "in"]}
					country={"us"}
					onChange={(e) => setWhatsAppnumber(e)}
				/>
			</div>

			<div style={{marginTop: 20, display: "flex", justifyContent: "flex-end"}}>
				<Button
					variant="outlined"
					style={{
						backgroundColor: "#f1f2f6",
						color: "black",
						borderRadius: 50,
						marginRight: 30,
						boxShadow:
							"rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
					}}
				>
					Cancel
				</Button>
				<Button
					variant="outlined"
					style={{
						backgroundColor: "#3867d6",
						color: "white",
						borderRadius: 50,
						boxShadow:
							"rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
					}}
					onClick={onSubmit}
				>
					Submit
				</Button>
			</div>
		</div>
	)
}

export default NewAdmissioin
