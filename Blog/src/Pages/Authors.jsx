import React, { useState ,useEffect} from 'react'
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import Loader from "../components/Loader"


const Authors = () => {
  const [authors,setAuthors] = useState([])
  const [isLoading , setIsLoading] = useState(false)

    
  useEffect(() =>{
    const getAuthor = async ()=>{
      setIsLoading(true)
      try{
        const response = await axios.get(`http://localhost:5000/api/users`)
        setAuthors(response.data)
      }catch(err){
        console.log(err);
      }
      setIsLoading(false)
    }
    getAuthor();
  },[])

  
  if(isLoading){
    return <Loader/>
  }

  return (
    <section className="authors">
      {authors.length > 0 ? <div className="container authors_container">
        {
          authors.map(({_id: id,avatar,name,posts})=>{
            return(
              <Link key={id} to={`/posts/users/${id}`} className='author'>
                <div className="author_avatar">
                  <img src={`http://localhost:5000/uploads/${avatar}`} alt={`Image of ${name}`} />
                </div>
                <div className="author_info">
                  <h4>{name}</h4>
                  <p>{posts}</p>
                </div>
              </Link>
            )
          })
        }
      </div> : <h2 className='center'>No Users/authors found. </h2>

      }
    </section>
  )
}

export default Authors