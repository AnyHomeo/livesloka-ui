import MaterialTable from "material-table"
import React, {useState} from "react"
import AddBoxIcon from "@material-ui/icons/AddBox"
import AddRole from "./AddRole"
import UpdateRole from "./UpdateRole"
const RoleManagement = () => {
	const columnData = [
		{title: "Role ID", field: "roleId"},
		{title: "Role ID", field: "roleId"},
		{title: "Role Name", field: "roleName"},
		{title: "Links", field: "links"},
	]

	const [data, setData] = useState([
		{roleId: "1", roleName: "Admin", links: 1987},
		{roleId: "2", roleName: "Accountant", links: 1987},
		{roleId: "3", roleName: "Marketing", links: 1987},
	])

	const [openAddModal, setOpenAddModal] = useState(false)
	const [openUpdateModal, setOpenUpdateModal] = useState(false)
	return (
		<div>
			<AddRole open={openAddModal} setOpen={setOpenAddModal} />
			<UpdateRole open={openUpdateModal} setOpen={setOpenUpdateModal} />

			<MaterialTable
				title="Manage Roles"
				columns={columnData}
				data={data}
				options={{
					search: true,
				}}
				actions={[
					{
						icon: () => <AddBoxIcon />,
						tooltip: "Add Role",
						isFreeAction: true,
						onClick: (event) => setOpenAddModal(!openAddModal),
					},
					{
						icon: "edit",
						tooltip: "Edit User",
						onClick: (event, rowData) => {
							setOpenUpdateModal(!openUpdateModal)
						},
					},
				]}
			/>
		</div>
	)
}

export default RoleManagement
