const { Events, validateID, validate } = require("../models/event");
const { fileUploadControl } = require("../middleware/uploadController");
const _ = require("lodash");
const fs = require("fs");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const event = await Events.find().sort({ eventDate: 1 });

  res.send(event);
});

router.get("/:id", async (req, res) => {
  const { error } = validateID(req.params);
  if (error) return res.status(400).send(error.details[0].message);

  const event = await Events.findById(req.params.id);
  if (!event) return res.status(400).send("Event cannot be found");

  res.send(event);
});

router.post("/", fileUploadControl.single("file"), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const event = new Events();
  event.title = req.body.title;
  event.eventDate = req.body.eventDate;
  event.eventTime = req.body.eventTime;
  event.eventImage.data = fs.readFileSync(req.file.path);
  event.eventImage.contentType = "image/jpeg";

  await event.save();

  res.send(_.pick(event, ["title", "eventDate", "eventTime"]));
});

router.put("/:id", fileUploadControl.single("file"), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
});
