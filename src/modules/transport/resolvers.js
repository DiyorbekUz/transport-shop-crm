import model from "./model.js"
import modelUser from "../staff/model.js"
import { UserInputError } from 'apollo-server-express'
import { TRANSPORT_CONFIG, STAFF_CONFIG } from '#config/index'
import JWT from "../../utils/jwt.js"
import fs from 'fs'
import path from 'path'
import { finished } from 'stream/promises'
import {
    GraphQLUpload,
    graphqlUploadExpress, 
  } from 'graphql-upload'

export default {
    Upload: GraphQLUpload,
    Query: {
        transports: async(_, args, req) => {
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
            
            let res = await model.transportPer({
                staffId,
                branchId
            })

            let checkk = await modelUser.getStaff({staffId})
            if (checkk?.staff_is_root) {
                let transport = await model.getTransports({
                    page: args.page ? args.page : TRANSPORT_CONFIG.PAGINATION.PAGE,
                    limit: args.limit ? args.limit : TRANSPORT_CONFIG.PAGINATION.LIMIT,
                    search: args.search
                })
                
                return transport[0]
            }

            if(res[0]?.transport_read){
                let transport = await model.getTransports({
                    page: args.page ? args.page : TRANSPORT_CONFIG.PAGINATION.PAGE,
                    limit: args.limit ? args.limit : TRANSPORT_CONFIG.PAGINATION.LIMIT,
                    search: args.search
                })
                
                return transport[0]
            }else{
                throw new Error("You don't have permission")
            }
        },
        transport: async(_, args, req) => {
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
            
            let res = await model.transportPer({
                staffId,
                branchId
            })

            let checkk = await modelUser.getStaff({staffId})
            if (checkk?.staff_is_root) {
                let transport = await model.getTransport({transportId: args.transportId})
                return transport[0]
            }

            if(res[0]?.transport_read){
                let transport = await model.getTransport({transportId: args.transportId, branchId})
                if(transport[0]?.transport_id){
                    return transport[0]
                }else{
                    throw new Error("You don't have permission")
                }
            }else{
                throw new Error("You don't have permission")
            }
        }
    },

    Mutation: {
        addTransport: async(_, args, req) => {
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

            let { branchId, transportname, transportModel, transportColor, transportImg } = args
            const transports = await model.getTransports({
                page: args.page ? args.page : TRANSPORT_CONFIG.PAGINATION.PAGE,
                limit: args.limit ? args.limit : TRANSPORT_CONFIG.PAGINATION.LIMIT,
                search: args.search
            })

            
            transportname = transportname.trim()
            transportModel = transportModel.trim()
            transportColor = transportColor.trim()
            let checkk = await modelUser.getStaff({staffId})

            if (checkk?.staff_is_root) {
                

                if(
                    !transportname ||
                    transportname.length > 50
                ) {
                    throw new UserInputError("The Transport name cannot be empty!")
                }
    
                if(
                    !transportModel ||
                    transportModel.length > 50
                ) {
                    throw new UserInputError("The Transport model cannot be empty!")
                }

                if(
                    !transportColor ||
                    transportColor.length > 50 
                    
                ) {
                    throw new UserInputError("The Transport color cannot be empty!")
                }    

                let { createReadStream, filename, mimetype, encoding } = await args.transportImg;
                const stream = createReadStream();

                if(!args.transportImg) {
                    throw new UserInputError("File is required!")
                }
        
                if(!['image/png', 'image/jpg', 'image/jpeg'].includes(mimetype)) {
                    throw new UserInputError("Invalid file mimetype!")
                }
        
                filename = Date.now() + filename.replace(/\s/g, "")


                const out = fs.createWriteStream(path.join(process.cwd(), 'uploads',filename));
                stream.pipe(out);
                await finished(out);
                let insert = await model.addTransport({
                    branchId,
                    transportname,
                    transportModel,
                    transportColor,
                    filename,
                    staffId
                })
    
                return {
                        status: 200,
                        message: 'The Transport successfully added!',
                        token: null,
                        data: insert
                    }
            }
            let res = await model.transportPer({
                staffId,
                branchId
            })


            if(res[0]?.transport_create && res[0]?.branch_id == branchId){
                if(
                    !transportname ||
                    transportname.length > 50
                ) {
                    throw new UserInputError("The Transport name cannot be empty!")
                }
    
                if(
                    !transportModel ||
                    transportModel.length > 50
                ) {
                    throw new UserInputError("The Transport model cannot be empty!")
                }

                if(
                    !transportColor ||
                    transportColor.length > 50 
                    
                ) {
                    throw new UserInputError("The Transport color cannot be empty!")
                }    

                let { createReadStream, filename, mimetype, encoding } = await args.transportImg;
                const stream = createReadStream();

                if(!args.transportImg) {
                    throw new UserInputError("File is required!")
                }
        
                if(!['image/png', 'image/jpg', 'image/jpeg'].includes(mimetype)) {
                    throw new UserInputError("Invalid file mimetype!")
                }
        
                filename = Date.now() + filename.replace(/\s/g, "")

                const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', filename));
                stream.pipe(out);
                await finished(out);
    
                let insert = await model.addTransport({
                    branchId,
                    transportname,
                    transportModel,
                    transportColor,
                    filename,
                    staffId
                })
    
                return {
                        status: 200,
                        message: 'The Transport successfully added!',
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

    changeTransport: async(_, args, req) => {
        const {token} = req.headers
        const {ip, agent, branchId, staffId, branchName, isRoot } = JWT.verify(token)

        const staffs = await modelUser.getStaffs({
            page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
            limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
            search: args.search
        })
        
        if(!staffs.find(user => user.staff_id == staffId)){
            throw new UserInputError("User is un authorizate!")
        }

        let {transportId, transportname, transportModel, transportColor } = args
        const transports = await model.getTransports({
            page: args.page ? args.page : TRANSPORT_CONFIG.PAGINATION.PAGE,
            limit: args.limit ? args.limit : TRANSPORT_CONFIG.PAGINATION.LIMIT,
            search: args.search
        })

        
        transportname = transportname?.trim()
        transportModel = transportModel?.trim()
        transportColor = transportColor?.trim()
        let checkk = await modelUser.getStaff({staffId})
        

        if (checkk?.staff_is_root) {
            if (!transportname && !transportModel && !transportColor) {
                throw new UserInputError("The Transport name, model, color cannot be empty!")
            }
                
            if(
                transportname?.length > 50
            ) {
                throw new UserInputError("Invalid Transport name!")
            }

            if(
                transportColor?.length > 50 
                
            ) {
                throw new UserInputError("Invalid color")
            }    

            let change = await model.changeTransport({
                transportId,
                transportname,
                transportModel,
                transportColor
            })

            return {
                    status: 200,
                    message: 'The Transport successfully changed!',
                    token: null,
                    data: change
                }
        }
        let res = await model.transportPer({
            staffId,
            branchId
        })
        if(res[0]?.branch_update && res[0]?.branch_id == branchId){
            if(
                !transportname ||
                transportname.length > 50
            ) {
                throw new UserInputError("The Transport name cannot be empty!")
            }

            if(
                !transportColor ||
                transportColor.length > 50 
                
            ) {
                throw new UserInputError("The Transport color cannot be empty!")
            }    

            if(transports.find(transport => transport?.transport_name == transportname)) {
                throw new UserInputError("The branch name Already exists!")
            }


            let change = await model.changeTransport({
                transportId,
                transportname,
                transportModel,
                transportColor
            })

            return {
                    status: 200,
                    message: 'The Transport successfully changed!',
                    token: null,
                    data: change
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

    deleteTransport: async(_, args, req) => {
        const {token} = req.headers
        const {ip, agent, staffId, branchId, branchName, isRoot } = JWT.verify(token)

        const staffs = await modelUser.getStaffs({
            page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
            limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
            search: args.search
        })
        
        if(!staffs.find(user => user.staff_id == staffId)){
            throw new UserInputError("User is un authorizate!")
        }

        let {transportId } = args
        let checkk = await modelUser.getStaff({staffId})

        if (checkk?.staff_is_root) {
            let del = await model.deleteTransport({
                transportId
            })

            return {
                    status: 200,
                    message: 'The Transport successfully deleted!',
                    token: null,
                    data: del
                }
        }
        let res = await model.transportPer({
            staffId,
            branchId
        })
        console.log(res[0]?.branch_id, branchId);
        if(res[0]?.transport_delete && res[0]?.branch_id == branchId){
            let del = await model.deleteTransport({
                transportId,
                branchId
            })

            if (del) {
                return {
                    status: 200,
                    message: 'The Transport successfully deleted!',
                    token: null,
                    data: del
                }
            }else{
                throw new UserInputError("The Transport does not exist! or You don't have permission!")
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

    Transport: {
        transportId: global => global.transport_id,
        transportname: global => global.transport_name,
        transportAdress: global => global.branch_name || global.branch_id,
        transportModel: global => global.transport_model,
        transportColor: global => global.transport_color,
        transportImg: global => 'https://transport-shop-crm.herokuapp.com/'+ global.transport_img,
        transportCreatedAt: global => global.transport_created_at,
        staffId: global => global.staff_id,
    }
}