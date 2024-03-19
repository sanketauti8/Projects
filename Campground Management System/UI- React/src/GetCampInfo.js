import React, { useState } from 'react';
import axios from 'axios';

export const GetCampInfo = () => {
    const [campgroundId, setCampgroundId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [campgrounds, setCampgrounds] = useState([]);

    const handleCalculate = async () => {
        try {
            const response = await axios.get(`http://localhost:8800/campinfoid/${campgroundId}`);
            console.log(response.data)
            setCampgrounds(response.data);
            setErrorMessage(''); // Clear error message if successful
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    };

  return (
    <div>
    <h2>Camp Details:</h2>

    <div>
        <label htmlFor="campgroundId">Campground ID: </label>
        <input
            type="text"
            id="campgroundId"
            value={campgroundId}
            onChange={(e) => setCampgroundId(e.target.value)}
        /><br></br>
          <button  onClick={handleCalculate}>Show Details</button>
    </div>
  
    {campgrounds.length > 0 ? (
    <div style={{ display: 'inline-block', padding: '10px', margin: '5px', backgroundColor:'#b3ffb3'}} >
        {campgrounds.map(campground => (
            <div key={campground._id}>
                <p>Id: {campground._id}</p>
                <p>Name: {campground.name}</p>
                <p>location: {campground.location}</p>
                <p>description: {campground.description}</p>
                <p>amenities: {campground.amenities}</p>
                <p>email: {campground.email}</p>
                <p>phone: {campground.phone}</p>
                <p>price: {campground.price}</p>
                <p>rating: {campground.rating}</p>
                <p>reviews: {campground.reviews}</p>
                <p>reserved:  {campground.reserved ? 'Yes' : 'No'}e</p>
                <p>pincode: {campground.pincode}</p>
                <p>Available On: {campground.isAvailable}</p>
                <img src={campground.images} style={{border:'2px solid #8a2be2'}} width="300" height="200"></img>
                
            </div>
        ))}
    </div>
) : (
    <p style={{backgroundColor:'Red'}}>No campground found</p>
)}
</div>
  )
}


export default GetCampInfo;