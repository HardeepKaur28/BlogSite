import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import axios from 'axios'
function Register() {
  const [userDetail,setUserDetail] = useState({
    name : '',
    email: '',
    password:'',
    password2:''
  })

  const [error,setError] = useState('')
  const navigate = useNavigate()

  const changeInputHandle = (e) =>{
    setUserDetail(prevState => {
      return{...prevState,[e.target.name]:e.target.value}
  })
}

const registerUser = async (e) => {
  e.preventDefault()
  setError('')
  try {
    const response = await axios.post(`http://localhost:5000/api/users/register`, userDetail);
    console.log(response);
    const newUser = await response.data; // Use optional chaining to avoid TypeError if response is undefined
    console.log(newUser);
    if (!newUser) {
      setError("Couldn't register user. Please try again");
    }
    navigate("/login");
  } catch (err) {
    setError(err.response.data.message); // Use optional chaining to avoid TypeError if response or data is undefined
  }
};

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register_form" onSubmit={registerUser}>
         {error && <p className='form_error-message'>{error}</p>}
          <input type="text" placeholder='your name' name='name' value={userDetail.name}
          onChange={changeInputHandle} autoFocus
          />
           <input type="text" placeholder='your email' name='email' value={userDetail.email}
          onChange={changeInputHandle}
          />
           <input type="password" placeholder='password' name='password' value={userDetail.password}
          onChange={changeInputHandle}
          />
          
          <input type="password" placeholder='Confirm password' name='password2' value={userDetail.password2}
          onChange={changeInputHandle}
          />
          <button type='submit' className='btn primary'>Register</button>
        </form>
        <small>Already have an account? <Link to="/login">sign in</Link></small>
      </div>
    </section>
  )
}

export default Register