
import React, { useState } from 'react';
import axios from 'axios';

export const TotalPrice = () => {

    const [noOfPeople, setNoOfPeople] = useState(0);
    const [campgroundId, setCampgroundId] = useState('');
    const [totalPrice, setTotalPrice] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCalculate = async () => {
        try {
            const response = await axios.get(`http://localhost:8800/reservationprice/${noOfPeople}/${campgroundId}`);
            setTotalPrice(response.data.message);
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    };

  return (
    <div>
    <h2>Calculate Reservation Price</h2>
    <div>
        <label htmlFor="noOfPeople">Number of People: </label>
        <input
            type="number"
            id="noOfPeople"
            value={noOfPeople}
            onChange={(e) => setNoOfPeople(e.target.value)}
        />
    </div>
    <div>
        <label htmlFor="campgroundId">Campground ID: </label>
        <input
            type="text"
            id="campgroundId"
            value={campgroundId}
            onChange={(e) => setCampgroundId(e.target.value)}
        />
    </div>
    <button onClick={handleCalculate}>Calculate</button>
    {totalPrice && <p>{totalPrice}</p>}
    {errorMessage && <p>{errorMessage}</p>}
</div>
  )
}

export default TotalPrice;