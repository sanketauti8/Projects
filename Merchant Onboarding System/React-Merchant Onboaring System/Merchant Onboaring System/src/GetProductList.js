import React, { useState, useEffect } from 'react';

export function GetAllProductList() {
    const [user, setUser] = useState([]);
    const [phoneValue, setInputValue] = useState('');
    const phoneNo = phoneValue;
    console.log(phoneNo);


    const fetchData = () => {
      console.log("inside Fetch data");
      console.log(phoneNo);
      const url=`http://127.0.0.1:5000/product/${phoneNo}`;
      return fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log(data.Product_List.contact_id)
          setUser(data.Product_List);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  
    // useEffect(() => {
    //   fetchData();
    // }, [])
  
    const handleInputChange = (event) => {
      console.log("handleInputChange in");
      setInputValue(event.target.value);
    };
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log(phoneValue)
    };

    function HandleClick(){
      console.log("submit button clicked");
      setInputValue(phoneValue)
      fetchData();
    }
    return (
      <>
        <h1>Product LIST</h1>
      <form  onSubmit={handleSubmit}>
        <div class="ui icon input">
        <input placeholder="Enter Contact No"  type="text" value={phoneValue} onChange={handleInputChange} />
        <i class="circular search link icon" onClick={HandleClick}></i>
        </div>
      </form>
            <table cellPadding="25" border="2">
            <thead>
            <tr >
              <th>Product_id</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Weight</th>
              <th>Quantity</th>
              <th>Exp_date</th>
              <th>Contact_id</th>
          </tr>
          </thead>
          <tbody>
          {user.map(product => (
            <tr key={product.product_id}>
                <td> {product.product_id}</td>
                <td> {product.product_name}</td>
                <td>{product.price}</td>
                <td>{product.weight}</td>
                <td> {product.quantity}</td>
                <td>{product.exp_date}</td>
                <td>{product.contact_id}</td>
            </tr>
          ))}
          </tbody>
          </table>
      </>
    );
  }

  const GetProductList = () => {
    return (
      <div>
        <GetAllProductList/>
      </div>
    )
  }
  



  export default GetProductList;

  