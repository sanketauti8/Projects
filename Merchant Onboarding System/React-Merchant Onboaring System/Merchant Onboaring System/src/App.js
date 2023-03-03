import React, { useState, useEffect } from 'react';
import GetProductList from './GetProductList'
import AllProducts from './AllProducts'
import MerchantDetail from './MerchantDetail'
import SignupButton from './SignupButton';
import AllMerchantList from './AllMerchantList' 
import AddNewProductButton from './AddNewProductButton';
import DeleteMerchantButton from './DeleteMerchantButton';
import MerchantAuthorizeButton from './MerchantAuthorizeButton';
import UpdateMerchantButton from './UpdateMerchantButton';
import Login from './Login';
const App = () => {
  return (
    
    <div>
      <h1>Merchant Product Management Portal</h1>
      <nav>
        <tr>
        <th><Login/></th>
        <th><SignupButton/></th> 
        {/* <th><AllMerchantList/></th>
       <th><AllProducts/></th>
       <th><AddNewProductButton/></th>
       <th><SignupButton/></th> 
       <th><MerchantDetail/></th>
       <th><MerchantAuthorizeButton/></th>
       <th><UpdateMerchantButton/></th>
       <th><DeleteMerchantButton/></th>
        */}
       </tr>
       </nav>
    </div>
  )
}

export default App;



