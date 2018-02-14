const express = require('express');

const router = express.Router();

const filename = './database/database.sqlite';
const sqlite3    = require('sqlite3').verbose();
let db = new sqlite3.Database(filename);


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
    db.run(`Delete from reservations where reservation_id = ${req.params.id}`);
});


// GET A RESERVATION STARTING ON EXACT DATE
router.get('/reservations/starting-on/:startDate', function(req, res) {
  let dateSql = req.params.startDate.replace(/-/gi,'/');
  console.log(dateSql);
  let sql = `select * from reservations where check_in_date = '${dateSql}'`;
  db.all(sql, [], (err, rows ) => {
    res.status(200).json({
      reservations: rows
    });
  });
});

// get '/reservations/active-on/:date'
// TODO: add code here


// post '/reservations'
// EXPECTED JSON Object:
// {
//   customer_id: 1,
//   room_id: 1,
//   check_in_date: '2018-01-20',
//   check_out_date: '2018-01-22',
//   room_price: 129.90
// }
// TODO: add code here


// get `/detailed-invoices'
// TODO: add code here


// get `/reservations/details-between/:from_day/:to_day`
// TODO: add code here

module.exports = router;
