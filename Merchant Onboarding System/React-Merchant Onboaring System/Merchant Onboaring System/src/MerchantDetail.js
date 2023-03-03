import React, { useState, useEffect } from 'react';
import GetMerchantDetail from './GetMerchantDetail';
import SearchMerchantDetail from './SearchMerchantDetail'

function MerchantDetail() {
const [merDetail,setMerDetail]=useState(false)
const handleClick=()=>{
    setMerDetail(!merDetail)
}

  return (
    <div>
    <button class="ui orange basic button" onClick={handleClick}>{merDetail?`Hide Merchant Details`:`Show Merchant Details`}</button>
    {merDetail && <GetMerchantDetail/>}
    </div>
  )
}

export default MerchantDetail;
