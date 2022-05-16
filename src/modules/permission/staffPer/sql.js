const STAFF_PER_ALL = `
    select
        *
    from
        permissions_staffs
`

const ADD_PERMISSION = `
    insert into permissions_staffs (
        staff_read, 
        staff_delete, 
        staff_update, 
        branch_id, 
        staff_id
    ) values (
        $3,
        $4,
        $5,
        $2,
        $1
    ) returning *
`

const CHANGE_PERMISSION = `
update permissions_staffs set
    staff_read = $3::boolean,
    staff_delete = $4::boolean,
    staff_update = $5::boolean
where staff_id = $1 and branch_id = $2 
    returning *
`

const DELETE_PERMISSION = `
delete from permissions_staffs
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
    STAFF_PER_ALL,
    ADD_PERMISSION,
    CHANGE_PERMISSION,
    DELETE_PERMISSION
}