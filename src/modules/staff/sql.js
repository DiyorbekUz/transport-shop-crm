const GET_STAFFS = `
select
    s.staff_id,
    s.staff_name,
    s.staff_birth_date,
    s.staff_is_root,
    b.branch_name,
    s.branch_id,
    s.staff_created_at,
    CONCAT(b.branch_name, ' ', b.branch_address) as full_adress
from staffs as s
inner join branches as b on s.branch_id = b.branch_id
where s.staff_name ilike concat('%', $3::varchar, '%')
order by s.staff_id
offset $1 limit $2
;
`

// select 
//     s.staff_id,
//     s.staff_name,
//     s.staff_birth_date,
//     b.branch_name,
//     s.staff_created_at
//     from staffs as s
// inner join branches as b on s.branch_id = b.branch_id
// where s.staff_name = 'Jakhongir';

const GET_STAFF = `
    select 
        s.staff_id,
        s.staff_name,
        s.staff_birth_date,
        s.staff_is_root,
        b.branch_name,
        s.branch_id,
        s.staff_created_at
    from staffs s
    inner join branches b on s.branch_id = b.branch_id
    where s.staff_id = $1
`

const ADD_STAFF = `
    insert into staffs (
        staff_name,
        staff_password,
        staff_birth_date,
        branch_id
    ) values (
        $1,
        $2,
        $3,
        $4
    ) returning *
`

// const ADD_PER_TRANS = `
//     insert into permissions_transports(
//         branch_id, staff_id
//     ) values (
//         $1,
//         $2
//     );
// `

// const ADD_PER_BRANCH = `
// insert into permissions_branches(
//     branch_id, staff_id
// ) values (
//     $1,
//     $2
// );
// `

// const ADD_PER_STAFF = `
// insert into permissions_staffs(
//     branch_id, staff_id
// ) values (
//     $1,
//     $2
// );`

const STAFF_LOGIN = `
select
    s.staff_id,
    s.branch_id,
    s.staff_name,
    s.staff_birth_date,
    b.branch_name,
    s.staff_created_at,
    CONCAT(b.branch_name, ' ', b.branch_address) as full_adress
from staffs as s
inner join branches as b on s.branch_id = b.branch_id
where s.staff_name = $1 and s.staff_password = $2
;
`

const STAFF_PER = `
    select
        ps.staff_read,
        ps.staff_delete,
        ps.staff_update,
        ps.branch_id,
        b.branch_name,
        ps.staff_id
    from permissions_staffs ps
    inner join branches b on ps.branch_id = b.branch_id
    where ps.staff_id = $1
`

const RES_STAFF_PER = `
select 
s.staff_id,
    s.staff_name,
    s.staff_birth_date,
    b.branch_name,
    s.staff_created_at,
    CONCAT(b.branch_name, ' ', b.branch_address) as full_adress
from staffs as s
inner join branches as b on s.branch_id = b.branch_id
where s.branch_id = $4 and s.staff_name ilike concat('%', $3::varchar, '%')
offset $1 limit $2
`

const TEST_STAFF_PER = `
select
    s.staff_id,
    s.staff_name,
    s.staff_birth_date,
    s.staff_is_root,
    b.branch_name,
    s.branch_id,
    s.staff_created_at,
    CONCAT(b.branch_name, ' ', b.branch_address) as full_adress
from staffs as s
inner join branches as b on s.branch_id = b.branch_id
where s.branch_id = $4
order by s.staff_id
offset $1 limit $2
;
`
    

export default {
    GET_STAFFS,
    GET_STAFF,
    ADD_STAFF,
    TEST_STAFF_PER,
    // ADD_PER_TRANS,
    // ADD_PER_BRANCH,
    // ADD_PER_STAFF,
    STAFF_LOGIN,
    STAFF_PER,
    RES_STAFF_PER
}