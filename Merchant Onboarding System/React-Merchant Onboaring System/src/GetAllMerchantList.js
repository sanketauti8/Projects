import React, { useState, useEffect } from 'react';

export function GetWholeMerchantList(){

    const[user,setUser]=useState([]);

    const fetchData=()=>{
        return fetch('http://127.0.0.1:5000/merchant')
        .then(response=>response.json())
        .then(data=>{
            console.log(data.Merchant_List)
            setUser(data.Merchant_List)
        });
    }

    useEffect(()=>{
        fetchData();
    },[])

return(
    <>
    <h1>Merchant Details</h1>
    <table cellPadding="25" border="2">
            <thead>
            <tr >
              <th>Merchant_name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Shop_name</th>
              <th>Authorize_merchant</th>
              <th>Line1</th>
              <th>State</th>
              <th>Zip</th>
              <th>Country</th>
              <th>password</th>
          </tr>
          </thead>
          <tbody>
          {user.map(product => (
            <tr key={product.merchant_name}>
                <td> {product.merchant_name}</td>
                <td> {product.contact}</td>
                <td> {product.email}</td>
                <td>{product.shop_name}</td>
                <td> {product.authorize_merchant ?<h3><i class="large green checkmark icon"></i>Admin</h3> : <h3><i class="large red icon close"></i>Admin</h3>}</td>
                <td> {product.line1}</td>
                <td>{product.state}</td>
                <td>{product.zip}</td>
                <td>{product.country}</td>
                <td>{product.password}</td>
            </tr>
          ))}
          </tbody>
          </table>
    
    </>
)



}



const GetAllMerchantList = () => {
  return (
    <div>
      <GetWholeMerchantList/>
    </div>
  )
}

export default GetAllMerchantList
