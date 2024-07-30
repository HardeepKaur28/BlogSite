import React, { useState,useEffect } from 'react';
import Loader from './Loader';
import axios from 'axios'
import PostItem from './PostItem';


const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading , setIsLoading] = useState(false)
  useEffect(() =>{
    const fetchPosts = async ()=>{
      setIsLoading(true)
      try{
        const response = await axios.get(`http://localhost:5000/api/posts`)
        setPosts(response?.data)
      }catch(err){
        console.log(err);
      }
      setIsLoading(false)
    }
    fetchPosts();
  },[])

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
};

export default Posts;
