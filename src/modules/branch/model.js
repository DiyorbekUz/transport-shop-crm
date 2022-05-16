import db from "#pg"
import query from "./sql.js"

async function branchPer({ staffId }) {
    const branch = await db(query.BRANCH_PER,  staffId)
    return branch
}

async function resBranchPer({ page, limit, search, branchName }) {
    const branch = await db(query.RES_BRANCH_PER, page, limit, search, branchName)
    return branch
}

async function getBranches({ page, limit, search }) {
    return await db(
        query.GET_BRANCHES,
        (page - 1) * limit,
        limit,
        search
    )
}

async function getBranch({ branchId }) {
    const branch = await db(query.GET_BRANCH, branchId)
    return branch[0]
}

async function addBranch({ branchname, branchAdress}) {
    const [branch] = await db(query.ADD_BRANCH, branchname, branchAdress)
    return branch
}

async function changeBranch({ branchId, branchname, branchAdress }) {
    const branch = await db(query.CHANGE_BRANCH, branchId, branchname, branchAdress)
    return branch[0]
}

async function deleteBranch({ branchId }) {
    const [branch] = await db(query.DELETE_BRANCH, branchId)
    return branch
}

export default {
    branchPer,
    resBranchPer,
    getBranches,
    getBranch,
    addBranch,
    changeBranch,
    deleteBranch
}