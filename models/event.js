const { string } = require("joi");
const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, maxlength: 250, required: true },
    eventDate: { type: String, required: true },
    eventTime: { type: String, required: true },
    eventDetails: { type: String, required: true },
    eventImage: { data: Buffer, contentType: String },
  },
  { timestamps: true }
);

const Event = mongoose.model("Events", eventSchema);

function validateEventID(event) {
  const schema = joi.object({
    id: joi.objectId().required(),
  });
  return schema.validate(event);
}

function validateEvent(event) {
  const schema = joi.object({
    title: joi.string().max(250).required(),
    eventDate: joi.string().required(),
    eventTime: joi.string().required(),
    eventDetails: joi.string().required(),
  });
  return schema.validate(event);
}

module.exports.validateID = validateEventID;
module.exports.validate = validateEvent;
module.exports.Events = Event;
