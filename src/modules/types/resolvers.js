export default {

    GlobalType: {
        __resolveType: object => {
            if (object.staff_name) return 'Staff'
            if (object.branch_name) return 'Branch'
            if (object.transport_name) return 'Transport'
            return null
        }
    }
}