import db from "#pg"
import query from "./sql.js"

async function staffPer({ staffId, branchname }) {
    const staff = await db(query.STAFF_PER,  staffId, branchname)
    return staff
}

async function resStaffPer({ page, limit, search, branchname }) {
    const staff = await db(query.RES_STAFF_PER, page, limit, search, branchname)
    return staff
}

async function getStaffs({ page, limit, search }) {
    let res = await db(
        query.GET_STAFFS,
        (page - 1) * limit,
        limit,
        search
    )
    return res
}

async function getStaff({ staffId }) {
    const [staff] = await db(query.GET_STAFF, staffId)
    return staff
}

async function addStaff({staffname, password, staffBirthDate, staffWorkPlace }) {
    const [staff] = await db(query.ADD_STAFF, staffname, password, staffBirthDate, staffWorkPlace)
    if (typeof staff == 'object' && Object.getOwnPropertyNames(staff).length) {
        const res = await db(query.ADD_PER_STAFF, staff.branch_id, staff.staff_id)
        const res1 = await db(query.ADD_PER_BRANCH, staff.branch_id, staff.staff_id)
        const res2 = await db(query.ADD_PER_TRANS, staff.branch_id, staff.staff_id)
    }
    return staff
}

async function staffLogin({ staffname, password }) {
    const [staff] = await db(query.STAFF_LOGIN, staffname, password)
    return staff
}

export default {
    getStaffs,
    getStaff,
    addStaff,
    staffLogin,
    staffPer,
    resStaffPer
}