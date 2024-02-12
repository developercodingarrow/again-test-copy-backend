const Builders = require("../models/builderModel");
const Factory = require("../utils/handlerFactory");

//1) CREATE PROJECT API
exports.createBuilder = Factory.createOne(Builders);
exports.getAllBuilder = Factory.getAll(Builders);
exports.deleteBuilder = Factory.deleteOneByBody(Builders);
