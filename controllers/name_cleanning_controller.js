const names_cleanning_model = require('../models/name_cleaning_model');


const ournamescleanning = {
  getallnamecleanning: async (req, res) => {
    try {
      const names_cleanning = await names_cleanning_model.getAllcleanning();
      res.json(names_cleanning.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching names');
    }
  },
  // Define other controller methods here...
};

module.exports = ournamescleanning;
