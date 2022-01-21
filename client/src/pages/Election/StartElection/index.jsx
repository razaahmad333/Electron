import React, { useEffect, useState } from 'react';
import MessageModel from '../../../components/MessageModel';
import { MdLibraryAdd } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';
import './style.scss';

export default function StartElection() {
  const [electionName, setElectionName] = useState('Election Name');
  const [electionDescription, setElectionDescription] = useState(
    'Election description',
  );

  const [conductedBy, setConductedBy] = useState('election conductor');
  const [parties, setParties] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedParties, setSelectedParties] = useState([]);
  const [partiesAreLoading, setPartiesAreLoading] = useState(true);
  const [areasAreLoading, setAreasAreLoading] = useState(true);
  const [electionEnd, setElectionEnd] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:1331/party/all')
      .then((res) => res.json())
      .then((data) => {
        setParties(data);

        if (data.length >= 2) {
          setSelectedParties([
            true,
            true,
            ...Array(data.length - 2).fill(false),
          ]);
        }

        setPartiesAreLoading(false);
      })

      .catch((err) => {
        setPartiesAreLoading(false);

        console.log(err);
      });

    fetch('http://localhost:1331/area/all')
      .then((res) => res.json())
      .then((data) => {
        setAreas(data);
        if (data.length >= 1) {
          setSelectedAreas([true, ...Array(data.length - 1).fill(false)]);
        }

        setAreasAreLoading(false);
      })
      .catch((err) => {
        setAreasAreLoading(false);
        console.log(err);
      });

    return () => {
      setParties([]);
      setAreas([]);
      setSelectedAreas([]);
      setSelectedParties([]);
      setAreasAreLoading(true);
      setPartiesAreLoading(true);
    };
  }, []);

  const handleStartElection = () => {
    const countSelectedParties = selectedParties.filter(
      (party) => party,
    ).length;
    const countSelectedAreas = selectedAreas.filter((area) => area).length;
    if (countSelectedParties < 2 || countSelectedAreas < 1) {
      alert('Please select at least two parties and one area');
      return;
    }
    if (
      electionDescription === '' ||
      electionName === '' ||
      conductedBy === '' ||
      Number(electionName) === 0 ||
      Number(electionDescription) === 0 ||
      Number(conductedBy) === 0
    ) {
      alert('Please fill in all the fields');
      return;
    }

    const election = {
      name: electionName,
      description: electionDescription,
      conductedBy: conductedBy,
      parties: parties.filter(
        (party, index) => selectedParties[index] && parties[index],
      ),
      areas: areas.filter(
        (area, index) => selectedAreas[index] && areas[index],
      ),
    };
    setElectionEnd(false);
    fetch('http://localhost:1331/election/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(election),
    })
      .then((res) => res.json())
      .then((datao) => {
        if (datao.success) {
          setElectionEnd(true);
          navigate('/elections');
        }
      })
      .catch((err) => {
        console.log(err);
        setElectionEnd(true);
        navigate('/elections');
      });
  };

  if (areasAreLoading || partiesAreLoading) {
    return <MessageModel message={'Loading ...'} />;
  }

  if (areas.length === 0) {
    return (
      <MessageModel>
        {' '}
        <p style={{ marginBottom: '10px' }}>
          There is no area <br />
          Please Create one{' '}
        </p>
        <div>
          <Link to="/createArea">
            <button className="btn btn-primary">
              {' '}
              <MdLibraryAdd /> Create Area
            </button>
          </Link>
        </div>
      </MessageModel>
    );
  }

  if (parties.length < 2) {
    return (
      <MessageModel>
        {' '}
        <p style={{ marginBottom: '10px' }}>
          Atleast two party needed <br />
          {parties.length === 0
            ? 'Please establish one'
            : 'Please establish one more'}
        </p>
        <div>
          <Link to="/createParty">
            <button className="btn btn-primary">
              {' '}
              <MdLibraryAdd /> Establish Party
            </button>
          </Link>
        </div>
      </MessageModel>
    );
  }

  if (!electionEnd) {
    return <MessageModel message={'Election is in progress'} />;
  }

  return (
    <div className="startElection">
      <h2 className="header">Lets have an Election</h2>
      <div className="form-group">
        <label htmlFor="electionName">Election Name</label>
        <input
          type="text"
          className="form-control"
          id="electionName"
          placeholder="Election Name"
          value={electionName}
          onChange={(e) => setElectionName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="electionName">Conducted By</label>
        <input
          type="text"
          className="form-control"
          id="electionName"
          placeholder="Conductor 1"
          value={conductedBy}
          onChange={(e) => setConductedBy(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="electionDescription">Election Description</label>
        <textarea
          className="form-control"
          id="electionDescription"
          rows="3"
          placeholder="Election Description"
          value={electionDescription}
          onChange={(e) => setElectionDescription(e.target.value)}
        />
      </div>
      <h3 className="sectionHeader">Select Areas</h3>
      {areas.length === 0 ? (
        <div className="message">no areas found </div>
      ) : (
        <div className="areas">
          {areas.map((area, i) => {
            return (
              <button
                className={`area ${selectedAreas[i] ? 'selected' : ''}`}
                key={area._id}
                onClick={() => {
                  selectedAreas[i] = !selectedAreas[i];
                  setSelectedAreas([...selectedAreas]);
                }}
              >
                <span className="areaName">
                  {giveSlicedText(area.name, 20)}
                </span>
                <span className="voters">
                  {giveSlicedText(area.currentVoters, 20)}
                </span>
              </button>
            );
          })}
        </div>
      )}{' '}
      <h3 className="sectionHeader">Select Parties</h3>
      {parties.length < 2 ? (
        <div className="message">need more parties </div>
      ) : (
        <div className="areas">
          {parties.map((party, i) => {
            return (
              <button
                className={`area ${selectedParties[i] ? 'selected' : ''}`}
                key={party._id}
                onClick={() => {
                  selectedParties[i] = !selectedParties[i];
                  setSelectedParties([...selectedParties]);
                }}
              >
                <span className="areaName">
                  {giveSlicedText(party.name, 20)}
                </span>
                <span className="voters">
                  {giveSlicedText(party.leader, 20) || 'leader'}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <button
        className="btn"
        style={{ marginTop: '20px' }}
        onClick={handleStartElection}
      >
        Start the Election
      </button>
    </div>
  );
}

function giveSlicedText(text, length) {
  return text.length > length ? text.slice(0, length) + '..' : text;
}
