const router = require("express").Router();
const Area = require("../models/area.model");

router.get("/all", (req, res) => {
  Area.find({}, (err, areas) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(areas);
    }
  });
});

router.get("/byId/:id", (req, res) => {
  const id = req.params.id;
  Area.findById(id).then((area) => {
    res.json(area);
  });
});

router.post("/create", (req, res) => {
  const { areaName, areaDescription, currentVoters } = req.body;
  const newArea = new Area({
    name: areaName,
    description: areaDescription,
    currentVoters: currentVoters,
    votersHistory: [currentVoters],
    createdAt: new Date(),
  });
  newArea
    .save()
    .then(() => res.json({ msg: "Area Added", success: true }))
    .catch((err) => res.status(400).json({ err: err, success: false }));
});

router.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { areaName, areaDescription, currentVoters } = req.body;
  Area.findById(id).then((area) => {
    area.name = areaName;
    area.description = areaDescription;
    area.currentVoters = currentVoters;
    area.votersHistory.push(currentVoters);
    area
      .save()
      .then(() => res.json({ msg: "Area Edited", success: true }))
      .catch((err) => res.status(400).json({ err: err, success: false }));
  });
});

module.exports = router;
