import React, { useState } from 'react'
import axios from 'axios';

export const RegisterNewCampground = () => {
const [formData,setFormData]=useState({
    name: '',
    location: '',
    description: '',
    amenities: '',
    email: '',
    phone: '',
    price: '',
    rating: '',
    images: '',
    pincode: ''
});

const handleSubmit=async()=>{

    try{
        const response= await axios.post('http://localhost:8800/campinfo',formData);
        console.log('Response',response.data);
          // Reset form data after successful submission
      setFormData({
        name: '',
        location: '',
        description: '',
        amenities: '',
        email: '',
        phone: '',
        price: '',
        rating: '',
        images: '',
        pincode: ''
      });

    }catch(e){
        console.error('Error submitting form:',e);
    }
    
};


const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
}

  return (
    <>
    <h2>Register New Campground</h2>

    <div>
        Name: <input type='text' id='name' value={formData.name} onChange={handleChange}></input><br></br>
        Location: <input type='text' id='location' value={formData.location} onChange={handleChange}></input><br></br>
        Description: <input type='text' id='description' value={formData.description} onChange={handleChange}></input><br></br>
        Amenities: <input type='text' id='amenities' value={formData.amenities} onChange={handleChange}></input><br></br>
        Email: <input type='text' id='email' value={formData.email} onChange={handleChange}></input><br></br>
        Phone: <input type='text' id='phone' value={formData.phone} onChange={handleChange}></input><br></br>
        Price: <input type='text' id='price' value={formData.price} onChange={handleChange}></input><br></br>
        Rating: <input type='text' id='rating' value={formData.rating} onChange={handleChange}></input><br></br>
        Images: <input type='text' id='images' value={formData.images} onChange={handleChange}></input><br></br>
        Pincode: <input type='text' id='pincode' value={formData.pincode} onChange={handleChange}></input><br></br>
        <button type="button" onClick={handleSubmit}>Register</button>
      </div>

        
        </>
  )
}
