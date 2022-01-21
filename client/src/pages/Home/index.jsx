import React from 'react';
import { Link } from 'react-router-dom';
// import { GiVote } from 'react-icons';
import { MdHowToVote } from 'react-icons/md';

import './style.scss';
export default function Home() {
  return (
    <div className="home">
      <div className="hero heroAtTop ">
        <MdHowToVote />
      </div>
      <div className="home__header">
        <div className="header">Electron</div>
        <div className="subHeader">
          A web application for election administration
        </div>
        <div className="subHeader2">
          A toy project for learning and practicing React Express MongoDB NodeJs
          Sass ChartJs basically MERN stack
          <br />
          Conduct your own election and visualize it
          <br />
          Create
          <Link to="/createArea">
            <span className="link"> Areas</span>
          </Link>
          and
          <Link to="/createParty">
            <span className="link"> Parties</span>
          </Link>
          to start an election
        </div>
      </div>
      <div className="hero heroAtDown">
        <MdHowToVote />
      </div>
    </div>
  );
}
