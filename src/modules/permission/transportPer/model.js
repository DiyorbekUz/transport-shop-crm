import db from "#pg"
import query from "./sql.js"

async function transportPer({ staffId, branchId }) {
    const data = await db(query.TRANSPORT_PER,  staffId, branchId)
    return data
}


async function allTransportPer() {
    const data = await db(query.TRANSPORT_PER_ALL)
    return data
}


async function addTransportPermission({ perStaffId, branchId, transportCreate, transportRead, transportDelete, transportUpdate}) {
    const [data] = await db(query.ADD_PERMISSION, perStaffId, branchId, transportCreate, transportRead, transportDelete, transportUpdate)
    return data
}



async function changeTransportPermission({ perStaffId, branchId, transportCreate, transportRead, transportDelete, transportUpdate}) {
    // console.log(perStaffId, branchId, transportCreate, transportRead, transportDelete, transportUpdate);
    const [data] = await db(query.CHANGE_PERMISSION, perStaffId, branchId, transportCreate, transportRead, transportDelete, transportUpdate)
    return data
}

async function deleteTransportPermission({transportPermissionId}){
    const [data] = await db(query.DELETE_PERMISSION, transportPermissionId)
    return data
}


export default {
    allTransportPer,
    transportPer,
    addTransportPermission,
    changeTransportPermission,
    deleteTransportPermission
}