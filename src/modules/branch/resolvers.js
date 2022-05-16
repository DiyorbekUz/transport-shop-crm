import model from "./model.js"
import modelUser from "../staff/model.js"
import { UserInputError } from 'apollo-server-express'
import { BRANCH_CONFIG, STAFF_CONFIG } from '#config/index'
import JWT from "../../utils/jwt.js"
import sha256 from "sha256"

export default {
    Query: {
        branches: async(_, args, req) => {
            const {token} = req.headers
            const ipp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agentt = req.headers['user-agent']
            const staffs = await modelUser.getStaffs({
                page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
                limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
                search: args.search
            })

            const {ip, agent, staffId, branchId, branchName, isRoot } = JWT.verify(token)
            if(!token) {
                throw new UserInputError("User is un authorizate!")
            }

            if(!staffs.find(user => user.staff_id == staffId)){

                throw new UserInputError("User is un authorizate!")
            }
            
            
            if(!(ipp === ip) || !(agent === agentt)) {
                throw new UserInputError("Token is invalid!")
            }
            
            let res = await model.branchPer({
                staffId,
            })

            let checkk = await modelUser.getStaff({staffId})
            if (checkk?.staff_is_root) {
                let branch = await model.getBranches({
                    page: args.page ? args.page : BRANCH_CONFIG.PAGINATION.PAGE,
                    limit: args.limit ? args.limit : BRANCH_CONFIG.PAGINATION.LIMIT,
                    search: args.search
                })
                
                return branch
            }

            let newBranchs = []

            for (let i = 0; i < res.length; i++) {
                if(res[i]?.branch_read){
                    let staffs =  await model.resBranchPer({
                        page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
                        limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
                        search: args.search,
                        branchName
                    })
                    newBranchs.push(...staffs)
                }
            }
            return newStaffs.length > 0 ? newStaffs : [await model.getBranch({branchId})]
        },
        branch: async(_, args, req) => {
            const {token} = req.headers
            const ipp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agentt = req.headers['user-agent']
            const staffs = await modelUser.getStaffs({
                page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
                limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
                search: args.search
            })

            const {ip, agent, staffId, branchId, branchName, isRoot } = JWT.verify(token)
            if(!token) {
                throw new UserInputError("User is un authorizate!")
            }

            if(!staffs.find(user => user.staff_id == staffId)){

                throw new UserInputError("User is un authorizate!")
            }
            
            
            if(!(ipp === ip) || !(agent === agentt)) {
                throw new UserInputError("Token is invalid!")
            }
            
            let res = await model.branchPer({
                staffId
            })

            let checkk = await modelUser.getStaff({staffId})
            if (checkk?.staff_is_root) {
                let branch = await model.getBranch(args)
                
                return branch
            }

            if(res[0]?.branch_read){
                let branch = await model.getBranch({branchId: args.branchId})
                return branch
            }else{
                throw new UserInputError("You don't have permission!")
            }
        }
    },

    Mutation: {
        addBranch: async(_, args, req) => {
            const {token} = req.headers
            const {ip, agent, staffId, branchName, branchId, isRoot } = JWT.verify(token)

            const staffs = await modelUser.getStaffs({
                page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
                limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
                search: args.search
            })

            if(!staffs.find(user => user.staff_id == staffId)){
                throw new UserInputError("User is un authorizate!")
            }

            let { branchname, branchAdress } = args
            const branches = await model.getBranches({
                page: args.page ? args.page : BRANCH_CONFIG.PAGINATION.PAGE,
                limit: args.limit ? args.limit : BRANCH_CONFIG.PAGINATION.LIMIT,
                search: args.search
            })

            
            branchname = branchname.trim()
            branchAdress = branchAdress.trim()
            let checkk = await modelUser.getStaff({staffId})

            if (checkk.staff_is_root) {
                

                if(
                    !branchname ||
                    branchname.length > 50
                ) {
                    throw new UserInputError("The branch name cannot be empty!")
                }
    
                if(
                    !branchAdress ||
                    branchAdress.length > 50
                ) {
                    throw new UserInputError("The branch address cannot be empty!")
                }
    
                if(branches.find(branch => branch.branch_name == branchname)) {
                    throw new UserInputError("The branch name Already exists!")
                }
    
    
                let insert = await model.addBranch({
                    branchname,
                    branchAdress
                })
    
                return {
                        status: 200,
                        message: 'The Branch successfully added!',
                        token: null,
                        data: insert
                    }
            }
            let res = await model.branchPer({
                staffId,
                branchName
            })

            if(res[0]?.branch_create){
                if(
                    !branchname ||
                    branchname.length > 50
                ) {
                    throw new UserInputError("The branch name cannot be empty!")
                }
    
                if(
                    !branchAdress ||
                    branchAdress.length > 50
                ) {
                    throw new UserInputError("The branch address cannot be empty!")
                }
    
                if(branches.find(branch => branch.branch_name == branchname)) {
                    throw new UserInputError("The branch name Already exists!")
                }
    
    
                let insert = await model.addBranch({
                    branchname,
                    branchAdress
                })
    
                return {
                        status: 200,
                        message: 'The Branch successfully added!',
                        token: null,
                        data: insert
                    }
                
            }else{
                return {
                    status: 400,
                    message: 'You don\'t have permission!',
                    token: null,
                    data: null
                }
            }

            

        },

    changeBranch: async(_, args, req) => {
        const {token} = req.headers
        const {ip, agent, staffId, branchName, isRoot } = JWT.verify(token)

        const staffs = await modelUser.getStaffs({
            page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
            limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
            search: args.search
        })
        
        if(!staffs.find(user => user.staff_id == staffId)){
            throw new UserInputError("User is un authorizate!")
        }

        let {branchId, branchname, branchAdress } = args
        const branches = await model.getBranches({
            page: args.page ? args.page : BRANCH_CONFIG.PAGINATION.PAGE,
            limit: args.limit ? args.limit : BRANCH_CONFIG.PAGINATION.LIMIT,
            search: args.search
        })

        
        branchname = branchname.trim()
        branchAdress = branchAdress?.trim()
        let checkk = await modelUser.getStaff({staffId})

        if (checkk?.staff_is_root) {
            if(
                branchname?.length > 50
            ) {
                throw new UserInputError("Invalid branch name!")
            }

            if(
                branchAdress?.length > 50
            ) {
                throw new UserInputError("Invalid branch address!")
            }

            if(branches.find(branch => branch.branch_name == branchname)) {
                throw new UserInputError("The branch name Already exists!")
            }


            let insert = await model.changeBranch({
                branchId,
                branchname,
                branchAdress
            })

            return {
                    status: 200,
                    message: 'The Branch successfully changed!',
                    token: null,
                    data: insert
                }
        }
        let res = await model.branchPer({
            staffId,
            branchName
        })
        if(res[0]?.branch_update && res[0]?.branch_id == branchId){
            if(
                branchname?.length > 50
            ) {
                throw new UserInputError("The branch name max length is 50 character!")
            }

            if(
                branchAdress?.length > 50
            ) {
                throw new UserInputError("The branch address max length is 50 character!")
            }

            if(branches.find(branch => branch?.branch_name == branchname)) {
                throw new UserInputError("The branch name Already exists!")
            }


            let insert = await model.changeBranch({
                branchId,
                branchname,
                branchAdress
            })

            return {
                    status: 200,
                    message: 'The Branch successfully changed!',
                    token: null,
                    data: insert
                }
            
        }else{
            return {
                status: 400,
                message: 'You don\'t have permission!',
                token: null,
                data: null
            }
        }
    },

    deleteBranch: async(_, args, req) => {
        const {token} = req.headers
        const {ip, agent, staffId, branchName, isRoot } = JWT.verify(token)

        const staffs = await modelUser.getStaffs({
            page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
            limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
            search: args.search
        })
        
        if(!staffs.find(user => user.staff_id == staffId)){
            throw new UserInputError("User is un authorizate!")
        }

        let {branchId } = args
        const branches = await model.getBranches({
            page: args.page ? args.page : BRANCH_CONFIG.PAGINATION.PAGE,
            limit: args.limit ? args.limit : BRANCH_CONFIG.PAGINATION.LIMIT,
            search: args.search
        })

        
        let checkk = await modelUser.getStaff({staffId})

        if (checkk?.staff_is_root) {
            let del = await model.deleteBranch({
                branchId
            })

            return {
                    status: 200,
                    message: 'The Branch successfully deleted!',
                    token: null,
                    data: del
                }
        }
        let res = await model.branchPer({
            staffId,
            branchName
        })
        if(res[0]?.branch_delete && res[0]?.branch_id == branchId){
            let del = await model.deleteBranch({
                branchId
            })

            return {
                    status: 200,
                    message: 'The Branch successfully deleted!',
                    token: null,
                    data: del
                }
            
        }else{
            return {
                status: 400,
                message: 'You don\'t have permission!',
                token: null,
                data: null
            }
        }
    }
},

    Branch: {
        branchId: global => global.branch_id,
        branchname: global => global.branch_name,
        branchAdress: global => global.branch_address,
        branchCreatedAt: global => global.branch_created_at
    }
}