const Cities = require("../models/cityModel");
const Factory = require("../utils/handlerFactory");

//1) CREATE PROJECT API
exports.createCity = Factory.createOne(Cities);
exports.getAllCites = Factory.getAll(Cities);
exports.deleteCity = Factory.deleteOneByBody(Cities);
