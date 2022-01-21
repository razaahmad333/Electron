import React, { Component, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BarChart from '../../../charts/BarChart';
import LineChart from '../../../charts/LineChart';
// import MessageModel from '../../../../components/MessageModel';
import MessageModel from '../../../components/MessageModel';
import './style.scss';
import {
  primarySkyBlue,
  primarySkyBlueAlpha,
  primarySkyBlue2,
  primarySkyBlueAlpha2,
  primarySkyBlue3,
  primarySkyBlueAlpha3,
} from '../../../charts/colors';

export default function VisualizeArea() {
  const { id } = useParams();
  const [area, setArea] = useState(undefined);
  const [areaElections, setAreaElections] = useState([]);
  const [dataCollected, setDataCollected] = useState(false);

  useEffect(() => {
    setAreaElections([]);
    fetch(`http://localhost:1331/area/byId/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArea(data);
        if (data.elections.length > 0) {
          data.elections.map((areaElectionID) => {
            fetch('http://localhost:1331/election/byId/' + areaElectionID)
              .then((res) => res.json())
              .then((datao) => {
                setAreaElections((areaElections) => [...areaElections, datao]);
              });
          });
        } else {
          setDataCollected(true);
        }
      });
  }, []);

  useEffect(() => {
    if (area) {
      if (areaElections.length === area.elections.length) {
        setDataCollected(true);
      }
    }
  }, [areaElections]);

  if (!dataCollected) {
    return <MessageModel message="Loading data..." />;
  }

  return (
    <div className="visualizeArea">
      <h2 className="header">{area.name}</h2>
      <p className="desc">
        {' '}
        <b>Description</b> {area.description}
      </p>
      <p>
        <b> Current Population: </b> {area.currentVoters}
      </p>
      <p>
        <b>Established On: </b> {String(new Date(String(area.createdAt)))}
      </p>
      <p>
        <b>Elections: </b> {area.elections.length}
      </p>
      {areaElections.length > 0 && (
        <div className="charts">
          <div className="chart">
            <LineChart datao={generatePopulationData(areaElections, id)} />
          </div>
        </div>
      )}{' '}
      <div className="charts">
        {areaElections.map((areaElection, i) => {
          return (
            <div className="chart" key={i}>
              <BarChart datao={generateElectionDataOfArea(areaElection, id)} />
              {/* <LineChart datao={generateElectionDataOfArea(areaElection, id)} /> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function generateElectionDataOfArea(areaElectione, id, electionName) {
  let labels = []; // contains name of party
  let votesInEachParty = [];
  let currentArea = areaElectione.areaData.find((area) => area.area === id);

  currentArea.parties.forEach((party, i) => {
    (votesInEachParty[i] = party.votesGiven), labels.push(party.name);
  });

  return {
    title: '% Votes to each party in ' + areaElectione.name,
    labels: labels,
    datasets: [
      {
        label: 'Votes',
        data: findPercentage(votesInEachParty),
        backgroundColor: primarySkyBlueAlpha,
        borderColor: primarySkyBlue,
        borderWidth: 1,
      },
    ],
  };
}

function generatePopulationData(areaElections, id) {
  let labels = []; // contains name of elections

  let populationInEachElection = [];
  let populationInEachElectionVoted = [];
  let populationInEachElectionNotVoted = [];

  areaElections.map((areaElection) => {
    labels.push(areaElection.name);

    areaElection.areaData.forEach((aread) => {
      if (aread.area === id) {
        populationInEachElection.push(aread.currentVoters);
        populationInEachElectionVoted.push(aread.peopleVoted);
        populationInEachElectionNotVoted.push(aread.peopleNotVoted);
      }
    });
  });
  return {
    title: 'Population in each election',
    labels,
    datasets: [
      {
        label: 'Population',
        data: populationInEachElection,
        borderColor: primarySkyBlue,
        backgroundColor: primarySkyBlueAlpha,
        borderWidth: 2,
      },
      {
        label: 'Population Voted',
        data: populationInEachElectionVoted,
        borderColor: primarySkyBlue2,
        backgroundColor: primarySkyBlueAlpha2,
        borderWidth: 6,
      },
      {
        label: 'Population Not Voted',
        data: populationInEachElectionNotVoted,
        borderColor: primarySkyBlue3,
        backgroundColor: primarySkyBlueAlpha3,
      },
    ],
  };
}

function sumOfArray(array) {
  return array.reduce((a, b) => a + b, 0);
}

function findPercentage(array) {
  let sum = sumOfArray(array);
  return array.map((item) => (item / sum) * 100);
}
