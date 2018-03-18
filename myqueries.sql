select c.customer_id AS ‘ID’, c.title, c.firstname, c.surname, r.reservation_id, r.check_in_date, r.check_out_date FROM customers as c JOIN reservations as r ON c.customer_id = r.customer_id; 


Select *, julianday(check_out_date) - julianday(check_in_date) from reservations  order by check_in_date desc, julianday(check_out_date) - julianday(check_in_date) desc;

Select * from reservations order by check_in_date desc limit 5;

select distinct check_in_date from reservations where check_in_date between date(2018-03-01) and date(2018-03-31);

select count(*) from reservations where customer_id = 1;

select customers.firstname, customers.surname, reservations.customer_id, count(*) as count from customers join reservations on customers.customer_id = reservations.customer_id group by reservations.customer_id having count >=2;

select customer_id, check_in_date, count(*) as count from reservations group by customer_id, check_in_date having count >= 2;

-- CALCULATE TOTAL PAID INVOICES FOR APRIL 2018
select sum(total) from invoices where invoice_date_time between date('2018-04-01') and date('2018-04-30');

-- GET THE BEST CUSTOMERS (COUNT NUMBER OF RESERVATIONS)
select c.firstname, c.surname, r.customer_id, count(*) as count from reservations as r JOIN customers AS c on (c.customer_id = r.customer_id) group by c.customer_id;

-- GET NUMBER OF RESERVATIONS FOR EACH ROOM ID
select r.room_id, count(*) as 'number of reservations', room_types.type_name 
		from rooms join reservations as r on r.room_id = rooms.room_id join room_types on rooms.room_type_id = room_types.room_type_id
		 group by r.room_id;

-- GET A LIST OF ROOMS WITH SEA VIEW RESERVED MORE THAN 2 TIMES
select rooms.room_id, count(r.room_id) as count from reservations as r join rooms on r.room_id = rooms.room_id where rooms.sea_view = 1 group by rooms.room_id having count>=2;

--GET STATS PER ROOM: AMOUNT OF MONEY IT EARNED, AVERAGE TIME IT WAS BOOKED
select room_id, count(reservation_id) as count, count(reservation_id) * price_per_night as sum from reservations group by room_id;

--GET A LIST OF ROOMS THAT WERE NEVER BOOKED
select room_id from rooms except select room_id from reservations;

--GET A LIST OF ROOMS AVAILABLE ON EXACT DAYS
select room_id from rooms except select room_id from reservations where check_in_date > date('2018-04-01') and check_out_date < date('2018-04-30');

--GET RESERVATIONS + CUSTOMER DETAILS FROM DATE1 TO DATE2
select c.customer_id, c.title, c.firstname, c.surname, r.reservation_id, r.room_id, r.check_in_date, r.check_out_date, r.price_per_night, room_types.type_name from customers as c join reservations as r on c.customer_id = r.customer_id join rooms on r.room_id = rooms.room_id join room_types on rooms.room_type_id = room_types.room_type_id where r.check_in_date between date('2018-04-01') and date('2018-04-30');




select room_id 
from rooms 
where room_id not in 
 (select room_id 
  from reservations
  where check_in_date > date('2018-04-01') and check_out_date < date('2018-04-30')
  );