import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

// Use TimeAgo.addLocale() instead of TimeAgo.addDefaultLocale()
TimeAgo.addLocale(en)
TimeAgo.addLocale(ru)

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState({});

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${authorID}`);
        setAuthor(response?.data);
      } catch (err) {
        console.error(err);
        // Handle the error gracefully, set a default author or display a placeholder image
        setAuthor({
          name: 'Unknown Author',
          avatar: 'default-avatar.jpg', // Replace with your default avatar image
        });
      }
    };

    getAuthor();
  }, [authorID]);

  return (
    <Link to={`/posts/users/${authorID}`} className="post_author">
      <div className="post_author-avatar">
        <img src={`http://localhost:5000/uploads/${author?.avatar}`} alt={`${author?.name}'s Avatar`} />
      </div>
      <div className="post_author-details">
        <h5>BY: {author?.name || 'Unknown Author'}</h5>
        <small><ReactTimeAgo date={new Date(createdAt)} locale='en-US'/></small>
      </div>
    </Link>
  );
};

export default PostAuthor;
