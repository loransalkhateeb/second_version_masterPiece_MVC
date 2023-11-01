
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');
const app = express();


let userloggedin=null
// Database connection configuration
const db = pgp('postgresql://postgres:loransalkhateebyazanalkhateeb123456789@localhost:5432/cleanning_service_db');

// Secret key for JWT
const secretKey = 'your_secret_key';

app.use(bodyParser.json());



exports.login_user =async(req,res)=>{
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






app.post('/addorderhouse', async (req, res) => {
  const { number_rooms, number_bathrooms, clean_type, recurring, date, time } = req.body;

  // Check if the user is authenticated
  if (!userloggedin) {
    return res.status(401).json({ message: 'User is not logged in' });
  }

  try {
    const query = `
      INSERT INTO house_order (number_rooms, number_bathrooms, clean_type, recurring, date, time, id_user)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`;

    const values = [
      number_rooms, number_bathrooms, clean_type, recurring, date, time, userloggedin,
    ];

    const result = await db.query(query, values);
    const newOrderId = result.rows[0].id;

    res.status(201).json({ message: 'The order added successfully', order_id: newOrderId });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Failed to add the order' });
  }
});






app.post('/login2', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve user data from the database based on the provided email
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Verify the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, create a JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  
app.listen(9090, () => {
  console.log('Server is running on port 9090');
});
