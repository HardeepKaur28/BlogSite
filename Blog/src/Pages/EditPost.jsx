import React, { useState , useContext,useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {useNavigate , useParams} from 'react-router-dom'
import { userContext } from '../context/userContext'
import axios from 'axios';

function EditPost() {
  const [title,setTitle] = useState("")
  const [category,setCategory] = useState("Uncategorzied")
  const [description,setDescription] = useState("")
  const [thumbnail,setThumbnail] = useState("")
  const navigate = useNavigate()
  const {id} = useParams();

  const {currentUser} = useContext(userContext)
  const token = currentUser?.token;

  //redirect to login page : 
  useEffect(() =>{
    if(!token){
      navigate("/login")
    }
  },[])

  const modules = {
    toolbar:[
      [{'header' : [1,2,3,4,5,6,false]}],
      ['bold','italic' , 'underline', 'strike','blockquote'],
      [{'list': 'ordered'} ,{'list':'bullet'} ,{'indent':'-1'} ,{'indent':'+1'}],
      ['link','image'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold','italic' , 'underline', 'strike','blockquote',
    'list','bullet','indent',
    'link','image'
  ]

  const Post_Categories = ["Agriculture" ,"Bussiness" ,"Education" ,"Art","Investment",
  "Uncategory", "weather"]

  useEffect(() => {
    const getPost = async ()=>{
      setIsLoading(true)
      try{
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`)
        setTitle(response.data.title)
        setDescription(response.data.description)
      }catch(err){
        console.log(err);
      }
      setIsLoading(false)
    }
    getPost();
  },[])

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        <p className="form_error-message">
          This is an error message
        </p>
        <form className="form create-post_form">
          <input type="text" placeholder='Title' value={title} onChange={e =>setTitle(e.target.value)}
          autoFocus />
          <select name="category" value={category} onChange={e =>setCategory(e.target.value)}>
            {
              Post_Categories.map(cat => <option key={cat}>{cat}</option>)
            }
          </select>
          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription}/>
          <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept="png,jpg,jpeg" />
          <button type="submit" className='btn primary'>Update</button>
        </form>
      </div>
    </section>
  )
}

export default EditPost