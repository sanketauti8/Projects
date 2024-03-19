import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios library

function CampgroundList() {
  const [campgrounds, setCampgrounds] = useState([]);
  
  useEffect(() => {
    // Fetch campgrounds data from Express backend
    axios.get('http://localhost:8800/campinfo')
      .then(response => {
        setCampgrounds(response.data);
        console.log('Campgrounds data:', response.data); // Log the received data
      })
      .catch(error => {
        console.error('Error fetching campgrounds:', error);
      });
  }, []);
  
  return (
    <div style={{ backgroundColor:'#73DB49'}}>
    
    <div  style={{ display: 'inline-block', padding: '10px', margin: '5px', backgroundColor:'#b3ffb3'}}>
      <ul>
        {campgrounds.map(campground => (
          <li style={{paddingBottom: '4px', color: '#333333', border: '1px solid #3c9e3c',  fontWeight: 'bold'}} key={campground._id}>
          <div>{campground.name} - {campground.location} - {campground._id}</div>
          <br></br>
           <img style={{border:'2px solid #8a2be2'}} src={campground.images} alt="Girl in a jacket" width="400" height="300"></img>
           </li>
        ))}
      </ul>
   
    </div>
    </div>
  );
}

export default CampgroundList;



/**
 *{
          campgrounds.map(cmp=>(
            <img src="{{cmp.images}} "alt="Girl in a jacket" width="500" height="600"></img>
          ))

        }
           {
          campgrounds.map(cmp=>(
            <img src={cmp.images} alt="Girl in a jacket" width="300" height="200"></img>
          ))

        }
 * 
 */