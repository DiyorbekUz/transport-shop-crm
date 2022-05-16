export default {

    GlobalType: {
        __resolveType: object => {
            if (object.staff_name) return 'Staff'
            if (object.branch_name) return 'Branch'
            if (object.transport_name) return 'Transport'
            if (object.transport_create || object.transport_permission_id) return 'TransportPermission'
            if (object.staff_read || object.staff_permission_id) return 'StaffPermission'
            return null
        }
    }
}