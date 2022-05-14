const GET_BRANCHES = `
select
    branch_id,
    branch_name,
    branch_address,
    branch_created_at
from branches
where branch_name ilike concat('%', $3::varchar, '%')
order by branch_id
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

const GET_BRANCH = `
select
    branch_id,
    branch_name,
    branch_address,
    branch_created_at
from branches
where branch_id = $1
;
`

const ADD_BRANCH = `
    insert into branches (
        branch_name,
        branch_address
    ) values (
        $1::varchar,
        $2::varchar
    ) returning *
`

const CHANGE_BRANCH = `
update branches b set
    branch_name = (
        case
            when length($2) > 0 then $2
            else b.branch_name
        end
    ),
    branch_address = (
        case
            when length($3) > 0 then $3
            else b.branch_address
        end
    )
where branch_id = $1
returning *
`

const DELETE_BRANCH = `
delete from branches
where branch_id = $1
returning *
`


const BRANCH_PER = `
    select
        pb.branch_read,
        pb.branch_id,
        pb.branch_create,
        pb.branch_delete,
        pb.branch_update,
        b.branch_name,
        pb.staff_id
    from permissions_branches pb
    inner join branches b on pb.branch_id = b.branch_id
    where pb.staff_id = $1 and b.branch_name = $2::varchar;
`

const RES_BRANCH_PER = `
select 
    b.branch_id,
    b.branch_name,
    b.branch_address,
    b.branch_created_at,
from branches as b
where b.branch_name = $4 and b.branch_name ilike concat('%', $3::varchar, '%')
offset $1 limit $2
`

export default {
    GET_BRANCHES,
    GET_BRANCH,
    ADD_BRANCH,
    BRANCH_PER,
    RES_BRANCH_PER,
    CHANGE_BRANCH,
    DELETE_BRANCH
}