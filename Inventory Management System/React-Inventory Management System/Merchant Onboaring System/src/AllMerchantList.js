import React, { useState, useEffect } from 'react';
import GetAllMerchantList from './GetAllMerchantList'

const AllMerchantList = () => {

    const [allMerList,setAllMerList]=useState(false);

    const handleClick=()=>{
        setAllMerList(!allMerList)
    }


  return (
    <div>
      <button class="ui orange basic button" onClick={handleClick}>{allMerList ? 'Hide Merchant List' : 'Show All onboarded Merchant'}</button>
    {allMerList && <GetAllMerchantList/>}
    </div>
  )
}

export default AllMerchantList
