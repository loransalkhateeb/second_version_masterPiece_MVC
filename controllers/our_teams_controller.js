const our_teams_model = require('../models/our_teams_model');


const ourteamscontroller = {
  getallteams: async (req, res) => {
    try {
      const teams = await our_teams_model.getAllTeams();
      res.json(teams.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching teams');
    }
  },
  // Define other controller methods here...
};

module.exports = ourteamscontroller;
