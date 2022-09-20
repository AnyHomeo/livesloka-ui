import React, {useState, useEffect, useMemo} from "react"
import TopPart from "./TopPart"
import {Container} from "@material-ui/core"
import {makeStyles} from "@material-ui/core"
import {getAllSubscriptionProducts} from "../../Services/Services"
import AddProduct from "./AddOrEditProduct"
import AddPlans from "./AddOrUpdatePlans"
import Product from "./Product"

function ProductsAndPlans() {
	const [search, setSearch] = useState("")
	const classes = useStyles()
	const [productsRefresh, setProductsRefresh] = useState(false)
	const [plansRefresh, setPlansRefresh] = useState(false)
	const [products, setProducts] = useState([])
	const [openAddProductModal, setOpenAddProductModal] = useState(false)
	const [openAddPlanModal, setOpenAddPlanModal] = useState(false)
	const [editingId, setEditingId] = useState()

	useEffect(() => {
		;(async () => {
			getAllSubscriptionProducts().then((data) => {
				setProducts(data.data.result)
			})
		})()
	}, [productsRefresh])

	const subjectIds = useMemo(
		() =>
			products.reduce((accumulator, product) => {
				if (!accumulator.includes(product.subject)) {
					accumulator.push(product.subject)
				}
				return accumulator
			}, []),
		[products]
	)

	const filteredProducts = useMemo(
		() =>
			search
				? products.filter(
						(product) => product.name && product.name.toLowerCase().includes(search.toLowerCase())
				  )
				: products,
		[search, products]
	)

	return (
		<Container className={classes.container}>
			<TopPart
				setSearch={setSearch}
				setOpenAddPlanModal={setOpenAddPlanModal}
				setOpenAddProductModal={setOpenAddProductModal}
			/>
			<AddProduct
				setRefresh={setProductsRefresh}
				setOpenAddProductModal={setOpenAddProductModal}
				openAddProductModal={openAddProductModal}
				subjectIds={subjectIds}
			/>
			<AddPlans
				setRefresh={setPlansRefresh}
				setOpenAddPlanModal={setOpenAddPlanModal}
				openAddPlanModal={openAddPlanModal}
				products={products}
				editingId={editingId}
				setEditingId={setEditingId}
			/>
			{filteredProducts.map((product) => (
				<Product
					key={product._id}
					setOpenAddPlanModal={setOpenAddPlanModal}
					editingId={editingId}
					setEditingId={setEditingId}
					product={product}
					setProductsRefresh={setProductsRefresh}
					plansRefresh={plansRefresh}
				/>
			))}
		</Container>
	)
}

const useStyles = makeStyles((theme) => ({
	container: {
		marginTop: 30,
	},
}))

export default ProductsAndPlans
