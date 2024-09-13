const User = require("../models/user");

const adminController = {
  getAllClients: async (req, res) => {
    try {
      const clients = await User.find({ roles: 1000 }).select(
        "-password -roles -refreshToken"
      );

      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  updateClient: async (req, res) => {
    try {
      const { clientId } = req.params;
      const updatedClient = await User.findByIdAndUpdate(clientId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.status(200).json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteClient: async (req, res) => {
    try {
      const { clientId } = req.params;
      const deletedClient = await User.findByIdAndDelete(clientId);

      if (!deletedClient) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
};

module.exports = adminController;
