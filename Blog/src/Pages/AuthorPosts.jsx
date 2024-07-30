import React, { useState, useEffect } from 'react'
import PostItem from '../components/PostItem'
import Loader from "../components/Loader"
import { useParams } from 'react-router-dom';
import axios from 'axios'

function AuthorPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading , setIsLoading] = useState(false)
  const {id} = useParams()

  useEffect(() =>{
    const fetchPosts = async ()=>{
      setIsLoading(true)
      try{
        const response = await axios.get(`http://localhost:5000/api/posts/users/${id}`)
        setPosts(response?.data)
      }catch(err){
        console.log(err);
      }
      setIsLoading(false)
    }
    fetchPosts();
  },[id])

  if(isLoading){
    return <Loader/>
  }
  return (
    <section className="posts">
      {
      posts.length > 0 ? <div className="container posts_container">
            {
              posts.map(({_id: id, thumbnail, category, title, description, creator, createdAt }) => 
                <PostItem
                key={id}
                postID={id}
                thumbnail={thumbnail}
                title={title}
                category={category}
                description={description} 
                authorID={creator}
                createdAt={createdAt}
                />
            )
            }
        </div> : <h2 className='center'>No posts founds</h2>
      } 
    </section>
  );
}

export default AuthorPosts