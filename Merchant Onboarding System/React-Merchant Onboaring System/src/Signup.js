
import React, { useState, useEffect } from 'react';

const Signup = () => {

    const [formData, setFormData] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const handleSubmit = async (e) => { 
        e.preventDefault();
        try {
          const response = await fetch('http://127.0.0.1:5000/merchant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          const data = await response.json();
          console.log(data);
          setShowSuccess(true); // set showSuccess to true after successful submit
        } catch (error) {
          console.error(error);
        }
      };
      const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      useEffect(() => {
        <h1>User Registered</h1>
      }, [formData]);
      
      
      return (
        <>
        <form class="ui fluid form" onSubmit={handleSubmit}>
          <label htmlFor="contact">Contact:</label>
          <input type="text" id="contact" name="contact" onChange={handleInputChange} /><br/>
      
          <label htmlFor="merchant_name">Merchant Name:</label>
          <input type="text" id="merchant_name" name="merchant_name" onChange={handleInputChange} /><br/>
      
          <label htmlFor="shop_name">shop_name:</label>
          <input type="text" id="shop_name" name="shop_name" onChange={handleInputChange} /><br/>

          <label htmlFor="line1">line1:</label>
          <input type="text" id="line1" name="line1" onChange={handleInputChange} /><br/>
      
          <label htmlFor="state">state:</label>
          <input type="text" id="state" name="state" onChange={handleInputChange} /><br/>
      
          <label htmlFor="zip">zip:</label>
          <input type="text" id="zip" name="zip" onChange={handleInputChange} /><br/>
      
          <label htmlFor="country">country:</label>
          <input type="text" id="country" name="country" onChange={handleInputChange} /><br/>
      
          <label htmlFor="email">email:</label>
          <input type="text" id="email" name="email" onChange={handleInputChange} /><br/>
      
          <label htmlFor="password">password:</label>
          <input type="text" id="password" name="password" onChange={handleInputChange} /><br/>
      
          <button class="ui green basic button" type="submit">Submit</button>
        </form>
        {showSuccess && (
            <div className="success-popup">
              <p>Merchant onboarded successfully!</p>
              <button class="ui red basic button" onClick={() => setShowSuccess(false)}>Close</button>
            </div>
            )}
             </>
      );
      
}

export default Signup;
