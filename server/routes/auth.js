const db = require("../config/conn");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const path = require("path");

const RECAPTCHA_SECRET = "6LfnPuEZAAAAAI0q84fCdhUUx09LtHYdPvaZ5pP_";

require("dotenv").config({ path: path.join(__dirname, "../.env") });

module.exports = (passport) => {
  let exp = {};

  exp.checkLogin = (req, res) => {
    if (req.isAuthenticated()) {
      return res.status(200).send("Logged in");
    }
    console.log("Not logged in.");
    return res.status(401).redirect("/login");
  };
  exp.ensure = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    console.log("Not logged in.");
    return res.status(401).send("Not logged in.");
  };

  exp.access = (req, res, next) => {
    if (req.user && req.user.access === 2) return next();
    return res.status(403).send("Access Forbidden.");
  };

  exp.register = async (req, res) => {
    try {
      let captchaResp = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
          params: {
            secret: RECAPTCHA_SECRET,
            response: req.body.token,
          },
        }
      );
      console.log(captchaResp.data.success);
      if (captchaResp.data.success === false)
        return res.status(500).send("Captcha failed.");
      let userExists = await db.User.findOne({
        where: { email: req.body.email },
      });
      if (userExists && userExists.email === req.body.email)
        return res.status(409).send("Email already exists");
      // if (req.body.password !== req.body.password_confirmation) return res.status(409).send('Passwords do not match');
      let salt = await bcrypt.genSalt();
      let hash = await bcrypt.hash(req.body.password, salt);
      let userData = new db.User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hash,
        access: 2,
      });
      await userData.save();
      return res.status(200).send("Successfully registered " + req.body.email);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  };

  exp.login = async (req, res) => {
    try {
      let user = await db.User.findOne({ email: req.body.email });
      if (!user) return res.status(403).send("Invalid email or password.");
      let check = await bcrypt.compare(req.body.password, user.password);
      if (!check) return res.status(403).send("Invalid email or password.");
      req.login(user, (err) => {
        if (err) res.status(401).send(err);
        console.log("Login success.");
        console.log(req.user);
        return res.status(200).send(user);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  };

  exp.logout = async (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).send(err);
      req.logout();
      console.log("Logged out.");
      res.status(200).send("Logout successful.");
    });
  };

  exp.setAccess = async (req, res) => {
    try {
      let user = await db.User.findOne({
        where: { email: req.body.email },
      });
      if (!user) return res.status(400).send("User does not exist.");
      db.User.updateOne(
        { _id: user.id },
        { $set: { access: req.body.access } }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  };

  return exp;
};
