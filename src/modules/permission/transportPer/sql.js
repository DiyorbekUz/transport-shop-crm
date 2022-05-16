const TRANSPORT_PER_ALL = `
    select
        *
    from
        permissions_transports
`

const ADD_PERMISSION = `
    insert into permissions_transports (
        transport_create, 
        transport_read, 
        transport_delete, 
        transport_update, 
        branch_id, 
        staff_id
    ) values (
        $3,
        $4,
        $5,
        $6,
        $2,
        $1
    ) returning *
`

const CHANGE_PERMISSION = `
update permissions_transports set
    transport_create = $3::boolean,
    transport_read = $4::boolean,
    transport_delete = $5::boolean,
    transport_update = $6::boolean
where staff_id = $1 and branch_id = $2 
    returning *
`

const DELETE_PERMISSION = `
delete from permissions_transports
where transport_permission_id = $1
returning *
`



// const RES_TRANSPORT_PER = `
// select 
//     s.staff_id,
//     s.staff_name,
//     s.staff_birth_date,
//     b.branch_name,
//     s.staff_created_at,
//     CONCAT(b.branch_name, ' ', b.branch_address) as full_adress
// from staffs as s
// inner join branches as b on s.branch_id = b.branch_id
// where b.branch_name = $4 and s.staff_name ilike concat('%', $3::varchar, '%')
// offset $1 limit $2
// `

export default {
    TRANSPORT_PER_ALL,
    ADD_PERMISSION,
    CHANGE_PERMISSION,
    DELETE_PERMISSION
}