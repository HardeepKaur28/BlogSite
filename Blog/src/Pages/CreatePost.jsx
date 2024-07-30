import React, { useState,useContext, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { userContext } from '../context/userContext'

const CreatePost = () => {
  const [title,setTitle] = useState("")
  const [category,setCategory] = useState("Uncategorzied")
  const [description,setDescription] = useState("")
  const [thumbnail,setThumbnail] = useState("")
  const [error,setError] = useState('')
  const navigate = useNavigate();

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

  const createPost = async (e) => {
    e.preventDefault();
    
    const postData = new FormData();
    postData.set('title', title);
    postData.set('category', category);
    postData.set('description', description);
    postData.set('thumbnail', thumbnail);
    
    try {
      const response = await axios.post(`http://localhost:5000/api/posts`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log(response);  // Log the entire response
  
      if (response && response.data) {
        // Check if the data property exists and has the expected structure
        if (response.status === 201) {
          console.log("Navigating...");

          return navigate("/")

        }
      } else {
        console.error('Unexpected response:', response);  // Log unexpected responses
        setError('Error creating the post. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);  // Log any errors
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };
  
  

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className="form_error-message">{error}</p>}

        <form className="form create-post_form" onSubmit={createPost}>
          <input type="text" placeholder='Title' value={title} onChange={e =>setTitle(e.target.value)}
          autoFocus />
          <select name="category" value={category} onChange={e =>setCategory(e.target.value)}>
            {
              Post_Categories.map(cat => <option key={cat} value={cat}>{cat}</option>)
            }
          </select>
          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription}/>
          <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept="png,jpg,jpeg" />
          <button type="submit" className="btn primary">Create</button>
        </form>
      </div>
    </section>
  )
}

export default CreatePost