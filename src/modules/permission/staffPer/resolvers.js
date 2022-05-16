import model from "./model.js"
import modelUser from "../../staff/model.js"
import { UserInputError } from 'apollo-server-express'
import { TRANSPORT_CONFIG, STAFF_CONFIG } from '#config/index'
import JWT from "../../../utils/jwt.js"
export default {
    Mutation: {
        addPermissionStaff: async(_, args, req) => {
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

            let {perStaffId, branchId, staffRead, staffDelete, staffUpdate } = args
            
            let checkk = await modelUser.getStaff({staffId})

            if (checkk?.staff_is_root) {
                
                if(
                    !staffRead.toString() &&
                    !staffDelete.toString() &&
                    !staffUpdate.toString()){
                throw new UserInputError("Invalid permission!")
            } 

                let allStaffPer = await model.allStaffPer()
                let check = allStaffPer.find(per => per.staff_id == perStaffId && per.branch_id == branchId)

                if(check){
                    throw new UserInputError("Permission already exist!")
                }

                let insert = await model.addStaffPermission({
                    perStaffId,
                    branchId,
                    staffRead: staffRead?.toString()?.length > 0 ? staffRead : check?.staff_read,
                    staffDelete: staffDelete?.toString()?.length > 0 ? staffDelete : check?.staff_delete,
                    staffUpdate: staffUpdate?.toString()?.length > 0 ? staffUpdate : check?.staff_update
                })
    
                return {
                        status: 200,
                        message: 'The Permission successfully added!',
                        data: insert
                    }
            }
            else{
                return {
                    status: 400,
                    message: 'You don\'t have permission!',
                    data: null
                }
            }
        },

    changeStaffPermission: async(_, args, req) => {
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

        let {perStaffId, branchId, staffRead, staffDelete, staffUpdate} = args

        let checkk = await modelUser.getStaff({staffId})
        

        if (checkk?.staff_is_root) {
            if(                !staffRead.toString() &&
                !staffDelete.toString() &&
                !staffUpdate.toString()){
                throw new UserInputError("Invalid permission!")
            } 

            let allStaffPer = await model.allStaffPer()
                let check = allStaffPer.find(per => per.staff_id == perStaffId && per.branch_id == branchId)
                if(!check){
                    throw new UserInputError("Permission not found!")
                }
                
            let change = await model.changeStaffPermission({
                perStaffId,
                branchId,
                staffRead: staffRead?.toString()?.length > 0 ? staffRead : check.staff_read,
                staffDelete: staffDelete?.toString()?.length > 0 ? staffDelete : check.staff_delete,
                staffUpdate: staffUpdate?.toString()?.length > 0 ? staffUpdate : check.staff_update
            })

            return {
                    status: 200,
                    message: 'The Permission successfully changed!',
                    data: change
                }         
            }else{
                return {
                    status: 400,
                    message: 'You don\'t have permission!',
                    data: null
                }
            }
    },

    deleteStaffPermission: async(_, args, req) => {
        const {token} = req.headers
        const {ip, agent, staffId, branchId, branchName, isRoot } = JWT.verify(token)

        const staffs = await modelUser.getStaffs({
            page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
            limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
            search: args.search
        })
        
        if(!staffs?.find(user => user?.staff_id == staffId)){
            throw new UserInputError("User is un authorizate!")
        }

        let {staffPermissionId } = args
        let checkk = await modelUser.getStaff({staffId})

        if (checkk?.staff_is_root) {
            let allTransportPer = await model.allStaffPer()
            let check = allTransportPer.find(per => per.staff_permission_id == staffPermissionId)
            if(!check){
                throw new UserInputError("Permission not found!")
            }

            let del = await model.deleteStaffPermission({
                staffPermissionId
            })

            return {
                    status: 200,
                    message: 'The Permission successfully deleted!',
                    data: del
                }
        }else{
            return {
                status: 400,
                message: 'You don\'t have permission!',
                data: null
            }
        }
    }
},

    StaffPermission: {
        staffPermissionId: global => global.staff_permission_id,
        branchId: global => global.branch_id,
        staffRead: global => global.staff_read,
        staffDelete: global => global.staff_delete,
        staffUpdate: global => global.staff_update,
        staffId: global => global.staff_id,
    }
}