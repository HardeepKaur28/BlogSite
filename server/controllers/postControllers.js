const Post = require('../models/postModel')
const User = require("../models/userModel")
const path = require('path')
const fs = require('fs')
const {v4: uuid} = require('uuid')
const HttpError = require("../models/errorModel")




//================Create a post
//Post : api/posts
const createPost = async (req, res, next) => {
   try {
    let { title, category, description } = req.body;
    if (!title || !category || !description || !req.files || !req.files.thumbnail) {
        return next(new HttpError("Fill in all fields and choose thumbnail.", 422));
    }
    
    const { thumbnail } = req.files;

    if (thumbnail.size > 2000000) {
       return next(new HttpError("Thumbnail too big.", 422));
    }
    let fileName = thumbnail.name;
    let splittedFilename = fileName.split(".");
    let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
    thumbnail.mv(path.join(__dirname, "..", "/uploads", newFilename), async (err) => {
       if (err) {
          return next(new HttpError(err));
       } else {
          const newPost = await Post.create({
             title,
             category,
             description, 
             thumbnail: newFilename,
             creator: req.user.id,
          });
          if (!newPost) {
             return next(new HttpError("Post couldn't be created.", 422));
          }

          const currentUser = await User.findById(req.user.id);
          const userPostCount = currentUser.posts + 1;
          await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

          res.status(201).json(newPost);
       }
    });
 } catch (error) {
    return next(new HttpError(error));
 }
};

  
  //================Get all post
//Get : api/posts
const getPosts = async (req,res,next) => {
    try{
        const posts = await Post.find().sort({updatedAt: -1})
        res.status(200).json(posts)
    }catch (error){
        return next (new HttpError(error))
    }
  }
  
  //================get single post
  //Get : api/posts:id
  const getPost = async (req,res,next) => {
    try{
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if(!post){
            return next (new HttpError("Post not found" , 404))
        }
        res.status(200).json(post)
    }catch (error){
        return next (new HttpError(error))
    }
  }
  
  //================get  post by category
  //Get: api/posts/categories/:category
  const getCatPosts = async (req,res,next) => {
    try{
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1})
        
        res.status(200).json(catPosts)
    }catch (error){
        return next (new HttpError(error))
    }
  }
  
  //================Get User/author post
  //Post : api/posts/users/:id
  const getUserPost = async (req,res,next) => {
    try{
        const {id} = req.params;
        const posts = await Post.find({creator: id}).sort({createdAt: -1})
        
        res.status(200).json(posts)
    }catch (error){
        return next (new HttpError(error))
    }
  }
  
  
  //================Edit post
  //Patch : api/posts/:id
  const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFilename;
        let updatedPost;
        const postId = req.params.id;
        const { title, category, description } = req.body;

        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        if (!req.files) {
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
        } else {
            const oldPost = await Post.findById(postId);

            // Check if the oldPost has a valid thumbnail before trying to delete it
            if (oldPost.thumbnail) {
                const oldThumbnailPath = path.join(__dirname, '..', 'uploads', oldPost.thumbnail);

                // Use fs.existsSync to check if the file exists before attempting to delete
                if (fs.existsSync(oldThumbnailPath)) {
                    // Delete the old thumbnail file
                    fs.unlinkSync(oldThumbnailPath, (err) => {
                        if (err) {
                            return next(new HttpError(err.message, 500));
                        }
                    });
                }
            }

            const { thumbnail } = req.files;

            if (thumbnail.size > 2000000) {
                return next(new HttpError("Thumbnail too big.", 422));
            }

            fileName = thumbnail.name;
            let splittedFilename = fileName.split(".");
            newFilename = `${splittedFilename[0]}_${uuid()}.${splittedFilename[splittedFilename.length - 1]}`;
            thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), (err) => {
                if (err) {
                    return next(new HttpError(err.message, 500));
                }
            });

            updatedPost = await Post.findByIdAndUpdate(
                postId,
                { title, category, description, thumbnail: newFilename },
                { new: true }
            );
        }

        if (!updatedPost) {
            return next(new HttpError("Couldn't update the post", 400));
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

  
   //delete: api/posts/:id
   const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return next(new HttpError("Post not found", 404));
        }

        const post = await Post.findById(postId);
        
        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        const fileName = post.thumbnail;

        if (!fileName) {
            return next(new HttpError("Thumbnail not found", 404));
        }

        const filePath = path.join(__dirname, '..', 'uploads', fileName);

        fs.unlink(filePath, async (err) => {
            if (err && err.code === 'ENOENT') {
                // File not found, consider it deleted
            } else if (err) {
                console.error("Error deleting thumbnail:", err);
                return next(new HttpError("Error deleting thumbnail", 500));
            } else {
                try {
                    // Check if Post.findByIdAndDelete and User.findByIdAndUpdate are functioning correctly
                    await Post.findByIdAndDelete(postId);

                    const currentUser = await User.findById(req.user.id);

                    if (!currentUser) {
                        return next(new HttpError("User not found", 404));
                    }

                    const userPostCount = currentUser.posts - 1;

                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

                    res.json({ message: `Post ${postId} deleted successfully` });
                } catch (error) {
                    console.error("Error deleting post or updating user:", error);
                    return next(new HttpError("Error deleting post or updating user", 500));
                }
            }
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

  
  module.exports= {createPost,getPosts,getPost, getCatPosts, getUserPost, editPost, deletePost} 
  