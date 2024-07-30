import React,{useContext,useEffect} from 'react'
import { userContext } from '../context/userContext'
import {Link, useNavigate} from 'react-router-dom'

const DeletePost = () => {
  const navigate = useNavigate()

  const {currentUser} = useContext(userContext)
  const token = currentUser?.token;

  //redirect to login page : 
  useEffect(() =>{
    if(!token){
      navigate("/login")
    }
  },[])

  return (
   <Link className="btn sm danger">Deleter</Link>
  )
}

export default DeletePost