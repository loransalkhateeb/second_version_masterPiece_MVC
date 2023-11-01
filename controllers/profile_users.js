

const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 9090;


// Database connection configuration
const db = pgp('postgresql://postgres:loransalkhateebyazanalkhateeb123456789@localhost:5432/cleanning_service_db');

// Secret key for JWT
const secretKey = 'your_secret_key';

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
  




  app.put('/update_house_service/:id', async (req, res) => {
    const { id } = req.params;
    const { number_rooms, number_bathrooms, clean_type, recurring, date, time, city_name } = req.body;
  
    try {
      // Check if the service with the provided ID exists
      const existingService = await db.oneOrNone('SELECT * FROM house_order WHERE id = $1', [id]);
  
      if (existingService) {
        // Update the service record in the house_order table
        const query = `
          UPDATE house_order
          SET number_rooms = $1, number_bathrooms = $2, clean_type = $3, recurring = $4, date = $5, time = $6, city_name = $7
          WHERE id = $8
          RETURNING id`;
        const values = [number_rooms, number_bathrooms, clean_type, recurring, date, time, city_name, id];
        const result = await db.query(query, values);
  
        if (result.rowCount > 0) {
          const updatedServiceId = result.rows[0].id;
          res.json({ message: 'Service updated successfully', service_id: updatedServiceId });
        } else {
          res.status(404).json({ message: 'Service update operation had no effect' });
        }
      } else {
        res.status(404).json({ message: 'Service not found for the specified ID' });
      }
    } catch (error) {
      console.error('Error updating house service:', error);
      res.status(500).json({ message: 'Failed to update house service' });
    }
  });
  



  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
