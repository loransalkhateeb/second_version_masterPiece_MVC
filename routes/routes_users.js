const express = require('express');
const app = express();
const port = 9090;
app.use(express.json());

const UserController = require('../controllers/user_Controller');
// Import other controllers...

app.get('/home', UserController.getAllUsers);
// Add other routes using corresponding controller methods...

app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
