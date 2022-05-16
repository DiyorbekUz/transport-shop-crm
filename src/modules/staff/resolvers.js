import model from "./model.js"
import { UserInputError } from 'apollo-server-express'
import { STAFF_CONFIG } from '#config/index'
import JWT from "../../utils/jwt.js"
import sha256 from "sha256"

export default {
    Query: {
        staffs: async(_, args, req) => {
            const {token} = req.headers
            const ipp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agentt = req.headers['user-agent']
            if(!token) {
                throw new UserInputError("User is un authorizate!")
            }

            const {ip, agent, staffId, branchname, isRoot } = JWT.verify(token)
            if(!(ipp === ip) || !(agent === agentt)) {
                throw new UserInputError("Token is invalid!")
            }

            let res = await model.staffPer({
                staffId,
                branchname
            })
            console.log('res', res);

            let checkk = await model.getStaff({staffId})
            if (checkk?.staff_is_root) {
                let staff = await model
                .getStaffs({
                    page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
                    limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
                    search: args.search
                })
                console.log('staff', staff);
                
                return staff
            }

            if(res?.staff_read){
                return await model.resStaffPer({
                    page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
                    limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
                    search: args.search,
                    branchname
                })
            }else{
                let res = await model.getStaff({staffId})
                return [res]
            }
        },
        staff: async(_, args, req) => {
            const {token} = req.headers
            const ipp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agentt = req.headers['user-agent']
            if(!token) {
                throw new UserInputError("User is un authorizate!")
            }
            const staffs = await modelUser.getStaffs({
                page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
                limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
                search: args.search
            })
            const {ip, agent, staffId, branchname, isRoot } = JWT.verify(token)

            if(!staffs.find(user => user.staff_id == staffId)){
                throw new UserInputError("User is un authorizate!")
            }

            if(!(ipp === ip) || !(agent === agentt)) {
                throw new UserInputError("Token is invalid!")
            }

            let res = await model.staffPer({
                staffId,
                branchname
            })

            let checkk = await model.getStaff({staffId})
            if (checkk?.staff_is_root) {
                let staff = await model.getStaff(args)
                return staff
            }

            if(res?.staff_read){
                let staff = await model.getStaff(args)
                return staff
            }else{
                let res = await model.getStaff({staffId})
                return res
            }
        }
    },

    Mutation: {
        register: async(_, args, req) => {
            let { staffname, password, repeatPassword, staffWorkPlace, staffBirthDate } = args
            const staffs = await model.getStaffs({
                page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
                limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
                search: args.search
            })

            staffname = staffname.trim()
            password = password.trim()
            repeatPassword = repeatPassword.trim()
            if(
                !staffname ||
                staffname.length > 50
            ) {
                throw new UserInputError("The username cannot be empty!")
            }

            if((
                !password || password.length < 6 ||
                password.length > 50) || 
                (
                    !repeatPassword || repeatPassword.length < 6 ||
                    repeatPassword.length > 50
                ) || password !== repeatPassword
            ) {
                throw new UserInputError("Invalid password!")
            }

            if(staffs.find(user => user.staffname == staffname)) {
                throw new UserInputError("The user Already exists!")
            }

            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agent = req.headers['user-agent']

            let insert = await model.addStaff({
                staffname,
                password: sha256(password),
                staffWorkPlace,
                staffBirthDate
            })

            return {
                    status: 200,
                    message: 'The user successfully registered!',
                    token: JWT.sign({ agent, ip, staffId: insert.staff_id, branchName: insert.branch_name, isRoot: insert?.staff_is_root, branchId: insert.branch_id }),
                    data: insert
                }

        },

        login: async(_, args, req) => {
            let { staffname, password } = args
            const staffs = await model.getStaffs({ 
                page: args.page ? args.page : STAFF_CONFIG.PAGINATION.PAGE,
                limit: args.limit ? args.limit : STAFF_CONFIG.PAGINATION.LIMIT,
                search: args.search
            })
            staffname = staffname.trim()
            password = password.trim()

            let check = await model.staffLogin({
                staffname,
                password: sha256(password)
            })

            if (!check) {
                throw new UserInputError("Invalid username or password!")
            }

            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agent = req.headers['user-agent']


            return {
                status: 200,
                message: 'The user successfully logged in!',
                token: JWT.sign({ agent, ip, staffId: check.staff_id, branchName: check.branch_name, isRoot: check?.staff_is_root, branchId: check.branch_id }),
                data: check
            }
            
        }
    },

    Staff: {
        staffId: global => global.staff_id,
        staffname: global => global.staff_name,
        staffBirthDate: global => global.staff_birth_date,
        staffWorkPlace: global => global.branch_name || global.branch_id,
        fullAdress: global => global.full_adress,
        staffCreatedAt: global => global.staff_created_at,
        staffIsRoot: global => global.staff_is_root
    }
}