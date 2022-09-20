import {Button, CssBaseline, TextField, Box, Typography, Container} from "@material-ui/core/"
import MuiAlert from "@material-ui/lab/Alert"
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt"
import {makeStyles} from "@material-ui/core/styles"
import React, {useState} from "react"
import {isAutheticated} from "../../auth"
import {updatePassword} from "../../Services/Services"
import {Redirect} from "react-router-dom"
import Copyright from "../../Components/Copyright"
import useDocumentTitle from "../../Components/useDocumentTitle"
function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	Logo: {
		width: "20%",
		marginBottom: "1rem",
		[theme.breakpoints.down("sm")]: {
			marginTop: "1rem",
			marginBottom: "1rem",
			width: "40%",
		},
	},
}))

const PasswordReset = () => {
	useDocumentTitle("Password Reset")
	const [user, setUser] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
		isLoading: false,
		error: false,
		didRedirect: false,
	})

	const {currentPassword, newPassword, confirmPassword, isLoading, error, didRedirect} = user

	const onChange = (e) => setUser({...user, error: false, [e.target.name]: e.target.value})

	const onSubmit = async (e) => {
		e.preventDefault()
		setUser({...user, isLoading: true, error: false})

		try {
			const result = await updatePassword(
				currentPassword,
				newPassword,
				confirmPassword,
				isAutheticated().userId
			)
			if (result.data.error) {
				setUser({...user, isLoading: false, error: result.data.error})
			} else {
				setUser({
					...user,
					isLoading: false,
					error: false,
					didRedirect: true,
				})
			}
		} catch (error) {
			if (error.status === 400) {
				console.log(error.response)
			}
		}
	}

	const performRedirect = () => {
		if (didRedirect) {
			return <Redirect to="/admin" />
		}
	}
	const classes = useStyles()

	return (
		<>
			{performRedirect()}
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<img className={classes.Logo} src={require("../../Images/Logo.png")} alt="" />
					<Typography component="h1" variant="h5">
						Update Password
					</Typography>
					<form className={classes.form} onSubmit={onSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="currentPassword"
							value={currentPassword}
							onChange={onChange}
							label="Current Password"
							type="password"
							id="currentPassword"
							autoComplete="current-password"
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="newPassword"
							value={newPassword}
							onChange={onChange}
							label="New Password"
							type="password"
							id="newPassword"
							autoComplete="current-password"
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="confirmPassword"
							value={confirmPassword}
							onChange={onChange}
							label="Confirm Password"
							type="password"
							id="confirmPassword"
							autoComplete="current-password"
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							endIcon={<SystemUpdateAltIcon />}
						>
							{isLoading ? "Updating" : "Update Password"}
						</Button>
						<Alert
							severity="error"
							style={{
								display: error ? "" : "none",
							}}
						>
							{" "}
							{error}{" "}
						</Alert>
					</form>
				</div>
				<Box mt={8}>
					<Copyright />
				</Box>
			</Container>
		</>
	)
}

export default PasswordReset
