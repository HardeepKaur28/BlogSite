import React, { useState ,useContext } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import axios from 'axios'

import{userContext} from "../context/userContext.jsx";
const Login = () => {
  const [userDetail,setUserDetail] = useState({
    email: '',
    password:''
  })

  const [error,setError] = useState('')
  const navigate = useNavigate()

  const {setCurrentUser} = useContext(userContext)

  const changeInputHandle = (e) =>{
    setUserDetail(prevState => {
      return{...prevState,[e.target.name]:e.target.value}
  })
}

const loginUser = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const response = await axios.post(`http://localhost:5000/api/users/login`, userDetail);
    console.log(response);
    const newUser = response.data; // Use optional chaining to avoid TypeError if response is undefined
    console.log(newUser);
    setCurrentUser(newUser);
    navigate("/");
  } catch (err) {
    setError(err.response.data.message); // Use optional chaining to avoid TypeError if response or data is undefined
  }
}

  return (
    <section className="register">
      <div className="container">
        <h2>Sign In</h2>
        <form className="form login_form" onSubmit={loginUser}>
          {error && <p className='form_error-message'>{error}</p>}
          <input type="text" placeholder='your email' name='email' value={userDetail.email}
          onChange={changeInputHandle} autoFocus/>
          <input type="password" placeholder='password' name='password' value={userDetail.password}
          onChange={changeInputHandle}/>
          <button type='submit' className='btn primary'>Login</button>
        </form>
        <small>Don't have an account? <Link to="/register">sign up</Link></small>
      </div>
    </section>
  )
}

export default Login