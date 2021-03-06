const express = require('express');

const router = express.Router();

const filename = './database/database.sqlite';
const sqlite3    = require('sqlite3').verbose();
let db = new sqlite3.Database(filename);
db.run("PRAGMA foreign_keys = ON");

// GET CUSTOMERS 
router.get('/customers', function(req, res) {
  let sql = 'select * from customers';
  db.all(sql, [], (err, rows ) => {
    res.status(200).json({
      customers: rows
    });
  });
});

//GET CUSTOMER BY ID
router.get('/customers/:id', function(req, res) {
  let typeId = req.params.id;
  if (typeId == parseInt(typeId)) {
    let sql = 'select * from customers where customer_id = ' + req.params.id;
      db.all(sql, [], (err, rows ) => {
        if (rows.length === 0) {
          res.status(400).send(`A customer with an ID '${req.params.id}' hasn't been created yet`);
        } else {
          res.status(200).json({
          customers: rows
          });
        }
      });
  } else {
    res.status(400).send(`ERROR in '${req.params.id}': customer ID cannon contain letters`);
  };
});

//GET CUSTOMERS WITH SURNAME LIKE SMTH
router.get('/customers/name/:surname', function(req, res) {
      let sql = `select * from customers where surname like '%${req.params.surname}%'`;
      db.all(sql, [], (err, rows ) => {
      res.status(200).json({
        customers: rows
      });
    });
});

//POST A NEW CUSTOMER (POSTMAN)
router.post('/customers/', function(req, res) {
  if (req.body.title && req.body.firstname && req.body.surname && req.body.email) {
    db.run(`insert into customers (title,firstname,surname,email) values ('${req.body.title}','${req.body.firstname}','${req.body.surname}', '${req.body.email}')`);
  };
});

//EDIT A CUSTOMER BY ID (POSTMAN)
router.put('/customers/:id', function(req, res) {
  console.log(req.body.title);
    if (req.body.title && req.body.firstname && req.body.surname && req.body.email) {
    db.run(`update customers set title = '${req.body.title}',
                                firstname = '${req.body.firstname}',
                                surname = '${req.body.surname}',
                                email = '${req.body.email}'
                            where customer_id = ${req.params.id}`);
  };
});

//GET ALL RESERVATIONS
router.get('/reservations/', function(req, res) {
  let sql = 'select * from reservations';
  db.all(sql, [], (err, rows ) => {
    res.status(200).json({
      reservations: rows
    });
  });
});

//GET A RESERVATION BY ID
router.get('/reservations/:id', function(req, res) {
  let typeId = req.params.id;
  if (typeId == parseInt(typeId)) {
    let sql = 'select * from reservations where reservation_id = ' + req.params.id;
    db.all(sql, [], (err, rows ) => {
        if (rows.length === 0) {
          res.status(400).send(`A reservation with an ID '${req.params.id}' hasn't been created yet`);
        } else {
          res.status(200).json({
          reservations: rows
          });
        }
      });
    } else {
    res.status(400).send(`ERROR in '${req.params.id}': reservation ID cannon contain letters`);
  };
});

//POST A NEW RESERVATION 
router.post('/reservations/', function(req, res) {
  if (req.body.customer_id && req.body.room_id && req.body.check_in_date && req.body.check_out_date && req.body.price_per_night) {
    db.run(`insert into reservations (customer_id,room_id,check_in_date,check_out_date,price_per_night) values (${req.body.customer_id}, ${req.body.room_id}, '${req.body.check_in_date}', '${req.body.check_out_date}', ${req.body.price_per_night})`);
  } else {
    console.log(err);
  };
});

// DELETE A RESERVATION BY ID
router.delete('/reservations/:id', function(req, res) {
  let sql = `Delete from reservations where reservation_id = ?`;
      db.run(sql, req.params.id, (err,rows) => {
        if (err){
          console.err(err);
          res.status(500);
        }
        else {
          res.status(202);
        }
        res.end();
      });
});


// GET A RESERVATION STARTING ON EXACT DATE
router.get('/reservations/starting-on/:startDate', function(req, res) {
  let myDate = req.params.startDate;
  let sql = `select * from reservations where check_in_date = '${myDate}'`;
  db.all(sql, [], (err, rows ) => {
    res.status(200).json({
      reservations: rows
    });
  });
});


