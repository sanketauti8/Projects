
//import React, { useState, useEffect } from 'react';
//import axios from 'axios'; // Import Axios library
import TotalPrice from './TotalPrice';
import CampgroundList from './CampgroundList';
import { RegisterNewCampground } from './RegisterNewCampground';
import BookCampGround from './BookCampGround';
import ShowAllAvailableCamps from './ShowAllAvailableCamps';
import GetCampInfo from './GetCampInfo';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function App() {
  return (
    <>

    <div className='App' style={{border:'3px solid violet', backgroundColor:'#c4f2de'}}>
    <Router>
    <h1>Campgrounds</h1>
      <tr>
        <th style={{ paddingRight: '20px' }}><Link to={"/"}>Campground List</Link></th>
        <th style={{ paddingRight: '20px' }}><Link to={"/registernewcampground"}>Register New Campground</Link></th>
        <th style={{ paddingRight: '20px' }}><Link to={"/getprice"}>Calculate Price</Link></th>
        <th style={{ paddingRight: '20px' }}><Link to={"/getcampinfo"}>Get Camp Info</Link></th>
        <th style={{ paddingRight: '20px' }}><Link to={"/bookcamp"}>Book Campground</Link></th>
        <th style={{ paddingRight: '20px' }}><Link to={"/showavailcamps"}>Show Available Campgrounds</Link></th>
      </tr>
      <Routes>
        <Route path='/' element={<CampgroundList/>}></Route>
        <Route path='/registernewcampground' element={<RegisterNewCampground/>}></Route>
        <Route path='/getprice' element={<TotalPrice/>}></Route>
        <Route path='/getcampinfo' element={<GetCampInfo/>}></Route>
        <Route path='/bookcamp' element={<BookCampGround/>}></Route>
        <Route path='/showavailcamps' element={<ShowAllAvailableCamps/>}></Route>
      </Routes>
  </Router>
  </div>

  </>
  );
}

export default App;


/**  <Router>
    <div className='App'>
      <ul>
        <li><Link to={"/"}>Campground List</Link></li>
        <li><Link to={"/registernewcampground"}>Register New Campground</Link></li>
        <li><Link to={"/getprice"}>Calculate Price</Link></li>
      </ul>
      <Routes>
        <Route path='/' element={<CampgroundList/>}></Route>
        <Route path='/registernewcampground' element={<RegisterNewCampground/>}></Route>
        <Route path='/getprice' element={<TotalPrice/>}></Route>
      </Routes>

    </div>

  </Router> */