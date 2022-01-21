const router = require("express").Router();
const Party = require("../models/party.model");

router.get("/all", (req, res) => {
  Party.find({}, (err, parties) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(parties);
    }
  });
});

router.get("/byId/:id", (req, res) => {
  const id = req.params.id;
  Party.findById(id).then((party) => {
    res.json(party);
  });
});

router.post("/create", (req, res) => {
  const { partyName, partyDescription, partyLeaderName } = req.body;
  const newParty = new Party({
    name: partyName,
    description: partyDescription,
    leader: partyLeaderName,
    createdAt: new Date(),
  });
  newParty
    .save()
    .then(() => res.json({ msg: "Party Added", success: true }))
    .catch((err) => res.status(400).json({ err: err, success: false }));
});

router.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { partyName, partyDescription, partyLeaderName } = req.body;
  Party.findById(id).then((party) => {
    party.name = partyName;
    party.description = partyDescription;
    party.leader = partyLeaderName;
    party
      .save()
      .then(() => res.json({ msg: "Party Edited", success: true }))
      .catch((err) => res.status(400).json({ err: err, success: false }));
  });
});

module.exports = router;
