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
export default function ShowAreas() {
  const [areas, setAreas] = useState([]);
  const [areaIsLoading, setAreaIsLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:1331/area/all')
      .then((res) => res.json())
      .then((data) => {
        setAreas(data);
        setAreaIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAreaIsLoading(false);
      });

    return () => {
      setAreas([]);
      setAreaIsLoading(true);
    };
  }, []);

  if (areaIsLoading) {
    return <MessageModel message={'Areas are loading ...'} />;
  }

  if (areas.length === 0 && !areaIsLoading) {
    return (
      <MessageModel>
        {' '}
        <p style={{ marginBottom: '10px' }}>No areas found</p>
        <div>
          <Link to="/createArea">
            <button className="btn btn-primary">
              {' '}
              <MdLibraryAdd /> Add Area
            </button>
          </Link>
        </div>
      </MessageModel>
    );
  }

  return (
    <div className="showAreas">
      <div className="pageHeader">
        <h2>
          Areas <span className="count">{'  (' + areas.length + ')'}</span>{' '}
        </h2>
        <Link to="/createArea">
          <button className="btn btn-primary">
            {' '}
            <MdLibraryAdd /> Add Area
          </button>
        </Link>
      </div>

      {areas.length === 0 ? (
        <Loading />
      ) : (
        <div className="areas">
          {areas.map((area) => (
            <div className="area" key={area._id}>
              <div className="details">
                <h3 className="name">{area.name}</h3>
                <p className="desc">
                  {area.description.length > 100
                    ? area.description.slice(0, 100) + '...'
                    : area.description}
                </p>
                <p>
                  <b>Current Population: </b> {area.currentVoters}
                </p>
                <p>
                  <b>Total election held : </b>
                  {area.elections ? area.elections.length : 0}
                </p>
                <p>
                  <b>Established on : </b>
                  {String(new Date(area.createdAt))
                    .split(' ')
                    .slice(0, 4)
                    .join(' ') || '11/02/22'}
                </p>
              </div>
              <div className="actionLinks">
                <Link to={`/visualizeArea/${area._id}`}>
                  <button className="btn btn_small btn-primary">
                    <BiStats />
                    Visualize
                  </button>
                </Link>

                <Link to={`/editArea/${area._id}`}>
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
