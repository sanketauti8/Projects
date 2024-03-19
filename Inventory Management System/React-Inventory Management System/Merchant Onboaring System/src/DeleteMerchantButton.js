import React, { useState, useEffect } from 'react';
import DeleteMerchant from './DeleteMerchant';

const DeleteMerchantButton = () => {
const [signUp,setSignUp]=useState(false);

const handleClick=()=>{
    setSignUp(!signUp)
}


  return (
    <div>
      <button class="ui orange basic button" onClick={handleClick}>{signUp ? 'Hide Menu' :'Delete Merchant'}</button>
      {signUp && <DeleteMerchant/>}
    </div>
  )
}



export default DeleteMerchantButton;
