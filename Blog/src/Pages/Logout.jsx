import React, {useContext } from 'react'
import { useNavigate} from 'react-router-dom'

import{userContext} from "../context/userContext.jsx";

function Logout() {
  const {setCurrentUser} = useContext(userContext)
  const navigate = useNavigate()

  setCurrentUser(null);
  navigate("/login");
  return (
   <>
   </>
  )
}

export default Logout