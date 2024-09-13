const User = require("../models/user");
const bcrypt = require("bcryptjs");

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ roles: 5000 });

    if (!adminExists) {
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash("adminpassword", saltRounds);
      const admin = new User({
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        roles: 5000,
        businessType: "Admin Business",
        enabled: true,
      });
      await admin.save();
      console.log("Admin user created.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
};

module.exports = createAdminUser;
