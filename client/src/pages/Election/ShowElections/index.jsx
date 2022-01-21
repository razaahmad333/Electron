import React, { useState, useEffect } from 'react';
import { MdLibraryAdd } from 'react-icons/md';
import { MdHowToVote } from 'react-icons/md';

import { BiStats } from 'react-icons/bi';
import { MdEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';
import MessageModel from '../../../components/MessageModel';
import Loading from './../../../components/Loading';
import './style.scss';

export default function ShowElections() {
  const [elections, setElections] = useState([]);
  const [electionIsLoading, setElectionIsLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:1331/election/all')
      .then((res) => res.json())
      .then((data) => {
        setElections(data);
        setElectionIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setElectionIsLoading(false);
      });

    return () => {
      setElections([]);
      setElectionIsLoading(true);
    };
  }, []);

  if (electionIsLoading) {
    return <MessageModel message={'Elections are loading ...'} />;
  }

  if (elections.length === 0 && !electionIsLoading) {
    return (
      <MessageModel>
        {' '}
        <p style={{ marginBottom: '10px' }}>No elections found</p>
        <div>
          <Link to="/startElection">
            <button className="btn btn-primary">
              {' '}
              <MdHowToVote /> Start Election
            </button>
          </Link>
        </div>
      </MessageModel>
    );
  }

  return (
    <div className="showElections">
      <div className="pageHeader">
        <h2>Elections</h2>
        <Link to="/startElection">
          <button className="btn btn-primary">
            {' '}
            <MdHowToVote /> Start Election
          </button>
        </Link>
      </div>

      {elections.length === 0 ? (
        <Loading />
      ) : (
        <div className="elections">
          {elections.map((election) => (
            <div className="election" key={election._id}>
              <div className="details">
                <h3 className="name">{election.name}</h3>
                <h4>{election.conductedBy}</h4>
                <p className="desc">
                  {giveSlicedText(election.description, 100)}
                </p>
                <p>
                  Held on :{' '}
                  <span className="val">
                    {String(new Date(election.createdAt))
                      .split(' ')
                      .slice(0, 4)
                      .join(' ') || '11/02/22'}
                  </span>
                </p>
                <p>
                  Total votes :{' '}
                  <span className="val"> {getTotalVotes(election)}</span>{' '}
                </p>
                <p>
                  Parties Participated :{' '}
                  <span className="val"> {election.parties.length}</span>
                </p>
                <p>
                  In Areas :{' '}
                  <span className="val">{election.areas.length}</span>
                </p>
              </div>
              <div className="actionLinks">
                <Link to={`/visualizeElection/${election.id}`}>
                  <button className="btn btn_small btn-primary">
                    <BiStats />
                    Visualize
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getTotalVotes(election) {
  let sum = 0;
  election.areaData.forEach((area) => {
    sum += area.peopleVoted;
  });
  return sum;
}

function giveSlicedText(text, length) {
  if (text.length > length) {
    return text.slice(0, length) + '...';
  }
  return text;
}
