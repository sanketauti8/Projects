import React, { useState, useEffect } from 'react';
import GetProductList from './GetProductList'


function AllProducts() {
  const [showHome, setShowHome] = useState(false);

  const handleClick = () => {
    setShowHome(!showHome);
  };

  return (
    <div>
      <button class="ui orange basic button" onClick={handleClick}>{showHome ? 'Hide Products List' : 'Show All Products List'}</button>
      {showHome && <GetProductList />}
    </div>
  );
}

export default AllProducts;
