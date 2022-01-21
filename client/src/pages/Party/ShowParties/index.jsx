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

export default function ShowParties() {
  const [parties, setParties] = useState([]);
  const [partyIsLoading, setPartyIsLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:1331/party/all')
      .then((res) => res.json())
      .then((data) => {
        setParties(data);
        setPartyIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setPartyIsLoading(false);
      });

    return () => {
      setParties([]);
      setPartyIsLoading(true);
    };
  }, []);

  if (partyIsLoading) {
    return <MessageModel message={'Parties are loading ...'} />;
  }

  if (parties.length === 0 && !partyIsLoading) {
    return (
      <MessageModel>
        {' '}
        <p style={{ marginBottom: '10px' }}>No parties found</p>
        <div>
          <Link to="/createParty">
            <button className="btn btn-primary">
              {' '}
              <MdLibraryAdd /> Add Party
            </button>
          </Link>
        </div>
      </MessageModel>
    );
  }

  return (
    <div className="showParties">
      <div className="pageHeader">
        <h2>
          Parties
          <span className="count">{'  (' + parties.length + ')'}</span>
        </h2>
        <Link to="/createParty">
          <button className="btn btn-primary">
            {' '}
            <MdLibraryAdd /> Add Party
          </button>
        </Link>
      </div>

      {parties.length === 0 ? (
        <Loading />
      ) : (
        <div className="parties">
          {parties.map((party) => (
            <div className="party" key={party._id}>
              <div className="details">
                <h3 className="name">{party.name}</h3>
                <h4 className="leader">{party.leader}</h4>
                <p className="desc">
                  {party.description.length > 100
                    ? party.description.slice(0, 100) + '...'
                    : party.description}
                </p>
                <p>
                  Total election participated :{' '}
                  {party.elections ? party.elections.length : 0}
                </p>
                <p>
                  Established on :{' '}
                  {String(new Date(party.createdAt))
                    .split(' ')
                    .slice(0, 4)
                    .join(' ') || '11/02/22'}
                </p>
              </div>
              <div className="actionLinks">
                <Link to={`/visualizeParty/${party._id}`}>
                  <button className="btn btn_small btn-primary">
                    <BiStats />
                    Visualize
                  </button>
                </Link>

                <Link to={`/editParty/${party._id}`}>
                  <button className="btn btn_small btn-primary">
                    {' '}
                    <MdEdit /> Edit
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
