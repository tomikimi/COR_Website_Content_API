const { Facilities, validate, validateID } = require("../models/facility");
const { fileUploadControl } = require("../middleware/uploadController");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const _ = require("lodash");

router.get("/", async (req, res) => {
  const facility = await Facilities.find();
  res.send(facility);
});

router.get("/:id", async (req, res) => {
  const { error } = validateID(req.params);
  if (error) return res.status(400).send(error.details[0].message);

  const facility = await Facilities.findById(req.params.id);

  res.send(_.pick(facility, ["title"]));
});

router.post("/", fileUploadControl.single("file"), async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const facility = new Facilities();
  facility.title = req.body.title;
  facility.facilityImage.data = fs.readFileSync(req.file.path);
  facility.facilityImage.contentType = "image/jpeg";

  await facility.save();

  res.send(_.pick(facility, ["title"]));
});

//Query First Approach
// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send("title is Required");

//   const facility = await Facilities.findById(req.params.id);
//   if (!facility) return res.status(400).send("Facility not Found");

//   facility.set({
//     title: req.body.title,
//   });

//   await facility.save();

//   res.send(_.pick(facility, ["title"]));
// });

//Update First Approach
router.put("/:id", fileUploadControl.single("file"), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send("title is Required");

  const facility = await Facilities.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        facilityImage: fs.readFileSync(req.file.path),
      },
    },
    { new: true }
  );

  res.send(_.pick(facility, ["title"]));
});

router.delete("/:id", async (req, res) => {
  const { error } = validateID(req.params);
  if (error) return res.status(400).send(error.details[0].message);

  const facility = await Facilities.findByIdAndRemove(req.params.id);

  res.send(_.pick(facility, ["title"]));
});

module.exports = router;
