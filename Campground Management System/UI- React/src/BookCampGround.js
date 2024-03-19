import React, { useState } from 'react';
import axios from 'axios';

const BookCampGround = () => {
    const [campgroundId, setCampgroundId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [campgrounds, setCampgrounds] = useState([]);

    const handleCalculate = async () => {
        try {
            const response = await axios.get(`http://localhost:8800/bookcampground/${campgroundId}`);
            console.log(response.data)
            setCampgrounds(response.data);
            //setErrorMessage(''); // Clear error message if successful
        } catch (error) {
            setErrorMessage('Invalid Campground ID');
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
    </div>
    <div>
    <button  onClick={handleCalculate}>Book Now</button>
    {campgrounds.message ? (
        // Content to render if campgrounds.message is present
        <p>{campgrounds.message}</p>
    ) : (
        // Content to render if campgrounds.message is not present
        <p>{errorMessage}</p>
    )}
</div>
       

    </div>
   
 
  )
}
export default BookCampGround;