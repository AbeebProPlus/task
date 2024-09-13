const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mailService = require("../services/mailService");
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clientController = {
  register: async (req, res) => {
    const { name, email, password, businessType } = req.body;

    if (!name || !email || !password || !businessType) {
      return res
        .status(400)
        .json({ message: "Please provide the required details" });
    }

    const duplicateEmail = await User.findOne({ email: email }).exec();
    if (duplicateEmail) {
      return res.status(409).json({
        message: `Account with email ${email} exists. Please proceed to login`,
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const confirmationToken = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        businessType: businessType,
        confirmationToken: confirmationToken,
      });
      const confirmationLink = `http://localhost:${PORT}/registration/confirm-email?token=${confirmationToken}`;

      await mailService.sendMail(
        email,
        "Confirm Your Email",
        `Please click the following link to confirm your email: ${confirmationLink}`
      );
      return res.status(201).json({
        message: `Please check your email for a link to complete your registration.`,
      });
    } catch (err) {
      console.error("Error registering user:", err);
      return res.status(500).json({ message: err.message });
    }
  },

  confirmEmail: async (req, res) => {
    const { token } = req.query;
    if (!token)
      return res
        .status(400)
        .json({ message: "Please check the url link sent to your inbox" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findOneAndUpdate(
        { email: decoded.email },
        { enabled: true, confirmationToken: null },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "Email confirmed successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  forgotPassword: async (req, res) => {
    const email = req.body.email;
    if (!email)
      return res.status(400).json({ message: "Provide your address" });
    try {
      const confirmationToken = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: "1d",
      });
      const resetPasswordLink = `http://localhost:${PORT}/registration?token=${confirmationToken}`;
      const foundUser = await User.findOne({ email: email }).exec();
      if (!foundUser)
        return res.status(200).json({
          message:
            "A password reset email has been sent to the provided email address if it exists in our system. Please check your inbox",
        });
      await mailService.sendMail(
        email,
        "Confirm Your Email",
        `Please click the following link to confirm your email: ${resetPasswordLink}`
      );
      return res.status(200).json({
        message:
          "A password reset email has been sent to the provided email address if it exists in our system. Please check your inbox",
      });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  resetPassword: async (req, res) => {
    const { token } = req.query;
    const { newPassword } = req.body;
    if (!token)
      return res
        .status(400)
        .json({ message: "Please check the url link sent to your inbox" });
    if (!newPassword)
      return res.status(400).json({ message: "Please provide new password" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findOne({ email: decoded.email }).exec();
      if (!user) return res.sendStatus(404);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    try {
      let foundUser;
      if (emailRegex.test(email)) {
        foundUser = await User.findOne({ email: email }).exec();
      }
      if (!foundUser) {
        return res.status(403).json({ message: `User does not exist` });
      }
      if (!foundUser.enabled) {
        return res.status(403).json({
          message: `Please verify your email address before logging in`,
        });
      }
      const passwordMatches = await bcrypt.compare(
        password,
        foundUser.password
      );
      if (passwordMatches) {
        const roles = Array.isArray(foundUser.roles) ? foundUser.roles : [foundUser.roles]; 
        const accessToken = jwt.sign(
          {
            userInfo: {
              email: foundUser.email,
              roles: roles
            },
          },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
          { username: foundUser.email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          // secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ accessToken });
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  changePassword: async (req, res) => {
    const { userId, newPassword, oldPassword } = req.body;
    if (!userId || !newPassword || !oldPassword) {
      return res
        .sendStatus(400)
        .json({ message: "Provide user Id, old password and new password" });
    }
    try {
      const foundUser = await User.findById(userId);
      if (!foundUser)
        return res.status(404).json({ message: `User not found` });
      const passwordMatches = await bcrypt.compare(
        oldPassword,
        foundUser.password
      );
      if (!passwordMatches)
        return res
          .status(401)
          .json({ message: "Password does not match with current password" });
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      foundUser.password = hashedPassword;
      await foundUser.save();
      return res
        .status(200)
        .json({ message: "Password changed successfully!" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = clientController;
