import {Chip} from "@material-ui/core"
import React, {useCallback} from "react"
import {patchPermission} from "../Services/Services"

function Permissions({allPermissions, availablePermissions, roleId, setRoles}) {

	const addOrRemovePermission = useCallback(
		(permission) => async () => {
			try {
				if (availablePermissions.includes(permission)) {
					await patchPermission(roleId, permission)
					setRoles((prev) => {
						let prevRoles = [...prev]
						let index = prevRoles.findIndex((role) => role._id === roleId)
						let permissionIndex = availablePermissions.indexOf(permission)
						let {permissions} = prevRoles[index]
						permissions.splice(permissionIndex, 1)
						prevRoles[index] = {...prevRoles[index], permissions}
						return prevRoles
					})
				} else {
					await patchPermission(roleId, permission)
					setRoles((prev) => {
						let prevRoles = [...prev]
						let index = prevRoles.findIndex((role) => role._id === roleId)
						prevRoles[index].permissions.push(permission)
						return prevRoles
					})
					
				}
			} catch (error) {
				console.log(error)
			}
		},
		[availablePermissions, roleId, setRoles]
	)

	return (
		<div>
			{allPermissions.map((permission) => (
				<Chip
					color={availablePermissions.includes(permission) ? "primary" : "default"}
					label={permission}
					size="small"
					clickable={true}
					style={{margin: 1}}
					onClick={addOrRemovePermission(permission)}
				/>
			))}
		</div>
	)
}

export default Permissions
