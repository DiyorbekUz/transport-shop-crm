\c postgres
-- drop database if exists
drop database if exists transports;

-- create database look
create database transports;

-- connect to database look
\c transports;

--extension for password
create extension pgcrypto;


--table branches
drop table if exists branches CASCADE;
create table branches   (
    branch_id serial not null primary key,
    branch_name varchar(64) not null unique,
    branch_address varchar(64) not null,
    branch_created_at timestamptz default current_timestamp
);

drop table if exists staffs CASCADE;
create table staffs (
    staff_id serial not null primary key,
    staff_name varchar(64) not null unique,
    staff_password varchar(255) not null,
    staff_birth_date varchar(10) not null,
    staff_is_root boolean default false,
    staff_created_at timestamptz default current_timestamp,
    staff_all_permission boolean default false,
    branch_id int not null references branches(branch_id) ON DELETE  CASCADE
);


drop table if exists transports CASCADE;
create table transports (
    transport_id serial not null primary key,
    transport_name varchar(64) not null,
    transport_model varchar(32) not null,
    transport_color varchar(32) not null,
    transport_img text not null,
    transport_created_at timestamptz default current_timestamp,
    branch_id int references branches(branch_id) ON DELETE CASCADE,
    staff_id int not null references staffs(staff_id) ON DELETE CASCADE
);



drop table if exists permissions_transports CASCADE;
create table permissions_transports (
    transport_permission_id serial not null primary key,
    transport_create boolean default false,
    transport_read boolean default false,
    transport_delete boolean default false,
    transport_update boolean default false,
    branch_id int not null references branches(branch_id) ON DELETE CASCADE,
    staff_id int not null references staffs(staff_id) ON DELETE CASCADE
);

drop table if exists permissions_branches CASCADE;
create table permissions_branches (
    branch_permission_id serial not null primary key,
    branch_create boolean default false,
    branch_read boolean default false,
    branch_delete boolean default false,
    branch_update boolean default false,
    branch_id int not null references branches(branch_id) ON DELETE CASCADE,
    staff_id int references staffs(staff_id) ON DELETE CASCADE
);

drop table if exists permissions_staffs CASCADE;
create table permissions_staffs (
    staff_permission_id serial not null primary key,
    staff_create boolean default false,
    staff_read boolean default false,
    staff_delete boolean default false,
    staff_update boolean default false,
    branch_id int not null references branches(branch_id) ON DELETE CASCADE,
    staff_id int references staffs(staff_id) ON DELETE CASCADE
);




select
    s.staff_id,
    s.staff_name,
    s.staff_birth_date,
    b.branch_name,
    s.staff_created_at,
    CONCAT(b.branch_name, ' ', b.branch_address) as full_adress
from staffs as s
inner join branches as b on s.branch_id = b.branch_id
;
