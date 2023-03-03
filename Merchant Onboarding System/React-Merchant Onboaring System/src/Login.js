import React ,{ useState } from 'react'
import AllProducts from './AllProducts'
import MerchantDetail from './MerchantDetail'
import SignupButton from './SignupButton';
import AllMerchantList from './AllMerchantList' 
import AddNewProductButton from './AddNewProductButton';
import DeleteMerchantButton from './DeleteMerchantButton';
import MerchantAuthorizeButton from './MerchantAuthorizeButton';
import UpdateMerchantButton from './UpdateMerchantButton';


const Login = () => {
  
    const [showSuccess, setShowSuccess] = useState();
  const [product, setProduct] = useState({});
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({ ...prevState, [name]: value }));
  }
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `http://127.0.0.1:5000/login`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },body: JSON.stringify(product)
    })
      .then(response => response.json())
      .then(data => {console.log("inside login mm",data);console.log("inside login mm",data.username);
    if(data.username){
        setShowSuccess(true)
    }else{
        alert("Invalid Username or Password!");
    }
    })
      .catch(error => console.error(error));
      
      
  }
 
 
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log(inputValue)
//   };
  return (
    <>
    <form class="ui fluid form"  onSubmit={handleSubmit}>
        <h2>Merchant Login</h2>
        <div >
        <label htmlFor="username">Enter Contact as Username::</label>
        <input type="text" placeholder="username" name="username" value={product.username} onChange={handleChange}  />
      </div>
      <div>
        <label htmlFor="password">Enter Password:</label>
        <input type="text" placeholder="password" name="password" value={product.password} onChange={handleChange}  />
      </div>
      <button class="ui green basic button" type="submit">Login</button>
    </form>

      {showSuccess ? <p>Logged in successfully!</p> :<></>}
      
         {
            showSuccess && (
                <div>
        <th><AllMerchantList/></th>
       <th><AllProducts/></th>
       <th><AddNewProductButton/></th>
       
       <th><MerchantDetail/></th>
       <th><MerchantAuthorizeButton/></th>
       <th><UpdateMerchantButton/></th>
       <th><DeleteMerchantButton/></th>
       <th><button class="ui red basic button" onClick={() => setShowSuccess(false)}>Logout</button></th>
                </div>
            )

        }
        </>
  );
}

export default Login
