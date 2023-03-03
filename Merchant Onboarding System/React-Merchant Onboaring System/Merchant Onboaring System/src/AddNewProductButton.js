import React, { useState, useEffect } from 'react';

import AddNewProducts from './AddNewProducts';
import AddProductForm from './AddProductForm';

function AddNewProductsButton(){
const [signUp,setSignUp]=useState(false);

const handleClick=()=>{
    setSignUp(!signUp)
}


  return (
    <div>
      <button class="ui orange basic button" onClick={handleClick}>{signUp ? 'Hide Products' :'Add New Products'}</button>
      {signUp && <AddNewProducts/>}
    </div>
  )
}

export default AddNewProductsButton;





