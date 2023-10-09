import logo from './logo.svg';
import CampusForm from './Input'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Edit from './Edit'
import Input from './Input'


import './App.css';

function App() {
  return (
   
     <Router>
      <Routes>
        <Route path="/edit/:id/" element={<Edit />} />
        <Route path="/create/:name" element={<Input />} />
      
      </Routes>
    </Router>
      
      );
}

export default App;
