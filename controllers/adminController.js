const User = require("../models/userModel");
const Factory = require("../utils/handlerFactory");

exports.getAllAdmins = Factory.getAll(User);
