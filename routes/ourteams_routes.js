const express = require('express');
const app = express();
const port = 9090;
app.use(express.json());

const teamsController = require('../controllers/our_teams_controller');
// Import other controllers...

app.get('/ourteams',teamsController.getallteams);
// Add other routes using corresponding controller methods...

app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
