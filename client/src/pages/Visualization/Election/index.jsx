import React, { Component, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BarChart from '../../../charts/BarChart';
import LineChart from '../../../charts/LineChart';
import PieChart from '../../../charts/PieChart';
// import MessageModel from '../../../../components/MessageModel';
import MessageModel from '../../../components/MessageModel';
import './style.scss';

export default function VisualizeElection() {
  const { id } = useParams();
  const [election, setElection] = useState(undefined);
  const [dataCollected, setDataCollected] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:1331/election/byId/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setElection(data);
        setDataCollected(true);
      });
  }, []);

  if (!dataCollected) {
    return <MessageModel message="Loading data..." />;
  }

  return (
    <div className="visualizeElection">
      <h2 className="header">{election.name}</h2>
      <p>
        <b>Conducted By :</b>
        {election.conductedBy}
      </p>
      <p className="desc">
        {' '}
        <b>Description</b> {election.description}
      </p>
      <p>
        <b>Conducted On: </b> {String(new Date(String(election.createdAt)))}
      </p>
      <p>
        <b>Parties: </b> {election.parties.length}
      </p>

      <p>
        <b>Areas: </b> {election.areas.length}
      </p>

      <div className="electionSummary">
        <div className="tableo">
          <table>
            <thead>
              <tr>
                <th>Party</th>
                <th>Votes</th>
                <th>Won</th>
              </tr>
            </thead>
            <tbody>
              {summaryElectionParty(election).map((party, index) => {
                return (
                  <tr key={index}>
                    <td>{party.name}</td>
                    <td>{party.votesGot}</td>
                    <td>{party.won ? 'Yes' : 'No'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="tableo" id="#targetTable">
          <table>
            <thead>
              <tr>
                <th>Area</th>
                <th>Population</th>
                <th>People Voted</th>
                <th>People Not Voted</th>
                {/* <th>Winner Party/Area</th> */}
              </tr>
            </thead>
            <tbody>
              {election.areaData.map((area, index) => {
                return (
                  <tr key={index}>
                    <td>{area.name}</td>
                    <td>{area.currentVoters}</td>
                    <td>{area.peopleVoted}</td>
                    <td>{area.peopleNotVoted}</td>
                    {/* <td>{getMaxVotedParty(area)}</td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="tableo" id="#targetTable">
          <table>
            <thead>
              <tr>
                <th>Party</th>
                <th>Max Votes</th>
                <th>Area</th>
                {/* <th>People Not Voted</th> */}
                {/* <th>Winner Party/Area</th> */}
              </tr>
            </thead>
            <tbody>
              {election.areaData.map((area, index) => {
                return getMaxVotePartyArea(area);
              })}
            </tbody>
          </table>
        </div>
      </div>
      <h2 className="sectionHeader">Elections</h2>
      <div className="charts">
        <div className="chart">
          <BarChart datao={generateElectionDataPerArea(election)} />
        </div>
        <div className="chart">
          <BarChart datao={generateElectionDataPerParty(election)} />
        </div>
        <div className="chart">
          <BarChart datao={generateElectionDataPerAreaPerParty(election)} />
        </div>

        <div className="chart">
          <BarChart datao={generateElectionDataPerPartyPerArea(election)} />
        </div>
      </div>

      {/* </div> */}
    </div>
  );
}

function getMaxVotedParty(area) {
  let maxVotedPartyString = '';
  let maxVotes = 0;

  area.parties.forEach((aparty) => {
    if (maxVotes < aparty.votesGiven) {
      maxVotes = aparty.votesGiven;
      maxVotedPartyString = aparty.name + ' (' + maxVotes + ')';
    }
  });
  return maxVotedPartyString;
}

function getMaxVotePartyArea(area) {
  let maxVotedParty = '';

  let maxVotes = 0;

  area.parties.forEach((aparty) => {
    if (maxVotes < aparty.votesGiven) {
      maxVotes = aparty.votesGiven;
      maxVotedParty = aparty.name;
    }
  });

  return (
    <tr key={area.area}>
      <td>{maxVotedParty}</td>
      <td>{maxVotes}</td>
      <td>{area.name}</td>
    </tr>
  );
}

function generateElectionDataPerArea(election) {
  let labels = []; // contains name of area
  let peopleVoted = []; // contains votes got in area

  election.areaData.forEach((earea) => {
    labels.push(earea.name);
    peopleVoted.push(earea.peopleVoted);
  });

  return {
    title: 'Voters in each Area',
    labels: labels,
    datasets: [
      {
        label: 'Votes',
        data: peopleVoted,
        backgroundColor: giveMaxVoteBarHighlighted(
          peopleVoted,
          '#0c8b6f46',
          '#0c8b6f',
        ),
        borderColor: '#0c8b6f',
        borderWidth: 1,
      },
    ],
  };
}

function generateElectionDataPerAreaPerParty(election) {
  let labels = []; // contains name of area
  let peopleVoted = []; // contains votes got in area

  election.areaData.forEach((earea) => {
    let arro = [];
    let pname = [];
    labels.push(earea.name);

    earea.parties.forEach((eaparty) => {
      pname.push(eaparty.name);
      arro.push(eaparty.votesGiven);
    });

    peopleVoted.push({
      name: pname,
      pv: arro,
    });
  });
  const bg = getAdvanceHighLight(peopleVoted, ' #0c8b6f46', '#0c8b6f');

  return {
    title: 'Voters in each Area to each party',
    labels: peopleVoted[0].name,

    datasets: peopleVoted.map((pv, i) => {
      return {
        label: labels[i],
        data: pv.pv,
        borderColor: ' #0c8b6f',
        backgroundColor: bg[i],
        borderWidth: 1,
      };
    }),
  };
}

function generateElectionDataPerPartyPerArea(election) {
  let labels = []; // contains name of party
  let peopleVoted = []; // contains votes got in area

  election.partyData.forEach((earea) => {
    labels.push(earea.name);
    let arro = [];
    let pname = [];
    earea.votesPerArea.forEach((eaparty) => {
      pname.push(eaparty.name);
      arro.push(eaparty.votesGiven);
    });

    peopleVoted.push({
      name: pname,
      pv: arro,
    });
  });

  const bg = getAdvanceHighLight(peopleVoted, ' #0c8b6f46', '#0c8b6f');

  return {
    title: 'Voters to each Party in each Area',
    labels: peopleVoted[0].name,

    datasets: peopleVoted.map((pv, i) => {
      return {
        label: labels[i],
        data: pv.pv,
        borderColor: ' #0c8b6f',
        backgroundColor: bg[i],
        borderWidth: 1,
      };
    }),
  };
}

function getAdvanceHighLight(pv, col, hcol) {
  let m = 0;
  let mi = 0;
  pv.forEach((p, i) => {
    let s = sumOfArray(p.pv);
    if (s > m) {
      m = s;
      mi = i;
    }
  });

  let bg = Array(pv.length).fill(col);
  bg[mi] = hcol;

  return bg;
}

function generateElectionDataPerParty(election) {
  let labels = []; // contains name of area
  let votesEachPartyGot = []; // contains votes got in area

  election.partyData.forEach((eparty) => {
    labels.push(eparty.name);
    votesEachPartyGot.push(eparty.totalVotes);
  });

  return {
    title: 'Votes per Party',
    labels: labels,
    datasets: [
      {
        label: 'Votes',
        data: votesEachPartyGot,
        backgroundColor: giveMaxVoteBarHighlighted(
          votesEachPartyGot,
          ' #0c8b6f46',
          ' #0c8b6f',
        ),
        borderColor: ' #0c8b6f',
        borderWidth: 1,
      },
    ],
  };

  // currentPartyData.forEach((partyData, i) => {
}

function giveMaxVoteBarHighlighted(arr, col, hcol) {
  let maxI = 0;
  let maxVote = 0;
  let bg = Array(arr.length).fill(col);
  arr.forEach((a, i) => {
    if (maxVote < a) {
      maxVote = a;
      maxI = i;
    }
  });
  bg[maxI] = hcol;
  return bg;
}

function summaryElectionParty(election) {
  let summary = [];
  let winnerIndex = 0;
  let maxVotes = 0;
  election.partyData.forEach((party, i) => {
    if (party.totalVotes > maxVotes) {
      maxVotes = party.totalVotes;
      winnerIndex = i;
    }

    summary.push({
      name: party.name,
      won: false,
      votesGot: party.totalVotes,
    });
  });

  summary[winnerIndex].won = true;

  return summary;
}

function sumOfArray(array) {
  return array.reduce((a, b) => a + b, 0);
}

function findPercentage(array) {
  let sum = sumOfArray(array);
  return array.map((item) => (item / sum) * 100);
}
