import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Sidebar({cat}) {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    
    const fetchPosts = async() => {

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts?cat=${cat}`);
        setPosts(res.data);
      } catch (error) {
          console.log(error)
      }
      
    }

    fetchPosts();
  
  }, [cat])


  return (
    <div className='sidebar'> 
        <h1>Other posts you may like</h1>
        {posts.map(post => (
            <div className='post' key={post.id}>
                <img src={`../upload/${post.img}`} alt="" />
                <h2>{post.title}</h2>
                <Link className='link readmore' to={`/post/${post.id}`}>Read More</Link>
            </div>
        ))}
    </div>
  )
}

export default Sidebar