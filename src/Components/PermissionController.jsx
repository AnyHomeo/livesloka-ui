import React from 'react'
import { isAutheticated } from '../auth'
import NotFoundView from '../Pages/NotFoundView'

function PermissionController({ children,permission}) {
    let userPermissions = isAutheticated()?.role?.permissions || []


    console.log(userPermissions)
    return (
        <>
            {userPermissions.includes(permission) ? children : <NotFoundView />}
        </>
    )
}

export default PermissionController
