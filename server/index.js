const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const upload = require('express-fileupload')
const path = require('path');
// Import your route files
const userRoutes = require('./routes/userRoutes');
const postsRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://localhost:27017/Blog", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(upload())
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use('/uploads',express.static(path.join(__dirname + '/uploads'),{ extensions: ['jpg'] }))

// Use your routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postsRoutes);

// Error handling middleware should come after your route handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT||5000, () => console.log("Server running on port 5000"));
