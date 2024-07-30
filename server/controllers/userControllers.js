const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const {v4:uuid} = require("uuid")

const User = require('../models/userModel')
const HttpError = require("../models/errorModel");
// ----> Register a new user 
// POST: api/users/register
const registerUser = async(req, res, next) => {
   try{
        const {name, email,password, password2} = req.body
        if(!name || !email || !password){
            return next(new HttpError("Fill in all feilds.", 422))
        }

        const newEmail = email.toLowerCase()

        const emailExists = await User.findOne({email: newEmail})
        if (emailExists) {
            return next(new HttpError('This Email is already taken', 422))
        }
        
        if((password.trim()).length < 6){
            return next(new HttpError('Password must be at least 6 characters long.','422'))
        }

        if (password !== password2) {
            return next(new HttpError('Passwords do not match', 422))
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)
        const newUser = await User.create({name , email: newEmail , password: hashedPass})
        res.status(201).json(`NewUser ${newUser.email} registred.`)

   }catch(error){
        return next(new HttpError("User registration failed." , 422))
   }
};

// ----> Login a user 
// POST: api/users/login
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new HttpError('Please provide both email and password.', 422));
        }

        const newEmail = email.toLowerCase();
        const user = await User.findOne({ email: newEmail });

        if (!user) {
            return next(new HttpError('Invalid credentials. User not found.', 422));
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
            return next(new HttpError('Invalid credentials. Password incorrect.', 422));
        }

        const jwtSecret = process.env.JWT_SECRET || 'hkmhkmhkm';

        const { _id: id, name } = user;
        const token = jwt.sign({ id, name },jwtSecret , { expiresIn: '24h' });
        // Optionally, you can verify the token here if needed
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('Generated Token:', token);

        res.status(200).json({ token, id , name});
    } catch (error) {
        console.error('Login Error:', error);
        return next(new HttpError('Login failed. Please check your credentials', 422));
    }
};



// ----> Get user profile
// GET: api/users/:id
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return next(new HttpError(`Error fetching user: ${error.message}`, 500));
    }
};
// ----> Change user avatar
// POST: api/users/change-avatar
const changeAvatar = async (req, res, next) => {
    try {
        console.log('req.files:', req.files); // Add this line
        console.log('req.body:', req.body); // Add this line
        const userId = req.user.id;

        // Check if req.files is undefined or req.files.avatar is undefined
        if ( !req.files.avatar) {
            console.log(req.files.avatar);
            return next(new HttpError("Please choose an image.", 422));
        }

        const user = await User.findById(userId);

        if (user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if (err) {
                    return next(new HttpError(err));
                }
            });
        }

        const {avatar } = req.files;
        if (avatar.size > 50000) {
            return next(new HttpError("Profile picture too big. Should be less than 500kb", 422));
        }

        let fileName = avatar.name;
        let splittedFilename = fileName.split('.');
        let newFilename = splittedFilename[0]+uuid() +'.'+splittedFilename[splittedFilename.length - 1];

        avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if (err) {
                return next(new HttpError(err));
            }

            const updateAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: newFilename }, { new: true });

            if (!updateAvatar) {
                return next(new HttpError("Avatar couldn't be changed.", 422));
            }

            res.status(200).json(updateAvatar);
        });
    } catch (error) {
        return next(new HttpError("Error fetching user.", 500));
    }
};
// ----> Edit user details
// POST: api/users/edit-user
const editUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;
        if (!name || !email || !currentPassword || !newPassword) {
            return next(new HttpError("Fill all fields!", 422));
        }
        // Get user from the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError("User not found.", 403));
        }

        const emailExist = await User.findOne({ email });
        if (emailExist && emailExist._id != req.user.id) {
            return next(new HttpError("Email already exists.", 422));
        }

        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validateUserPassword) {
            return next(new HttpError("Invalid current password.", 422));
        }

        if (newPassword !== confirmNewPassword) {
            return next(new HttpError("New password do not match.", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        const newInfo = await User.findByIdAndUpdate(req.user.id, { name, email, password: hash }, { new: true });
        res.status(200).json(newInfo);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// ----> Get all authors
// GET: api/users/authors
const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find();

        if (authors.length === 0) {
            // Return a 404 status if no authors are found
            return res.status(404).json({ message: "No authors found" });
        }

        res.json(authors);
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error fetching authors:", error);

        // Provide more detailed error information in the response
        return next(new HttpError(`Error fetching authors: ${error.message}`, 500, { originalError: error }));
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    changeAvatar,
    editUser,
    getAuthors
};
