import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

import './style.scss';
export default function Navbar() {
  const [isNavModelAtSmallScreen, setIsNavModelAtSmallScreen] =
    React.useState(false);
  const location = useLocation();
  return (
    <div className="navbar">
      {isNavModelAtSmallScreen && (
        <NavModelAtSmallScreen
          pathname={location.pathname}
          setIsNavModelAtSmallScreen={setIsNavModelAtSmallScreen}
        />
      )}

      <div className="brand">
        <h1>
          <Link to="/" className={location.pathname === '/' ? 'active' : 'd'}>
            Electron
          </Link>
        </h1>
      </div>

      <button
        className="menu"
        onClick={() => {
          setIsNavModelAtSmallScreen(!isNavModelAtSmallScreen);
        }}
      >
        <FiMenu />
      </button>

      <div className="navLinks">
        <Link to="/" className={location.pathname === '/' ? 'active' : 'd'}>
          Home
        </Link>
        <Link
          to="/visualization"
          className={location.pathname.includes('visual') ? 'active' : 'd'}
        >
          Visualization
        </Link>
        <Link
          to="/parties"
          className={location.pathname === '/parties' ? 'active' : 'd'}
        >
          Parties
        </Link>
        <Link
          to="/areas"
          className={location.pathname === '/areas' ? 'active' : 'd'}
        >
          Areas
        </Link>
        <Link
          to="/elections"
          className={location.pathname === '/elections' ? 'active' : 'd'}
        >
          Elections
        </Link>

        <Link
          to="/about"
          className={location.pathname === '/about' ? 'active' : 'd'}
        >
          About
        </Link>
      </div>
    </div>
  );
}

function NavModelAtSmallScreen({ setIsNavModelAtSmallScreen, pathname }) {
  return (
    <div className="navModelAtSmallScreen">
      <div className="header">
        <div className="brand">
          <h1>
            <Link
              to="/"
              onClick={() => {
                setIsNavModelAtSmallScreen(false);
              }}
            >
              Electron
            </Link>
          </h1>
        </div>

        <button
          className="menu"
          onClick={() => {
            setIsNavModelAtSmallScreen(false);
          }}
        >
          <FaTimes />
        </button>
      </div>

      <div className=" model_navLinks">
        <Link
          to="/"
          className={pathname === '/' ? 'active' : 'd'}
          onClick={() => {
            setIsNavModelAtSmallScreen(false);
          }}
        >
          Home
        </Link>
        <Link
          to="/visualization"
          className={pathname.includes('visual') ? 'active' : 'notActive'}
          onClick={() => {
            setIsNavModelAtSmallScreen(false);
          }}
        >
          Visualization
        </Link>
        <Link
          to="/parties"
          className={pathname === '/parties' ? 'active' : 'd'}
          onClick={() => {
            setIsNavModelAtSmallScreen(false);
          }}
        >
          Parties
        </Link>
        <Link
          to="/areas"
          className={pathname === '/areas' ? 'active' : 'd'}
          onClick={() => {
            setIsNavModelAtSmallScreen(false);
          }}
        >
          Areas
        </Link>
        <Link
          to="/elections"
          className={pathname === '/elections' ? 'active' : 'd'}
          onClick={() => {
            setIsNavModelAtSmallScreen(false);
          }}
        >
          Elections
        </Link>
        <Link
          to="/about"
          className={pathname === '/about' ? 'active' : 'd'}
          onClick={() => {
            setIsNavModelAtSmallScreen(false);
          }}
        >
          About
        </Link>
      </div>
    </div>
  );
}
