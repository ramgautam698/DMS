// this app is improved version

import React from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import Home from "./home";
import NavBar from "./navbar";
import EditDetails from "./editDetails";
import AddDocument from "./addDocument";
import DocumentCategory from "./doc_category";
import UserPage from "./userpage";
import Friends from "./friendsData";

function App()
{
	return (
	<>
		<React.Fragment>
			<Router>
				<Header />
				<NavBar />
				
				<Routes>
					<Route path="/" element={ <Home /> }></Route>
				</Routes>
				
				<Routes>
					<Route path="/addDocument" element={ <AddDocument /> }></Route>
				</Routes>
				
				<Routes>
					<Route path="/Doc_Category" element={ <DocumentCategory /> }></Route>
				</Routes>
				
				<Routes>
					<Route path="/editDetails" element={ <EditDetails /> }></Route>
				</Routes>
				
				<Routes>
					<Route path="/friends" element={ <Friends /> }></Route>
				</Routes>
				
				<Routes>
					<Route path="/userpage" element={ <UserPage /> }></Route>
				</Routes>
				
			</Router>
			<Footer />
			
		</React.Fragment>
	</>
	);
}


export default App;
