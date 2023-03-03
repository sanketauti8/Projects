import React, { useState } from 'react';
export function MerchantDetailList() {
    const [user, setUser] = useState({});
    const [inputValue, setInputValue] = useState('');
    const phoneNo = inputValue;
    console.log(phoneNo);

    const fetchData = () => {
        
        const url=`http://127.0.0.1:5000/merchant/${phoneNo}`;
      return fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log(data.Merchant_Details)
          setUser(data.Merchant_Details);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  
    // useEffect(() => {
    //     console.log("inside useEffect");
    //   fetchData();
    // }, [inputValue])
   

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
      };
      const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputValue)
      };

      function HandleClick(){
        setInputValue(inputValue)
        fetchData();
      }

    return (
      <>
        <h3>Merchant Details</h3>
      <form  onSubmit={handleSubmit}>
        <div class="ui icon input">
        <input placeholder="Enter Contact No"  type="text" value={inputValue} onChange={handleInputChange} />
        <i class="circular search link icon" onClick={HandleClick}></i>
        </div>
    </form>
    <div class="ui card">
  <a class="image" href="#">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL1r6AVyUAdrRqPonQh7qMsP5AB4hCdweYDQ&usqp=CAU"></img>
  </a>
  <div class="content">
    <h2>{user.merchant_name}</h2>
    {user.authorize_merchant ?<h3><i class="large green checkmark icon"></i>Admin</h3> : <h3><i class="large red icon close"></i>Admin</h3>}

    <table class="ui inverted orange table">
  <thead>
    <tr>
    <th>Contact</th>
    <td>{user.Contact}</td>
  </tr>
  </thead>
  <thead>
    <tr>
    <th>Shop_name</th>
    <td>{user.shop_name}</td>
  </tr>
  </thead>

  <thead>
    <tr>
    <th>Address</th>
    <td>{user.line1}</td>
  </tr>
  </thead>

  <thead>
    <tr>
    <th>State</th>
    <td>{user.state}</td>
  </tr>
  </thead>

  <thead>
    <tr>
    <th>Zip</th>
    <td>{user.zip}</td>
  </tr>
  </thead>

  <thead>
    <tr>
    <th>Country</th>
    <td>{user.country}</td>
  </tr>
  </thead>
</table>
  </div>
</div>
      </>
    );
  }
  

const GetMerchantDetail = () => {
    console.log("inside GetMerchantDetail");
    //console.log(inputValue);
  return (
   
    <div>
      <MerchantDetailList/>
    </div>
  )
}

export default GetMerchantDetail
