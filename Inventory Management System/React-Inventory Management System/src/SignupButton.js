import React, { useState, useEffect } from 'react';
import Signup from './Signup';


function SignupButton(){
const [signUp,setSignUp]=useState(false);

const handleClick=()=>{
    setSignUp(!signUp)
}


  return (
    <div>
      <button class="ui orange basic button" onClick={handleClick}>{signUp ? 'Hide Sign up' :'Onboard new Merchant'}</button>
      {signUp && <Signup/>}
    </div>
  )
}

export default SignupButton





