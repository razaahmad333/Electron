const router = require("express").Router();
const { Types } = require("mongoose");
const Election = require("../models/election.model");
const Area = require("../models/area.model");
const Party = require("../models/party.model");

const uuid = require("uuid");
router.get("/all", (req, res) => {
  Election.find({}, (err, elections) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(elections);
    }
  });
});

router.get("/byArea/:id", (req, res) => {
  Area.findById(req.params.id, (err, area) => {
    if (err) {
      res.status(500).send(err);
    } else {
      Election.find({ _id: { $in: area.elections } }, (err, elections) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(elections);
        }
      });
    }
  });
});

router.post("/start", (req, res) => {
  const electionID = uuid.v4();
  const { name, description, conductedBy, parties, areas } = req.body;
  const { partiesPartcipated, areasPartcipated, partyData, areaData } =
    conductElectionAI(parties, areas);
  const newElection = new Election({
    id: electionID,
    name,
    description,
    conductedBy,
    parties: partiesPartcipated,
    areas: areasPartcipated,
    partyData,
    areaData,
  });

  newElection.save((err, election) => {
    if (err) {
      res.status(500).send(err);
    } else {
      Party.updateMany(
        { _id: { $in: partiesPartcipated } },
        { $push: { elections: electionID } },
        (err, party) => {
          if (err) {
            res.status(500).send(err);
          } else {
            Area.updateMany(
              { _id: { $in: areasPartcipated } },
              { $push: { elections: electionID } },
              (err, area) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res
                    .status(200)
                    .send({ election, msg: "Election ended", success: true });
                }
              }
            );
          }
        }
      );

      // res.status(200).send(election);
    }
  });

  // res.send({ msg: "election end", success: true, newElection });
});

router.get("/byId/:id", (req, res) => {
  Election.findOne({ id: req.params.id }, (err, election) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(election);
    }
  });
});

router.get("/current", (req, res) => {
  Election.findOne({
    current: true,
  })
    .then((election) => {
      res.json(election);
    })
    .catch((err) => {
      res.json(err);
    });
});

function conductElectionAI(parties, areas) {
  const nP = parties.length;
  const nA = areas.length;
  let partiesPartcipated = parties.map((party) => party._id);
  let areasPartcipated = areas.map((area) => area._id);
  let partyData = [];
  let areaData = [];

  for (let i = 0; i < nA; i++) {
    let cV = areas[i].currentVoters;
    let pNV = cV % nP;
    let pV = cV - pNV;
    let dR = nP % 2 === 0 ? nP / 2 : Math.floor(nP / 2);
    let sweet = 0.1;
    let fR = Math.floor((pV / nP) * sweet);
    areaData.push({
      area: areas[i]._id,
      name: areas[i].name,
      currentVoters: cV,
      peopleVoted: pV,
      peopleNotVoted: pNV,
      parties: [],
    });

    let arr = getAShuffledArray(dR, fR, nP);
    for (let j = 0; j < nP; j++) {
      let vG = arr[j] + pV / nP;
      areaData[i].parties.push({
        party: parties[j]._id,
        name: parties[j].name,
        votesGiven: vG,
      });

      partyData[j] = {
        name: parties[j].name,
        party: parties[j]._id,
        totalVotes: partyData[j] ? partyData[j].totalVotes + vG : vG,
        votesPerArea: partyData[j]
          ? partyData[j].votesPerArea.concat([
              {
                area: areas[i]._id,
                votesGiven: vG,
                name: areas[i].name,
              },
            ])
          : [
              {
                area: areas[i]._id,
                votesGiven: vG,
                name: areas[i].name,
              },
            ],
      };
    }
  }
  return {
    partiesPartcipated,
    areasPartcipated,
    partyData,
    areaData,
  };
}

function getAShuffledArray(degR, facR, nP) {
  let arr = [];
  if (nP % 2 === 0) {
    for (let i = 0; i < nP / 2; i++) {
      arr.push((-i - 1) * facR);
      arr.push((i + 1) * facR);
    }
  } else {
    for (let i = 0; i < nP; i++) {
      arr.push((i - degR) * facR);
    }
  }

  for (let i = 0; i < nP; i++) {
    let j = Math.floor(Math.random() * (nP - i));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

module.exports = router;