// GET A RESERVATION ACTIVE ON EXACT DATE
router.get('/reservations/active-on/:date', (req, res) => {
  let myDate = req.params.date;
  console.log(myDate);
  let sql = `select * from reservations where '${myDate}' between check_in_date and check_out_date`;
  db.all(sql, [], (err, rows ) => {
    res.status(200).json({
      reservations: rows
    });
  });
});


// GET RESERVATIONS AND PAID INVOICES TOGETHER
router.get('/reservations-and-invoices', (req,res) => {
  let sql = 'SELECT r.reservation_id, r.customer_id, r.check_in_date, r.check_out_date, i.invoice_id, i.invoice_date_time FROM reservations AS r JOIN invoices AS i ON r.reservation_id = i.reservation_id WHERE i.paid = 1';
  db.all(sql, [], (err,rows) => {
    res.status(200).json({
      reservations: rows
    });
  })
})

//GET NUMBER OF RESERVATIONS BY CUSTOMER
router.get('/reservations-per-customer', (req,res) => {
  let sql = 'select c.firstname, c.surname, r.customer_id, count(*)as \'number of reservations\' from reservations as r JOIN customers AS c on (c.customer_id = r.customer_id) group by c.customer_id';
  db.all(sql, [], (err,rows) => {
    res.status(200).json({
      reservations: rows
    });
  })
});

//GET ROOM TYPE AND TIME IT WAS BOOKED
router.get('/room-type-booked', (req,res) => {
  let sql = 'select r.room_id, count(*) as \'number of reservations\', room_types.type_name from rooms join reservations as r on r.room_id = rooms.room_id join room_types on rooms.room_type_id = room_types.room_type_id group by r.room_id';
  db.all(sql, [], (err,rows) => {
    res.status(200).json({
      reservations: rows
    });
  })
});

//GET STATS PER ROOM: AMOUNT OF MONEY IT EARNED, AVERAGE TIME IT WAS BOOKED
router.get('/stats-price-room', (req, res) => {
  let sql = 'select room_id, count(reservation_id) as \'Times bookes\', count(reservation_id) * price_per_night as \'Total earned\' from reservations group by room_id';
  db.all(sql, [], (err, rows) => {
    res.status(200).json({
      data: rows
    });
  })
});

//GET LIST OF ROOMS AVAILABLE IN SPECIFIC PERIOD OF TIME
router.get('/rooms/available-in/:from_day/:to_day', (req, res) => {
  let dayIn = req.params.from_day;
  let dayOut = req.params.to_day;
  let sql = `select room_id 
            from rooms 
            except select room_id from reservations 
            where check_in_date > date('${dayIn}') and check_out_date < date('${dayOut}')`;
  db.all(sql, [], (err,rows) => {
    res.status(200).json({
      available: rows
    });
  })
});

//GET RESERVATIONS WITH CUSTOMER AND ROOM DETAILS FROM DATE1 TO DATE2
router.get('/reservations/details_between/:from_day/:to_day', (req, res) => {
  let dayStart = req.params.from_day;
  let dayFinish = req.params.to_day;
  let sql = `select c.customer_id, c.title, c.firstname, c.surname, r.reservation_id, r.room_id,
             r.check_in_date, r.check_out_date, r.price_per_night, room_types.type_name 
            from customers as c 
            join reservations as r on c.customer_id = r.customer_id 
            join rooms on r.room_id = rooms.room_id 
            join room_types on rooms.room_type_id = room_types.room_type_id 
            where r.check_in_date between date('${dayStart}') and date('${dayFinish}')`;
  db.all(sql, [], (err,rows) => {
    res.status(200).json({
      reservations: rows
    });
  })
});

router.get('/customers-details', (req, res) => {
  var sql = `select customers.customer_id,
     customers.title, 
     customers.firstname, 
     customers.surname, 
     customers.email, 
     reservations.room_id, 
     reservations.check_in_date, 
     reservations.check_out_date from reservations JOIN customers ON reservations.customer_id = customers.customer_id`

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).end()
      console.log(err)
    } else {
      res.status(200).json({
        rows
      })
    }
  })
})

module.exports = router;

// select c.customer_id AS ‘ID’, c.title, c.firstname, c.surname, r.reservation_id, r.check_in_date, r.check_out_date FROM customers as c JOIN reservations as r ON c.customer_id = r.customer_id; 


// Select *, julianday(check_out_date) - julianday(check_in_date) from reservations  order by check_in_date desc, julianday(check_out_date) - julianday(check_in_date) desc;
