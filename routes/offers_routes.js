const express = require('express');
const app = express();
const port = 9090;
app.use(express.json());

const offers_route = require('../controllers/offers_controller');


app.get('/offers', offers_route.getalloffers);


app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});

