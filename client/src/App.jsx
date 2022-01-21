import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

import ShowAreas from './pages/Area/ShowAreas';
import CreateArea from './pages/Area/CreateArea';
import EditArea from './pages/Area/EditArea';
import VisualizeArea from './pages/Visualization/Area';

import ShowParties from './pages/Party/ShowParties';
import CreateParty from './pages/Party/CreateParty';
import EditParty from './pages/Party/EditParty';
import VisualizeParty from './pages/Visualization/Party';

import ShowElections from './pages/Election/ShowElections';
import StartElection from './pages/Election/StartElection';
import VisualizeElection from './pages/Visualization/Election';

import Home from './pages/Home';
import Visualization from './pages/Visualization/OverAll';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="" style={{ height: '10px' }}></div>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/visualization" element={<Visualization />} />

        <Route exact path="/elections" element={<ShowElections />} />
        <Route exact path="/startElection" element={<StartElection />} />
        <Route
          exact
          path="/visualizeElection/:id"
          element={<VisualizeElection />}
        />

        <Route exact path="/areas" element={<ShowAreas />} />
        <Route exact path="/createArea" element={<CreateArea />} />
        <Route exact path="/editArea/:id" element={<EditArea />} />
        <Route exact path="/visualizeArea/:id" element={<VisualizeArea />} />

        <Route exact path="/parties" element={<ShowParties />} />
        <Route exact path="/createParty" element={<CreateParty />} />
        <Route exact path="/editParty/:id" element={<EditParty />} />
        <Route exact path="/visualizeParty/:id" element={<VisualizeParty />} />
        <Route exact path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
