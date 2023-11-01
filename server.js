
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');
const app = express();
const port = 9090;


// Database connection configuration
const db = pgp('postgresql://postgres:loransalkhateebyazanalkhateeb123456789@localhost:5432/cleanning_service_db');

// Secret key for JWT
const secretKey = 'your_secret_key';

const userController=require("./controllers/userController")
const getcustomers=require("./controllers/customers")
app.use(bodyParser.json());


app.post('/login',userController.loginuser)
app.get('/customers',getcustomers.get_customers)




