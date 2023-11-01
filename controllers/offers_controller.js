const offers_Model = require('../models/offers_model');


const offersController = {
  getalloffers: async (req, res) => {
    try {
      const offers = await offers_Model.getalloffers();
      res.json(offers.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching offers');
    }
  },
  // Define other controller methods here...
};

module.exports = offersController;
