import model from "./model.js"
import modelUser from "../../staff/model.js"
import { UserInputError } from 'apollo-server-express'
import { TRANSPORT_CONFIG, STAFF_CONFIG } from '#config/index'
import JWT from "../../../utils/jwt.js"
export default {
    Mutation: {
        addPermissionTransport: async(_, args, req) => {
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

            let {perStaffId, branchId, transportCreate, transportRead, transportDelete, transportUpdate } = args
            
            let checkk = await modelUser.getStaff({staffId})

            if (checkk?.staff_is_root) {
                
                if(!transportCreate.toString() &&
                    !transportRead.toString() &&
                    !transportDelete.toString() &&
                    !transportUpdate.toString()){
                throw new UserInputError("Invalid permission!")
            }

                let allTransportPer = await model.allTransportPer()
                let check = allTransportPer.find(per => per.staff_id == perStaffId && per.branch_id == branchId)

                if(check){
                    throw new UserInputError("Permission already exist!")
                }

                let insert = await model.addTransportPermission({
                    perStaffId,
                    branchId,
                    transportCreate: transportCreate?.toString()?.length > 0 ? transportCreate : check.transport_create,
                    transportRead: transportRead?.toString()?.length > 0 ? transportRead : check.transport_read,
                    transportDelete: transportDelete?.toString()?.length > 0 ? transportDelete : check.transport_delete,
                    transportUpdate: transportUpdate?.toString()?.length > 0 ? transportUpdate : check.transport_update
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

    changeTransportPermission: async(_, args, req) => {
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

        let {perStaffId, branchId, transportCreate, transportRead, transportDelete, transportUpdate} = args

        let checkk = await modelUser.getStaff({staffId})
        

        if (checkk?.staff_is_root) {
            if(!transportCreate.toString() &&
                !transportRead.toString() &&
                !transportDelete.toString() &&
                !transportUpdate.toString()){
                throw new UserInputError("Invalid permission!")
            } 

            let allTransportPer = await model.allTransportPer()
                let check = allTransportPer.find(per => per.staff_id == perStaffId && per.branch_id == branchId)
                if(!check){
                    throw new UserInputError("Permission not found!")
                }
                
            let change = await model.changeTransportPermission({
                perStaffId,
                branchId,
                transportCreate: transportCreate?.toString()?.length > 0 ? transportCreate : check.transport_create,
                transportRead: transportRead?.toString()?.length > 0 ? transportRead : check.transport_read,
                transportDelete: transportDelete?.toString()?.length > 0 ? transportDelete : check.transport_delete,
                transportUpdate: transportUpdate?.toString()?.length > 0 ? transportUpdate : check.transport_update
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

    deleteTransportPermission: async(_, args, req) => {
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

        let {transportPermissionId } = args
        let checkk = await modelUser.getStaff({staffId})

        if (checkk?.staff_is_root) {

            let allTransportPer = await model.allTransportPer()
            let check = allTransportPer.find(per => per.transport_permission_id == transportPermissionId)
            if(!check){
                throw new UserInputError("Permission not found!")
            }

            let del = await model.deleteTransportPermission({
                transportPermissionId
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

TransportPermission: {
        transportPermissionId: global => global.transport_permission_id,
        staffId: global => global.staff_id,
        branchId: global => global.branch_id,
        transportCreate: global => global.transport_create,
        transportRead: global => global.transport_read,
        transportDelete: global => global.transport_delete,
        transportUpdate: global => global.transport_update,
        staffId: global => global.staff_id,
    }
}