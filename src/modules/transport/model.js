import db from "#pg"
import query from "./sql.js"

async function transportPer({ staffId, branchId }) {
    const data = await db(query.TRANSPORT_PER,  staffId, branchId)
    return data
}

// async function resTransportPer({ page, limit, search, branchId }) {
//     const data = await db(query.RES_BRANCH_PER, page, limit, search, branchId)
//     return data
// }

async function getTransports({ page, limit, search }) {
    return await db(
        query.GET_TRANSPORTS,
        (page - 1) * limit,
        limit,
        search
    )
}

async function getTransport({ transportId, branchId }) {
    const data = await db(query.GET_TRANSPORT, transportId, branchId)
    return data
}

async function addTransport({ transportname, transportModel, transportColor, filename, branchId, staffId}) {
    const [data] = await db(query.ADD_TRANSPORT, transportname, transportModel, transportColor, filename, branchId, staffId)
    return data
}

async function changeTransport({ transportId, transportname, transportModel, transportColor }) {
    const [data] = await db(query.CHANGE_TRANSPORT, transportId, transportname, transportModel, transportColor)
    return data
}

async function deleteTransport({ transportId, branchId }) {
    const [data] = await db(query.DELETE_TRANSPORT, transportId, branchId)
    console.log(data);
    return data
}

export default {
    transportPer,
    // resTransportPer,
    getTransports,
    getTransport,
    addTransport,
    changeTransport,
    deleteTransport
}