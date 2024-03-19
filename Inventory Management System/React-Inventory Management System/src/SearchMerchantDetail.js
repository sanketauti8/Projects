import React, { useState, useEffect } from 'react';
import GetMerchantDetail from './GetMerchantDetail';
import MerchantDetail from './MerchantDetail'



const SearchMerchantDetail = () => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
      };
      const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputValue)
      };
  
  return (
  
    <div>
    <form  onSubmit={handleSubmit}>
      <label>
        Input value:
        <input type="text" value={inputValue} onChange={handleInputChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
    
  </div>
 
  )
}

export default SearchMerchantDetail;
