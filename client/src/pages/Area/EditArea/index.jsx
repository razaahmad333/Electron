import React, { useState, useEffect } from 'react';
import MessageModel from '../../../components/MessageModel';
import { useNavigate, useParams } from 'react-router-dom';
import './style.scss';

export default function EditArea() {
  const [areaName, setAreaName] = useState(undefined);
  const [areaDescription, setAreaDescription] = useState('area description');
  const [editingArea, setEditingArea] = useState(false);
  const [voters, setVoters] = useState(500);
  const [areaLoading, setAreaLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    fetch('http://localhost:1331/area/byId/' + id)
      .then((res) => res.json())
      .then((data) => {
        setAreaName(data.name);
        setAreaDescription(data.description);
        setVoters(data.currentVoters);
        setAreaLoading(false);
      });

    return () => {
      setAreaName('');
      setAreaDescription('');
      setVoters('');

      // cleanup
    };
  }, []);

  const onSubmitEditArea = (e) => {
    e.preventDefault();
    if ((voters < 10) | !voters) {
      alert('Please enter a valid number of voters');
      return;
    }

    if (
      areaName === '' ||
      areaDescription === '' ||
      Number(areaName) === 0 ||
      Number(areaDescription) === 0
    ) {
      alert('Please fill all fields');
      return;
    }

    setEditingArea(true);

    fetch('http://localhost:1331/area/edit/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        areaDescription,
        areaName,
        currentVoters: voters,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEditingArea(false);
          navigate('/areas');
        } else {
          setEditingArea(false);
          alert(data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  if (editingArea) {
    return <MessageModel message={'Editing area'} />;
  }

  if (areaLoading) {
    return <MessageModel message={'Loading area'} />;
  }

  return (
    <div className="editArea">
      <h2 className="header">Edit Area</h2>

      <form onSubmit={onSubmitEditArea}>
        <div className="form-group">
          <label>Area Name</label>
          <input
            type="text"
            className="form-control"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Number Of Voters</label>
          <input
            type="number"
            className="form-control"
            value={voters}
            onChange={(e) => setVoters(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Area Description</label>
          <textarea
            className="form-control"
            value={areaDescription}
            onChange={(e) => setAreaDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input type="submit" value="Edit Area" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}
