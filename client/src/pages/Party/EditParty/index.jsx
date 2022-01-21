import React, { useState, useEffect } from 'react';
import MessageModel from '../../../components/MessageModel';
import { useNavigate, useParams } from 'react-router-dom';
import './style.scss';

export default function EditParty() {
  const [partyName, setPartyName] = useState(undefined);
  const [partyDescription, setPartyDescription] = useState('party description');
  const [partyLeaderName, setPartyLeaderName] = useState('party leader name');
  const [editingParty, setEditingParty] = useState(false);
  const [partyLoading, setPartyLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    fetch('http://localhost:1331/party/byId/' + id)
      .then((res) => res.json())
      .then((data) => {
        setPartyName(data.name);
        setPartyDescription(data.description);
        setPartyLeaderName(data.leader);
        setPartyLoading(false);
      });

    return () => {
      setPartyName('');
      setPartyDescription('');
      setPartyLeaderName('');

      // cleanup
    };
  }, []);

  const onSubmitEditParty = (e) => {
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

    setEditingParty(true);

    fetch('http://localhost:1331/party/edit/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        partyDescription,
        partyName,
        partyLeaderName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEditingParty(false);
          navigate('/parties');
        } else {
          setEditingParty(false);
          alert(data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  if (editingParty) {
    return <MessageModel message={'Editing party...'} />;
  }

  if (partyLoading) {
    return <MessageModel message={'Loading party...'} />;
  }

  return (
    <div className="editParty">
      <h2 className="header">Edit Party</h2>

      <form onSubmit={onSubmitEditParty}>
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
          <input type="submit" value="Edit Party" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}
