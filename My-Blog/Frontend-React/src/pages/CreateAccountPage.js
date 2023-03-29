import React,{useState} from 'react'
import { Link , useNavigate} from 'react-router-dom';

import { getAuth,createUserWithEmailAndPassword } from 'firebase/auth';

const CreateAccountPage = () => {
const [email,setEmail]=useState('');
const [password,setPassword]=useState('');

const [confirmPassword,setConfirmPassword]=useState('');
const [error,setError]=useState('');

const navigate=useNavigate();

const createAccount=async()=>{
    try {
        if(password!=confirmPassword){
            setError('Password and Confirm Password does not match');
            return;
        }

        await createUserWithEmailAndPassword(getAuth(),email,password);
        navigate('/articles');
    } catch (error) {
        setError(error.message);
    }
}

return (
    <>
      <h1>Create account</h1>
      {error && <p className='error'>{error}</p>}
      <input
      placeholder='Your email address'
      value={email}
      onChange={e=>setEmail(e.target.value)}
      ></input>
      <input type="password"
      placeholder='Your Password'
      value={password}
      onChange={e=>setPassword(e.target.value)}
      ></input>
      <input type="password"
      placeholder='Re-enter your Password'
      value={confirmPassword}
      onChange={e=>setConfirmPassword(e.target.value)}
      ></input>
      <button onClick={createAccount}>Create Account</button>
      <Link to="/login">Already Have account? Log in here</Link>
    </>
  )
}

export default CreateAccountPage;
