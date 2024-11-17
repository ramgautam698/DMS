import React from "react";
// importing Link from react-router-dom to navigate to 
// different end points.
import { Link } from "react-router-dom";
  
const Home = () => {
  return (
	<div><center>
		<h1>Document Management System</h1>
		<h3>Manage all the document</h3>
		<h6><Link to="/login">Log In</Link></h6>
		<h6><Link to="/signup"> Sign Up</Link></h6>
    </center></div>
  );
};
  
export default Home;