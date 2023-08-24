var db = require('../db/connectiondb');
var Admin = db.admin;
// const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");


var checkUserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.redirect('/admin')
    } else {
      const verifyuser = jwt.verify(token, 'souravrajputrjitgwalior');
      const user = await Admin.findOne({ where: { id: verifyuser.userid } });
      if (!user) {
        return res.redirect("/admin");
      }
      req.user = user
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }

}

module.exports = checkUserAuth;
