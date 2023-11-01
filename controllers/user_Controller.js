const UserModel = require('../models/usersModel');

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching users');
    }
  },
  // Define other controller methods here...
};

module.exports = UserController;
