const Enquiry = require("../models/enquiryModel");
const Factory = require("../utils/handlerFactory");

//1) CREATE PROJECT API
exports.createEnquirey = Factory.createOne(Enquiry);
exports.getAllEnquirey = Factory.getAll(Enquiry);
exports.deleteEnquirey = Factory.deleteOneByBody(Enquiry);
