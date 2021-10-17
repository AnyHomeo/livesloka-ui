import React from 'react'
import {
	Typography,
	IconButton,
	Paper,
	InputBase,
	Grid,
	Box,
	Fab,
} from "@material-ui/core"
import {makeStyles} from "@material-ui/core"
import SearchIcon from "@material-ui/icons/Search"
import {Plus} from "react-feather"

function TopPart({ setSearch,setOpenAddPlanModal,setOpenAddProductModal }) {

	const classes = useStyles()

    return (
        <Grid container alignItems="center" spacing={3} >
        <Grid item xs={12} ms={12} md={6} lg={4}>
            <Typography variant="h3">Livesloka Stripe Products</Typography>
        </Grid>
        <Grid item xs={12} ms={12} md={6} lg={4}>
            <Paper className={classes.inputField}>
                <InputBase
                    onChange={(e) => setSearch(e.target.value)}
                    className={classes.input}
                    placeholder="Search Subjects"
                />
                <IconButton className={classes.iconButton} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
        </Grid>
        <Grid item xs={12} ms={12} md={6} lg={4}>
            <Box className={classes.buttons}>
                <Box className={classes.buttonTextCenter}>
                    <Fab color="primary" onClick={()=> setOpenAddProductModal(true)} >
                        <Plus color="#fff" />
                    </Fab>
                    <p>Add Product</p>
                </Box>
                <Box className={classes.buttonTextCenter}>
                    <Fab color="primary" onClick={() => setOpenAddPlanModal(true)} > 
                        <Plus color="#fff" />
                    </Fab>
                    <p>Add Plans</p>
                </Box>
            </Box>
        </Grid>
    </Grid>
    )
}

const useStyles = makeStyles(() => ({
	inputField: {
		padding: "0px 5px",
		display: "flex",
		alignItems: "center",
	},
	input: {
		flex: 1,
	},
	container: {
		marginTop: 30,
	},
	card: {
		height: 80,
		width: "100%",
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
		borderRadius: 10,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
	},
	info: {
		display: "flex",
		alignItems: "center",
		flex: 0.333,
	},
	buttons: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		gap: 10,
	},
	buttonTextCenter: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
}))

export default TopPart
