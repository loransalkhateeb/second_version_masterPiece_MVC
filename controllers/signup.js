

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');
const db = pgp('postgresql://postgres:loransalkhateebyazanalkhateeb123456789@localhost:5432/cleanning_service_db');

const app = express();

app.use(bodyParser.json());


//The endpoint is registering to the end user usign by registratin form 
app.post('/register', async (req, res) => {
  const { email, password,name,phone} = req.body;

  try {
    // Check if the username is already in use
    const userExists = await db.oneOrNone('SELECT * FROM users WHERE email = $1 and password=$2', [email,password]);

    if (userExists) {
      return res.status(201).json({ message: 'email and password already in use' });
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const newUser = await db.one('INSERT INTO users(id_user_type,email,name,phone,password) VALUES($1,$2,$3,$4,$5) RETURNING id',
     ['2',email,phone,name,hashedPassword]);

    // Generate a JWT for the new user
    const token = jwt.sign({ userId: newUser.id, email }, 'your_secret_key', { expiresIn: '1h' });

    // res.status(201).json({ token });
    res.json({token})
  } catch (error) {
    res.status(500).json({ message: 'The email or password is not found' });
  }
});




  app.post('/register_admin', async (req, res) => {
      const { email, password, name, phone } = req.body;
    
      try {
        // Check if the username is already in use
        const userExists = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    
        if (userExists) {
          return res.status(201).json({ message: 'Email is already in use' });
        }
    
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        // Insert the new user into the database with id_user_type = 1 (admin)
        const newUser = await db.one('INSERT INTO users(id_user_type, email, name, phone, password) VALUES($1, $2, $3, $4, $5) RETURNING id',
          [1, email, name, phone, hashedPassword]);
    
        // Generate a JWT for the new user
        const token = jwt.sign({ userId: newUser.id, email }, 'your_secret_key', { expiresIn: '1h' });
    
        res.json({ token });
      } catch (error) {
        res.status(500).json({ message: 'An error occurred while registering the user' });
      }
    });
    




  
app.post('/register_user', async (req, res) => {
    const { email, password, name, phone } = req.body;
  
    try {
      // Check if the username is already in use
      const userExists = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
  
      if (userExists) {
        return res.status(201).json({ message: 'Email is already in use' });
      }
  
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Insert the new user into the database with id_user_type = 1 (admin)
      const newUser = await db.one('INSERT INTO users(id_user_type, email, name, phone, password) VALUES($1, $2, $3, $4, $5) RETURNING id',
        [2, email, name, phone, hashedPassword]);
  
      // Generate a JWT for the new user
      const token = jwt.sign({ userId: newUser.id, email }, 'your_secret_key', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while registering the user' });
    }
  });





app.listen(9090, () => {
  console.log('Server is running on port 9090');
});
