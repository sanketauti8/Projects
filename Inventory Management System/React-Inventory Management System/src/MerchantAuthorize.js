
import React, { useState, useEffect } from 'react';
const MerchantAuthorize = () => {const [inputValue, setInputValue] = useState('');
const [showSuccess, setShowSuccess] = useState(false);
const [product, setProduct] = useState({});
const phoneNo = inputValue;
const handleChange = (e) => {
const { name, value } = e.target;
setProduct(prevState => ({ ...prevState, [name]: value }));
}

const handleSubmit = (e) => {
e.preventDefault();
const url = `http://127.0.0.1:5000/merchant/${phoneNo}`;
fetch(url, {
  method: ['PUT'] ,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(product)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
  setShowSuccess(true);
}
const handleInput = (event) => {
setInputValue(event.target.value);
};
return (
<>
<form class="ui fluid form" onSubmit={handleSubmit}>
    <h2>Authorize</h2>
    <label htmlFor="Contact">Enter Contact No for which you want to Authorize:</label>
    <input placeholder="Enter Contact No"  type="text" value={inputValue} onChange={handleInput} />

  <button class="ui blue basic button" type="submit">Authorize Merchant</button>
</form>
  {showSuccess && (
    <div className="success-popup">
      <p>Congratulations! Merchant is Authorize Now</p>
      <button class="ui red basic button" onClick={() => setShowSuccess(false)}>Close</button>
    </div>
    )}
    </>
)
}


export default MerchantAuthorize
