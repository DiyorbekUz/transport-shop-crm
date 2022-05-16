import db from "#pg"
import query from "./sql.js"

// async function transportPer({ staffId, branchId }) {
//     const data = await db(query.TRANSPORT_PER,  staffId, branchId)
//     return data
// }


async function allStaffPer() {
    const data = await db(query.STAFF_PER_ALL)
    return data
}


async function addStaffPermission({ perStaffId, branchId, staffRead, staffDelete, staffUpdate}) {
    const [data] = await db(query.ADD_PERMISSION, perStaffId, branchId, staffRead, staffDelete, staffUpdate)
    return data
}



async function changeStaffPermission({ perStaffId, branchId, staffRead, staffDelete, staffUpdate}) {
    // console.log(perStaffId, branchId, staffCreate, staffRead, staffDelete, staffUpdate);
    const [data] = await db(query.CHANGE_PERMISSION, perStaffId, branchId, staffRead, staffDelete, staffUpdate)
    return data
}

async function deleteStaffPermission({staffPermissionId}){
    const [data] = await db(query.DELETE_PERMISSION, staffPermissionId)
    return data
}


export default {
    allStaffPer,
    // transportPer,
    addStaffPermission,
    changeStaffPermission,
    deleteStaffPermission
}