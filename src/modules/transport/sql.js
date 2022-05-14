const GET_TRANSPORTS = `
select
    transport_id,
    transport_name,
    transport_model,
    transport_color,
    transport_img,
    transport_created_at,
    branch_id,
    staff_id
from transports
where transport_name ilike concat('%', $3::varchar, '%')
order by transport_id
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

const GET_TRANSPORT = `
select
    transport_id,
    transport_name,
    transport_model,
    transport_color,
    transport_img,
    transport_created_at,
    branch_id,
    staff_id
from transports
where transport_id = $1 and case
when $2 > 0 then branch_id = $2
else true
end
;
`

const ADD_TRANSPORT = `
    insert into transports (
        transport_name, 
        transport_model, 
        transport_color, 
        transport_img, 
        branch_id, 
        staff_id
    ) values (
        $1::varchar,
        $2::varchar,
        $3::varchar,
        $4::varchar,
        $5,
        $6
    ) returning *
`

const CHANGE_TRANSPORT = `
update transports t set
    transport_name = (
        case
            when length($2) > 0 then $2
            else t.transport_name
        end
    ),
    transport_model = (
        case
            when length($3) > 0 then $3
            else t.transport_model
        end
    ),
    transport_color = (
        case
            when length($4) > 0 then $4
            else t.transport_color
        end
    )
where transport_id = $1
returning *
`

const DELETE_TRANSPORT = `
delete from transports
where transport_id = $1 and case
when $2 > 0 then branch_id = $2
else true
end
returning *
`


const TRANSPORT_PER = `
    select
        pt.transport_read,
        --pt.transport_id,
        pt.transport_create,
        pt.transport_delete,
        pt.transport_update,
        pt.branch_id,
        b.branch_name,
        pt.staff_id
    from permissions_transports pt
    inner join branches b on pt.branch_id = b.branch_id
    where pt.staff_id = $1 and pt.branch_id = $2;
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
    GET_TRANSPORTS,
    GET_TRANSPORT,
    ADD_TRANSPORT,
    TRANSPORT_PER,
    // RES_TRANSPORT_PER,
    CHANGE_TRANSPORT,
    DELETE_TRANSPORT
}