import React, { useState, useEffect } from 'react';
import MessageModel from '../../../components/MessageModel';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './style.scss';

export default function CreateArea() {
  const [areaName, setAreaName] = useState('area name');
  const [areaDescription, setAreaDescription] = useState('area description');
  const [creatingArea, setCreatingArea] = useState(false);
  const [voters, setVoters] = useState(500);
  // const history = useHistory();
  const navigate = useNavigate();

  const onSubmitCreateArea = (e) => {
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

    setCreatingArea(true);
    fetch('http://localhost:1331/area/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        areaDescription,
        areaName,
        currentVoters: voters,
        createdAt: new Date(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCreatingArea(false);
          navigate('/areas');
        } else {
          setCreatingArea(false);
          alert(data.message);
        }

        // if (data.status) {
        //   history.push('/areas');
        // }
      })
      .catch((err) => console.log(err));
  };

  if (creatingArea) {
    return <MessageModel message={'Creating area'} />;
  }

  return (
    <div className="createArea">
      <h2 className="header">Create Area</h2>

      <form onSubmit={onSubmitCreateArea}>
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
          <input
            type="submit"
            value="Create Area"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
