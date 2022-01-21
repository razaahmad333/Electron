import React from 'react';
import smile from './smile.svg';
import {
  AiOutlineGithub,
  AiOutlineLinkedin,
  AiOutlineTwitter,
} from 'react-icons/ai';
import { BsDot } from 'react-icons/bs';
import './style.scss';
export default function About() {
  const properties = [
    'React.js',
    'Next.js',
    'Front end',
    'Back end',
    'Javascript',
    'Typescript',
  ];
  return (
    <div className="about">
      <div className="smile">
        <img src={smile} alt="smile" />
      </div>

      <div className="detail">
        <h1 className="hii">Hii, I'm Ahmad Raza</h1>
        {/* <div className="name">My self Ahmad Raza</div> */}

        <div className="aboutApp">
          I made this web application to practice my MERN stack skills ft.
          Chart.js
          <br />I was a nice experience and it only take four days
          <br />
          Web development is difficult, only then it is fun to do. You just have
          to set your standards. If it were to be easy, would anyone do it?
        </div>
        <div className="im">I am a web developer</div>
        <div className="listOfProp">
          {properties.map((prop, i) => (
            <span className="prop" key={i}>
              <span className="dot">
                <BsDot />
              </span>
              {prop}
            </span>
          ))}
        </div>

        <div className="contactLinks">
          <a href="https://www.twitter.com/@AHMADRa01256865">
            <AiOutlineTwitter />
          </a>
          <a href="https://www.linkedin.com/in/ahmad-raza-18835715b/">
            <AiOutlineLinkedin />
          </a>
          <a href="https://www.github.com/razaahmad333">
            <AiOutlineGithub />
          </a>
        </div>
      </div>
    </div>
  );
}
