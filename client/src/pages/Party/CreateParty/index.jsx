import React, { useState, useEffect } from 'react';
import MessageModel from '../../../components/MessageModel';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './style.scss';

export default function CreateParty() {
  const [partyName, setPartyName] = useState('party name');
  const [partyDescription, setPartyDescription] = useState('party description');
  const [partyLeaderName, setPartyLeaderName] = useState('party leader name');
  const [creatingParty, setCreatingParty] = useState(false);
  // const history = useHistory();
  const navigate = useNavigate();

  const onSubmitCreateParty = (e) => {
    e.preventDefault();

    if (
      partyName === '' ||
      partyDescription === '' ||
      partyLeaderName === '' ||
      Number(partyName) === 0 ||
      Number(partyLeaderName) === 0 ||
      Number(partyDescription) === 0
    ) {
      alert('Please fill all fields');
      return;
    }

    setCreatingParty(true);
    fetch('http://localhost:1331/party/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        partyDescription,
        partyName,
        partyLeaderName,
        createdAt: new Date(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCreatingParty(false);
          navigate('/parties');
        } else {
          setCreatingParty(false);
          alert(data.message);
        }

        // if (data.status) {
        //   history.push('/areas');
        // }
      })
      .catch((err) => console.log(err));
  };

  if (creatingParty) {
    return <MessageModel message={'Creating Party...'} />;
  }

  return (
    <div className="createParty">
      <h2 className="header">Create Party</h2>

      <form onSubmit={onSubmitCreateParty}>
        <div className="form-group">
          <label>Party Name</label>
          <input
            type="text"
            className="form-control"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Leader Name</label>
          <input
            type="text"
            className="form-control"
            value={partyLeaderName}
            onChange={(e) => setPartyLeaderName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Party Description</label>
          <textarea
            className="form-control"
            value={partyDescription}
            onChange={(e) => setPartyDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="submit"
            value="Create Party"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
