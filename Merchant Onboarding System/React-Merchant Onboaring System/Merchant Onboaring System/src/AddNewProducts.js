import React, { useState } from 'react';

function AddNewProducts() {
    const [inputValue, setInputValue] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
  const [product, setProduct] = useState({
    product_name: '',
    price: '',
    quantity: '',
    exp_date: '',
    weight: ''
  });
  const phoneNo = inputValue;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({ ...prevState, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `http://127.0.0.1:5000/product/${phoneNo}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000'
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
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log(inputValue)
//   };
  return (
    <>
    <form class="ui fluid form" onSubmit={handleSubmit}>
        <h2>Add a Product</h2>
        <label htmlFor="Contact">Enter Contact No for which you want to add product:</label>
        <input placeholder="Enter Contact No"  type="text" value={inputValue} onChange={handleInput} />
        
      <div>
        <label htmlFor="product_name">Product Name:</label>
        <input type="text" placeholder="product_name" name="product_name" value={product.product_name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input type="number" placeholder="price" name="price" value={product.price} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input type="number" placeholder="quantity" name="quantity" value={product.quantity} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="exp_date">Expiration Date:</label>
        <input type="text" placeholder="dd/mm/yyyy " name="exp_date" value={product.exp_date} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="weight">Weight:</label>
        <input type="text" placeholder="weight" name="weight" value={product.weight} onChange={handleChange} required />
      </div>
      <button class="ui green basic button" type="submit">Add Product</button>
    </form>
      {showSuccess && (
        <div className="success-popup">
          <p>Product Added successfully!</p>
          <button class="ui red basic button" onClick={() => setShowSuccess(false)}>Close</button>
        </div>
        )}
        </>
  );
}

export default AddNewProducts;
