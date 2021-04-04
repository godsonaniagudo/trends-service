const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8086;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Create database connection object
const connection = mysql.createConnection({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

//Connect to database
connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected");
  }
});

//Declare endpoint for retrieving user trends
app.get("/trends/:userID", (req, res) => {
  //Query databse for user trends
  connection.query(
    `SELECT category, icon_url FROM transactions WHERE user_id=${req.params.userID} && date_time BETWEEN '2020-04-01 12:00:00' AND '2021-04-01 23:30:00' GROUP BY icon_url, category HAVING COUNT(*) >= 7`,
    (err, rows, fields) => {
      if (err) {
        //Return error if query fails
        res.status(400).send({ response: "Failed", error: err });
      } else {
        //Return data if query is successful
        res.send({ status: 200, data: rows });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("Server started on port 8086");
});
