PRAGMA foreign_keys=ON;

-- CUSTOMERS

create table customers (
	customer_id 		integer primary key autoincrement,
	title 				varchar,
	firstname 			varchar,
	surname 			varchar,
	email 				varchar
);

insert into customers (title,firstname,surname,email) values ('Mr', 'Donald', 'Trump', 'dontrump@google.com');
insert into customers (title,firstname,surname,email) values ('Mrs', 'Olena', 'Kashuba','olenak@gmail.com');
insert into customers (title,firstname,surname,email) values ('Mr', 'Colm', 'O''conner', 'colm.oconner.github@gmail.com');
insert into customers (title,firstname,surname,email) values ('Mr', 'Tom', 'Green', 'tomgreen@google.com');
insert into customers (title,firstname,surname,email) values ('Mrs', 'Ann', 'Swan','annswan@gmail.com');
insert into customers (title,firstname,surname,email) values ('Mr', 'John', 'Snow', 'johnsnow.github@gmail.com');
insert into customers (title,firstname,surname,email) values ('Mr', 'Jack', 'Daniels', 'jackdaniels@google.com');
insert into customers (title,firstname,surname,email) values ('Mrs', 'Kate', 'Winslet','winkate@gmail.com');
insert into customers (title,firstname,surname,email) values ('Mrs', 'Diana', 'Mcdonald', 'dianamc.github@gmail.com');
insert into customers (title,firstname,surname,email) values ('Mrs', 'Linn', 'Lee', 'linnlee.github@gmail.com');

-- ROOM TYPES

create table room_types (
	room_type_id		integer primary key autoincrement,
	type_name			text,
	original_price		number,
	current_price		number
);

insert into room_types (type_name, original_price, current_price) values ('Economy 1 guest', 50, 50);
insert into room_types (type_name, original_price, current_price) values ('Economy 2 guests', 80, 80);
insert into room_types (type_name, original_price, current_price) values ('Economy 3 guests', 100, 100);
insert into room_types (type_name, original_price, current_price) values ('Standart 1 guest', 70, 70);
insert into room_types (type_name, original_price, current_price) values ('Standart 2 guests', 100, 100);
insert into room_types (type_name, original_price, current_price) values ('Standart 3 guests', 120, 120);
insert into room_types (type_name, original_price, current_price) values ('Family 4 guests', 150, 150);
insert into room_types (type_name, original_price, current_price) values ('Family 6 guests', 180, 180);
insert into room_types (type_name, original_price, current_price) values ('Deluxe 4 guests', 400, 450);
insert into room_types (type_name, original_price, current_price) values ('President Deluxe', 850, 1000);

-- ROOMS

create table rooms (
	room_id						integer primary key autoincrement,
	room_type_id				integer,
	sea_view					boolean default false,
	foreign key(room_type_id)	references room_types(room_type_id)
);

insert into rooms (room_type_id) values (1);
insert into rooms (room_type_id) values (2);
insert into rooms (room_type_id) values (3);
insert into rooms (room_type_id) values (4);
insert into rooms (room_type_id) values (5);
insert into rooms (room_type_id, sea_view) values (6, 1);
insert into rooms (room_type_id, sea_view) values (7, 1);
insert into rooms (room_type_id, sea_view) values (8, 1);
insert into rooms (room_type_id, sea_view) values (9, 1);
insert into rooms (room_type_id, sea_view) values (10, 1);



-- RESERVATIONS 

create table reservations (
	reservation_id				integer primary key autoincrement,
	customer_id					integer not null,
    room_id      				integer not null,
    check_in_date       		datetime not null,
    check_out_date   			datetime,
    price_per_night    			number,
    foreign key(customer_id) 	references customers(customer_id),
    foreign key(room_id)		references rooms(room_id)
);

insert into reservations (customer_id, room_id, check_in_date, check_out_date, price_per_night) values (1, 10, '03/03/2018', '08/03/2018', 1000);
insert into reservations (customer_id, room_id, check_in_date, check_out_date, price_per_night) values (2, 9, '08/03/2018', '10/03/2018', 450);
insert into reservations (customer_id, room_id, check_in_date, check_out_date, price_per_night) values (3, 1, '03/03/2018', '04/03/2018', 50);
insert into reservations (customer_id, room_id, check_in_date, check_out_date, price_per_night) values (4, 3, '20/03/2018', '31/03/2018', 100);
insert into reservations (customer_id, room_id, check_in_date, check_out_date, price_per_night) values (5, 10, '11/03/2018', '15/03/2018', 1000);
insert into reservations (customer_id, room_id, check_in_date, check_out_date, price_per_night) values (6, 1, '03/04/2018', '08/04/2018', 50);
insert into reservations (customer_id, room_id, check_in_date, check_out_date, price_per_night) values (7, 2, '08/04/2018', '10/04/2018', 80);
insert into reservations (customer_id, room_id, check_in_date, check_out_date, price_per_night) values (8, 2, '03/04/2018', '04/04/2018', 80);
insert into reservations (customer_id, room_id, check_in_date, check_out_date, price_per_night) values (9, 1, '20/04/2018', '30/04/2018', 50);
insert into reservations (customer_id, room_id, check_in_date, check_out_date, price_per_night) values (10, 9, '11/04/2018', '15/04/2018', 450);

-- INVOICES 

create table invoices (
    invoice_id      			integer primary key autoincrement,
    reservation_id				integer not null,
    total               		number,
    invoice_date_time   		datetime not null,
    paid                		boolean default false,
    foreign key(reservation_id) references reservations(reservation_id)
);

insert into invoices (reservation_id, total, invoice_date_time, paid) values (1, 6000, '01/04/2018', 1);
insert into invoices (reservation_id, total, invoice_date_time) values (2, 1350, '01/04/2018');
insert into invoices (reservation_id, total, invoice_date_time) values (3, 50, '01/04/2018');
insert into invoices (reservation_id, total, invoice_date_time, paid) values (4, 1100, '01/04/2018', 1);
insert into invoices (reservation_id, total, invoice_date_time, paid) values (5, 4000, '01/04/2018', 1);
insert into invoices (reservation_id, total, invoice_date_time, paid) values (6, 250, '01/05/2018', 1);
insert into invoices (reservation_id, total, invoice_date_time) values (7, 160, '01/05/2018');
insert into invoices (reservation_id, total, invoice_date_time) values (8, 80, '01/05/2018');
insert into invoices (reservation_id, total, invoice_date_time, paid) values (9, 500, '01/05/2018', 1);
insert into invoices (reservation_id, total, invoice_date_time, paid) values (10, 1800, '01/05/2018', 1);






