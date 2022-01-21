import React, { Component, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BarChart from '../../../charts/BarChart';
import LineChart from '../../../charts/LineChart';
import PieChart from '../../../charts/PieChart';
// import MessageModel from '../../../../components/MessageModel';
import MessageModel from '../../../components/MessageModel';
import './style.scss';

export default function VisualizeParty() {
  const { id } = useParams();
  const [party, setParty] = useState(undefined);
  const [partyElections, setPartyElections] = useState([]);
  const [dataCollected, setDataCollected] = useState(false);

  useEffect(() => {
    setPartyElections([]);
    fetch(`http://localhost:1331/party/byId/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setParty(data);
        if (data.elections.length > 0) {
          data.elections.map((partyElectionID) => {
            fetch('http://localhost:1331/election/byId/' + partyElectionID)
              .then((res) => res.json())
              .then((datao) => {
                setPartyElections((partyElections) => [
                  ...partyElections,
                  datao,
                ]);
              });
          });
        } else {
          setDataCollected(true);
        }
      });
  }, []);

  useEffect(() => {
    if (party) {
      if (partyElections.length === party.elections.length) {
        setDataCollected(true);
      }
    }
  }, [partyElections]);

  if (!dataCollected) {
    return <MessageModel message="Loading data..." />;
  }

  return (
    <div className="visualizeParty">
      <h2 className="header">{party.name}</h2>
      <p>
        <b>Leader :</b>
        {party.leader}
      </p>
      <p className="desc">
        {' '}
        <b>Description</b> {party.description}
      </p>
      <p>
        <b>Established On: </b> {String(new Date(String(party.createdAt)))}
      </p>
      <p>
        <b>Elections: </b> {party.elections.length}
      </p>

      {party.elections.length > 0 && (
        <div>
          <div className="electionSummary">
            <table>
              <thead>
                <tr>
                  <th>Election</th>
                  <th>Votes</th>
                  <th>Won</th>
                </tr>
              </thead>
              <tbody>
                {summaryElections(partyElections, id).map((election, index) => {
                  return (
                    <tr key={index}>
                      <td>{election.name}</td>
                      <td>{election.votesGot}</td>
                      <td>{election.won ? 'Yes' : 'No'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="pieChart">
              <PieChart data={winningPieChartDataset(partyElections, id)} />
            </div>
          </div>
          <div className="charts">
            <div className="chart">
              {partyElections.length > 0 && (
                <LineChart
                  datao={generatePerElectionData(partyElections, id)}
                />
              )}
            </div>
          </div>
          <h2 className="sectionHeader">Elections</h2>

          <div className="charts">
            {partyElections.map((partyElection, i) => {
              return (
                <div className="chart" key={i}>
                  <BarChart
                    datao={generateElectionDataPerArea(partyElection, id)}
                  />
                  {/* <LineChart datao={generateElectionDataOfArea(areaElection, id)} /> */}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function generateElectionDataPerArea(partyElection, id) {
  let labels = []; // contains name of area
  let votesGotInEachArea = []; // contains votes got in area

  let currentPartyData = partyElection.partyData.find(
    (datae) => datae.party === id,
  );
  currentPartyData &&
    currentPartyData.votesPerArea.forEach((area) => {
      labels.push(area.name);
      votesGotInEachArea.push(area.votesGiven);
    });

  return {
    title: 'Votes got in ' + partyElection.name,
    labels: labels,
    datasets: [
      {
        label: 'Votes',
        data: votesGotInEachArea,
        backgroundColor: '#0c8b6f46',
        borderColor: ' #0c8b6f',
        borderWidth: 1,
      },
    ],
  };

  // currentPartyData.forEach((partyData, i) => {
}

function generatePerElectionData(partyElections, id) {
  let labels = []; // contains name of elections
  let votesInEachElection = [];

  partyElections.forEach((partyElection, i) => {
    let currentPartyData = partyElection.partyData.find(
      (partyDatae) => partyDatae.party === id,
    );

    if (currentPartyData) {
      labels.push(partyElection.name);
      votesInEachElection.push(currentPartyData.totalVotes);
    }
  });

  return {
    title: 'Votes in each election',
    labels,
    datasets: [
      {
        label: 'Votes',

        data: votesInEachElection,
        backgroundColor: '#0c8b6f46',
        borderColor: ' #0c8b6f',
        borderWidth: 5,
        fill: true,
      },
    ],
  };
}

function winningPieChartDataset(partyElections, _id) {
  let summary = summaryElections(partyElections, _id);
  let labels = ['Won', 'Lost'];
  let wonCount = 0;
  let lostCount = 0;
  summary.forEach((election) => {
    if (election.won) {
      wonCount++;
    } else {
      lostCount++;
    }
  });

  return {
    title: 'Won/Lost',
    labels,
    datasets: [
      {
        label: 'Won',
        data: [wonCount, lostCount],
        backgroundColor: ['#0c8b6f', '#0c8b6fb6'],
        borderColor: ' #0c8b6f',
        borderWidth: 1,
      },
    ],
  };
}

function summaryElections(partyElections, _id) {
  let summary = [];
  let votesGot = 0;
  partyElections.forEach((partyElection) => {
    let maxVotes = 0;
    let maxVoteParty = '';
    partyElection.partyData.forEach((partyDatae) => {
      if (partyDatae.party === _id) {
        votesGot = partyDatae.totalVotes;
      }
      if (partyDatae.totalVotes > maxVotes) {
        maxVotes = partyDatae.totalVotes;
        maxVoteParty = partyDatae.party;
      }
    });
    summary.push({
      name: partyElection.name,
      won: maxVoteParty === _id,
      votesGot,
      maxVotes,
    });
  });
  return summary;
}

function sumOfArray(array) {
  return array.reduce((a, b) => a + b, 0);
}

function findPercentage(array) {
  let sum = sumOfArray(array);
  return array.map((item) => (item / sum) * 100);
}
