import React from 'react';
import { Link } from 'react-router-dom';
import PostAuther from './PostAuthor';

const PostItem = ({ postID, thumbnail, category, title, description, authorID , createdAt}) => {
    const shortDescription  = description.length >
     145 ? description.substr(0,145) + '...' : description;
     const postTittle  =title.length >
     30 ? title.substr(0,30) + '...' : title;

     const imageUrl = thumbnail
    ? `http://localhost:5000/uploads/${encodeURIComponent(thumbnail)}`
    : 'http://localhost:5000/uploads/default-thumbnail.jpg';

    const handleImageError = (e, thumbnail) => {
      console.error("Error loading image:", e);
      console.log("Thumbnail Prop:", thumbnail);
    };
  return (
    <article className='post'>
      <div className="post_thumbnail">
      <img src={imageUrl} alt={title} onError={(e) => handleImageError(e, thumbnail)} />
      </div>
      <div className="post_content">
        <Link to={`/posts/${postID}`}>
          <h3>{postTittle}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{__html: shortDescription}} />
        <div className="post_footer">
          <PostAuther authorID={authorID} createdAt = {createdAt} />
          <Link to={`posts/categories/${category}`} className="btn category" >{category}</Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
