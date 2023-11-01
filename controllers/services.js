
const express = require("express");
const app = express();
const db = require(`../models/connect.js`);
const port = 9090;
app.use(express.json());


app.get('/services', async (req, res) => {
    try {
      let result = await db.query(`SELECT * from services`);
      res.json(result.rows);
    }
    catch (err) {
      console.error(err);
      res.status(500).send('error in get the home');
    }
});

app.listen(port, () => {
    console.log(`server running in port ${port}`);
})