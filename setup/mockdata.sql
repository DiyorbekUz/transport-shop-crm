insert into branches (branch_name, branch_address) values
('Toshkent', 'Chilonzor 19 kvartal'),
('Farg''ona', 'Qo''qon shaxri'),
('Namangan', 'Pop shaxri')
;


insert into staffs (staff_name, staff_password, staff_birth_date, staff_is_root, staff_all_permission, branch_id) values
('Diyor ROOT', '00d42ecf79030ed5f742c39f4dad62758958ca4ebee19087f158b8e7afe417bc', '03.08.2004', true, true, 1),
('Jakhongir', '066222555a21281d74e6748bc3346b324cc186e0b516dac147220a56b26d1b4a', '05.08.2002', false, false, 2),
('Burkhon', '2d7131d579fe6bba15bf6ec86efedf6c5dff3adeb53cceb11286589c6288220b', '03.08.1998', false, true, 3)
;

insert into staffs (staff_name, staff_password, staff_birth_date, staff_is_root, branch_id) values
('Tohir Admin', '8113c64fcdb56e28680db5c1cfaf26b794a670f10717ac102e8ecae00c6c1f29', '03.08.2004', false, 1);


insert into transports (transport_name, transport_model, transport_color, transport_img, branch_id, staff_id) values
('Chevrolet', 'Nexia 3', 'White', 'nexia.jpg', 1, 1),
('Chevrolet', 'Gentra', 'Black', 'genrta.jpg', 1, 1),
('Chevrolet', 'Cobalt', 'Black', 'cobalt.jpg', 2, 2),
('Chevrolet', 'Spark', 'red', 'spark.jpg', 3, 3)
;

insert into permissions_transports (transport_create, transport_read, transport_delete, transport_update, branch_id, staff_id) values
(true, true, true, true, 1, 1),
(false, false, false, false, 2, 2),
(true, true, false, false, 3, 3)
;

-- update permissions_branches set branch_delete = true where staff_id = 2;

insert into permissions_branches (branch_create, branch_read, branch_delete, branch_update, branch_id, staff_id) values
(true, true, true, true, 1, 1),
(false, false, false, false, 2, 2),
(false, true, false, false, 3, 3)
;

-- update permissions_transports set transport_read = true where staff_id = 5;

insert into permissions_staffs(staff_create, staff_read, staff_update, staff_delete, branch_id, staff_id) values 
(true, true, true, true, 1, 1),
(false, false, false, false, 2, 2),
(false, true, false, false, 3, 3);