import MaterialTable from "material-table"
import * as React from "react"
import paypal from "../../Images/paypal.png"
import Stripe from "../../Images/Stripe.png"
const SubscriptionTransactions = () => {
	const columnData = [
		{title: "Student Name", field: "name"},
		{title: "Parent Name", field: "name"},
		{title: "Email", field: "name"},
		{title: "Amount", field: "amount", type: "numeric"},
		{
			title: "Plan Name",
			field: "planName",
		},
		{
			title: "Subscription Date",
			field: "createdAt",
		},
		{
			title: "Payment Type",
			field: "paymentType",
			render: (row) =>
				row.paymentType === "PAYPAL" ? (
					<img src={paypal} alt="" style={{height: "20px"}} />
				) : (
					<img src={Stripe} alt="" style={{height: "40px"}} />
				),
		},
	]

	const allData = [
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Testing",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: "PAYPAL",
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: "PAYPAL",
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: "Stripe",
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: "Stripe",
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: "Stripe",
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: "Stripe",
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: "Stripe",
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: "Stripe",
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: "Stripe",
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: "Stripe",
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: 63,
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: 63,
		},
		{
			subscriptionId: "60ac8211e751a919d00ea02e",
			name: "Baran",
			amount: 1987,
			planName: 63,
			createdAt: 63,
			paymentType: 63,
		},
	]
	return (
		<MaterialTable
			title="Payments"
			columns={columnData}
			data={allData}
			// isLoading={loading}
			style={{
				margin: "20px",
				padding: "20px",
			}}
			options={{
				search: true,
				pageSizeOptions: [5, 20, 30, 40, 50, allData.length],
				// maxBodyHeight: height - 270,
				exportButton: true,
				paginationType: "stepped",
				searchFieldVariant: "outlined",
			}}
		/>
	)
}
export default SubscriptionTransactions
