const express = require('express');
const app = express();
const port = 9090;
app.use(express.json());

const customerController = require('../controllers/customer_controller');
// Import other controllers...

app.get('/customers', customerController.getAllCustomers);
// Add other routes using corresponding controller methods...

app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
