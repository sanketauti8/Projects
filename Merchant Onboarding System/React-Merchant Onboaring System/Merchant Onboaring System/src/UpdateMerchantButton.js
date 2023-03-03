import React, { useState, useEffect } from 'react';
import UpdateMerchant from './UpdateMerchant'
const UpdateMerchantButton = () => {
    const [signUp,setSignUp]=useState(false);

    const handleClick=()=>{
        setSignUp(!signUp)
    }
    
    
      return (
        <div>
          <button class="ui orange basic button" onClick={handleClick}>{signUp ? 'Hide Update Merchant' :'Update Merchant'}</button>
          {signUp && <UpdateMerchant/>}
        </div>
      )
    }

export default UpdateMerchantButton;
