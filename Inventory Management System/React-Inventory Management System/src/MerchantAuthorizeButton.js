import React, { useState, useEffect } from 'react';
import MerchantAuthorize from './MerchantAuthorize'
const MerchantAuthorizeButton = () => {
    const [signUp,setSignUp]=useState(false);

    const handleClick=()=>{
        setSignUp(!signUp)
    }
    
    
      return (
        <div>
          <button class="ui orange basic button" onClick={handleClick}>{signUp ? 'Hide Auth Window' :'Authorize Merchant'}</button>
          {signUp && <MerchantAuthorize/>}
        </div>
      )
    }
    
export default MerchantAuthorizeButton;
