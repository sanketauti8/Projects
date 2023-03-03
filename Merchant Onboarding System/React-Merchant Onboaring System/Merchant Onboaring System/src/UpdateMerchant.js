import React, { useState } from 'react';

const UpdateMerchant = () => {
    const [inputValue, setInputValue] = useState('');
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
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(response => response.json())
      .then(data => console.log(data.message))
      .catch(error => console.error(error));
      setShowSuccess(true);
  }
  const handleInput = (event) => {
    setInputValue(event.target.value);
  };
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log(inputValue)
//   };
  return (
    <>
    <form class="ui fluid form" onSubmit={handleSubmit}>
        <h2>Update Merchant Details</h2>
        <label htmlFor="Contact">Enter Contact No for which you want Update Details:</label>
        <input placeholder="Enter Contact No"  type="text" value={inputValue} onChange={handleInput} />
      <div>
        <label htmlFor="merchant_name">Merchant_name:</label>
        <input type="text" placeholder="merchant_name" name="merchant_name" value={product.merchant_name} onChange={handleChange}  />
      </div>
      <div>
        <label htmlFor="shop_name">Shop_name:</label>
        <input type="text" placeholder="shop_name" name="shop_name" value={product.shop_name} onChange={handleChange}  />
      </div>
      <div>
        <label htmlFor="line1">Address:</label>
        <input type="text" placeholder="line1" name="line1" value={product.line1} onChange={handleChange}  />
      </div>
      <div>
        <label htmlFor="state">State:</label>
        <input type="text" placeholder="state" name="state" value={product.state} onChange={handleChange}  />
      </div>
      <div>
        <label htmlFor="zip">Zip:</label>
        <input type="text" placeholder="zip" name="zip" value={product.zip} onChange={handleChange}  />
      </div>
      <div>
        <label htmlFor="country">Country:</label>
        <input type="text" placeholder="country" name="country" value={product.country} onChange={handleChange}  />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="text" placeholder="email" name="email" value={product.email} onChange={handleChange}  />
      </div>
      <button class="ui green basic button" type="submit">Update</button>
    </form>
      {showSuccess && (
        <div className="success-popup">
          <p>Details Updated successfully!</p>
          <button class="ui red basic button" onClick={() => setShowSuccess(false)}>Close</button>
        </div>
        )}
        </>
  );
}

export default UpdateMerchant;
