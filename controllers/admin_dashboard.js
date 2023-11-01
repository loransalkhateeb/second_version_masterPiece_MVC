

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');
const db = pgp('postgresql://postgres:loransalkhateebyazanalkhateeb123456789@localhost:5432/cleanning_service_db');

const app = express();

app.use(bodyParser.json());





app.get('/user-profiles/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const profile = await db.oneOrNone(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      if (profile) {
        res.json(profile);
      } else {
        res.status(404).json({ message: 'User profile not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve user profile' });
    }
  });



    




  
app.post('/add_user', async (req, res) => {
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







  app.put('/user-profiles-update/:id', async (req, res) => {
    const { name, email, phone, password } = req.body;
    const { id } = req.params;
  
    try {
      const updatedProfile = await db.oneOrNone(
        'UPDATE users SET name = $1, email = $2, phone = $3, password = $4 WHERE id = $5 RETURNING *',
        [name, email, phone, password, id]
      );
  
      if (updatedProfile) {
        // Encrypt the updated password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(updatedProfile.password, saltRounds);
        
        // Update the user's profile with the hashed password
        const profileWithHashedPassword = await db.oneOrNone(
          'UPDATE users SET password = $1 WHERE id = $2 RETURNING *',
          [hashedPassword, id]
        );
  
        res.json(profileWithHashedPassword);
      } else {
        res.status(404).json({ message: 'User profile not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user profile' });
    }
  });






  app.delete('/delete-user/:id_user', async (req, res) => {
    const { id_user } = req.params;
    
    try {
      // Perform the delete operation
      const result = await db.result('DELETE FROM users WHERE id = $1', [id_user]);
    
      if (result.rowCount > 0) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });



  app.get('/get_house_service/:city_name', async (req, res) => {
    const { city_name } = req.params;
    try {
      const selectCity = await db.manyOrNone(
        'SELECT * FROM house_order WHERE city_name = $1',
        [city_name]
      );
      if (selectCity.length > 0) {
        res.json(selectCity);
      } else {
        res.status(404).json({ message: 'No orders found in the specified city' });
      }
    } catch (error) {
      console.error('Error retrieving orders:', error);
      res.status(500).json({ message: 'Failed to retrieve orders' });
    }
  });
  
  




  app.get('/get_office_service/:city_name', async (req, res) => {
    const { city_name } = req.params;
    try {
      const selectCity = await db.manyOrNone(
        'SELECT * FROM office_order WHERE city_name = $1',
        [city_name]
      );
      if (selectCity.length > 0) {
        res.json(selectCity);
      } else {
        res.status(404).json({ message: 'No office orders found in the specified city' });
      }
    } catch (error) {
      console.error('Error retrieving office orders:', error);
      res.status(500).json({ message: 'Failed to retrieve office orders' });
    }
  });

  


  app.get('/get_school_service/:city_name', async (req, res) => {
    const { city_name } = req.params;
    try {
      const selectCity = await db.manyOrNone(
        'SELECT * FROM school_order WHERE city_name = $1',
        [city_name]
      );
      if (selectCity.length > 0) {
        res.json(selectCity);
      } else {
        res.status(404).json({ message: 'No school orders found in the specified city' });
      }
    } catch (error) {
      console.error('Error retrieving school orders:', error);
      res.status(500).json({ message: 'Failed to retrieve school orders' });
    }
  });
  






app.listen(9090, () => {
  console.log('Server is running on port 9090');
});
