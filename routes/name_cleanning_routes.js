const express = require('express');
const app = express();
const port = 9090;
app.use(express.json());

const name_cleanning_con = require('../controllers/name_cleanning_controller');
// Import other controllers...

app.get('/namecleanning', name_cleanning_con.getallnamecleanning);
// Add other routes using corresponding controller methods...

app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});

