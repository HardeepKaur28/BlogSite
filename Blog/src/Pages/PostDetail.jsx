import React,{useContext,useEffect,useState} from 'react'
import PostAuthor from '../components/PostAuthor'
import axios from 'axios';

import { Link, useParams } from 'react-router-dom'
import Thumbnail from  '../assets/blog22.jpg';
import Loader from "../components/Loader";
import DeletePost from "../Pages/DeletePost";
import { userContext } from '../context/userContext';


function PostDetail() {
  const {id} = useParams()
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading , setIsLoading] = useState(false)
 
  const {currentUser} = useContext(userContext)

  useEffect(() =>{
    const getPost = async ()=>{
      setIsLoading(true)
      try{
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`)
        setPost(response.data)
      }catch(err){
        setError("Error fetching post data");
        console.log(err);
      }
      setIsLoading(false)
    }
   getPost();
  },[id])


  if(isLoading){
    return <Loader/>
  }

  return (
    <section className="post-detail">
      {error && <p className="error">{error}</p>}
      {post && <div className="container post-detail_container">
        <div className="post-detail_header">
          <PostAuthor authorID={post.creator} createdAt={post.createdAt}/>
          {currentUser?.id == post?.creator && currentUser?.id === post?.creator  && <div className="post-detail_buttons">
            <Link to={`/posts/${post?._id}/edit`} className="btn sm primary">Edit</Link>
            <DeletePost postId = {id}/>
          </div>}
        </div>
        <h1>{post.title}</h1>
        <div className="post-detail_thumbnail">
          <img src={`http://localhost:5000/uploads/${post.thumbnail}`} alt="" />
        </div> 
        <p dangerouslySetInnerHTML={{__html:post.description}}></p>
      </div>}
      {console.log("currentUser?.id:", currentUser?.id)}
    {console.log("post?.creator:", post?.creator)}
    </section>
  )
}

export default PostDetail