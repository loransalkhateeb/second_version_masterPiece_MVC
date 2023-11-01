const express = require('express');
const app = express();
const port = 9090;
app.use(express.json());

const servicesController = require('../controllers/service_controller');
// Import other controllers...

app.get('/services', servicesController.getAllServices);
// Add other routes using corresponding controller methods...

app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
