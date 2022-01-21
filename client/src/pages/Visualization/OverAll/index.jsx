import React, { useState, useEffect } from 'react';
// MdLibraryAdd
import { MdLibraryAdd } from 'react-icons/md';

// import { IoStatsChart } from 'react-icons/io';
import { BiStats } from 'react-icons/bi';
import { MdEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';
import MessageModel from '../../../components/MessageModel';
import Loading from './../../../components/Loading';
import './style.scss';
export default function Visualization() {
  const [elections, setElections] = useState([]);
  const [parties, setParties] = useState([]);
  const [areas, setAreas] = useState([]);
  const [dataIsLoading1, setDataIsLoading1] = useState(true);
  const [dataIsLoading2, setDataIsLoading2] = useState(true);
  const [dataIsLoading3, setDataIsLoading3] = useState(true);
  useEffect(() => {
    fetch('http://localhost:1331/area/all')
      .then((res) => res.json())
      .then((data) => {
        setAreas(data);
        setDataIsLoading1(false);
      })
      .catch((err) => {
        setDataIsLoading1(false);

        console.log(err);
      });
    fetch('http://localhost:1331/party/all')
      .then((res) => res.json())
      .then((data) => {
        setParties(data);
        setDataIsLoading2(false);
      })
      .catch((err) => {
        setDataIsLoading2(false);
        console.log(err);
      });
    fetch('http://localhost:1331/election/all')
      .then((res) => res.json())
      .then((data) => {
        setElections(data);
        setDataIsLoading3(false);
      })
      .catch((err) => {
        setDataIsLoading3(false);
        console.log(err);
      });

    return () => {
      setAreas([]);
      setElections([]);
      setParties([]);

      setDataIsLoading1(false);
      setDataIsLoading2(false);
      setDataIsLoading3(false);
    };
  }, []);

  if (dataIsLoading1 || dataIsLoading2 || dataIsLoading3) {
    return <MessageModel message={' Loading ...'} />;
  }

  return (
    <div className="overAllVisual">
      <h2 className="header">
        {' '}
        <BiStats /> Visualization
      </h2>
      <div className="section">
        <div className="sectionHeader">Elections</div>
        {elections.length === 0 ? (
          <div>
            No Elections held yet
            <Link to={'/startElection'}>
              <button className="btn">Start Election</button>
            </Link>
          </div>
        ) : (
          <div className="sectionBody">
            {elections.map((election) => (
              <Link key={election.id} to={`/visualizeElection/${election.id}`}>
                <button className="vlink">
                  {giveSlicedText(election.name, 12)}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <div className="sectionHeader">Parties</div>
        {parties.length === 0 ? (
          <div>
            No parties found
            <Link to={'/createParty'}>
              <button className="btn">Create Party</button>
            </Link>
          </div>
        ) : (
          <div className="sectionBody">
            {parties.map((party) => (
              <Link key={party._id} to={`/visualizeParty/${party._id}`}>
                <button className="vlink">
                  {giveSlicedText(party.name, 12)}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <div className="sectionHeader">Areas</div>
        {areas.length === 0 ? (
          <div>
            No areas found
            <Link to={'/createArea'}>
              <button className="btn">Create Area</button>
            </Link>
          </div>
        ) : (
          <div className="sectionBody">
            {areas.map((area) => (
              <Link key={area._id} to={`/visualizeArea/${area._id}`}>
                <button className="vlink">
                  {giveSlicedText(area.name, 12)}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function giveSlicedText(text, length) {
  if (text.length > length) {
    return text.slice(0, length) + '...';
  }
  return text;
}
