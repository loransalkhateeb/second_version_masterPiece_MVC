

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');
const cr =require('crypto');
const app = express();



// Database connection configuration
const db = pgp('postgresql://postgres:loransalkhateebyazanalkhateeb123456789@localhost:5432/cleanning_service_db');

// Secret key for JWT
const secretKey = '1bc01cef7f93b65404aecad641bff243e3a80ff4a9383a1d21d346912414cffe10d6e4863a00a3b08e4fb00a5460191a33035f14106b64141509475fe57c7330';



app.use(bodyParser.json());




exports.loginuser=async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Retrieve user data from the database based on the provided email
      const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1 and password = $2', [email, password]);
  
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      // Verify the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Check user type and redirect accordingly
      if (user.id_user_type === 1) {
        // // Redirect to the admin page
        // return res.redirect('/admin');
        return res.send("This is the admin page")
      } else if (user.id_user_type === 2) {
        // Redirect to the end user page
        // return res.redirect('/end-user');
        return res.send("This is the end users page")
      } else if (user.id_user_type === 3) {
        // Redirect to the super admin page
        // return res.redirect('/super-admin');
        return res.send("This is the super admins page")
      } else {
        // Handle other user types or redirect to a default page
        // return res.redirect('/default-page');
        return res.send("This is the defualt page")
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }