import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout";
import ErrorPage from './Pages/ErrorPage';
import Home from "./Pages/Home";
import PostDetail from "./Pages/PostDetail";
import Register from './Pages/Register';
import Login from './Pages/Login';
import UserProfile from './Pages/UserProfile';
import CreatePost from './Pages/CreatePost';
import EditPost from './Pages/EditPost';
import DeletePost from './Pages/DeletePost';
import CategoryPosts from './Pages/CategoryPosts';
import AuthorPosts from './Pages/AuthorPosts';
import Dashboard from "./Pages/Dashboard";
import Logout from "./Pages/Logout";
import Authors from './Pages/Authors';
import UserProvider from "./context/userContext";

function App() {
  const router = (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<UserProvider><Layout /></UserProvider>}
        
        >
          <Route index element={<Home />} />
          <Route path="posts/:id" element={<PostDetail />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="profile/:id" element={<UserProfile />} />
          <Route path="authors" element={<Authors />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="posts/categories/:category" element={<CategoryPosts />} />
          <Route path="posts/users/:id" element={<AuthorPosts />} />
          <Route path="myposts/:id" element={<Dashboard />} />
          <Route path="posts/:id/edit" element={<EditPost />} />
          <Route path="posts/:id/delete" element={<DeletePost />} />
          <Route path="logout" element={<Logout />} />

          
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );

  return (
    <>
      <div>
        {router}
      </div>
    </>
  );
}

export default App;
