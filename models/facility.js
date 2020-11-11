const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    title: { type: String, maxlength: 250 },
    facilityImage: { data: Buffer, contentType: String },
  },
  { timestamps: true }
);

const Facility = mongoose.model("Facility", facilitySchema);

function validateFacility(facility) {
  const schema = joi.object({
    title: joi.string().max(250).required(),
  });
  return schema.validate(facility);
}

function validateFacilityID(facility) {
  const schema = joi.object({
    id: joi.objectId().required(),
  });
  return schema.validate(facility);
}

module.exports.validateID = validateFacilityID;
module.exports.validate = validateFacility;
module.exports.Facilities = Facility;
