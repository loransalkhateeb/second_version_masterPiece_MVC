const service_model = require('../models/services_model');

const service_controller = {
  getAllServices: async (req, res) => {
    try {
      const services = await service_model.getAllServices();
      res.json(services.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching services');
    }
  },
  // Define other controller methods here...
};

module.exports = service_controller;
