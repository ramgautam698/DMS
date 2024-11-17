// the react app can be runned perfectly using this app

import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import Userpage from "./components/userpage";
import AddDocument from "./components/addDocument";
import Edit_Details from "./components/edit_details";
import Sign_UP from "./components/signup";
import Friends from "./components/friends";
import Document_Category from "./components/Doc_Category";
import Details from "./components/details";

function App()
{
	return (
    <>
		<Router>
			<Routes>
				<Route path="/details" element={<Details />}></Route>
			</Routes>
			<Routes>
				<Route path="/login" element={<Login />}></Route>
			</Routes>
			<Routes>
				<Route path="/userpage" element={<Userpage />}></Route>
			</Routes>
			<Routes>
				<Route path="/addDocument" element={<AddDocument />}></Route>
			</Routes>
			<Routes>
				<Route path="/editDetails" element={<Edit_Details />}></Route>
			</Routes>
			<Routes>
				<Route path="/signup" element={<Sign_UP />}></Route>
			</Routes>
			<Routes>
				<Route path="/friends" element={<Friends />}></Route>
			</Routes>
			<Routes>
				<Route path="/Doc_Category" element={<Document_Category />}></Route>
			</Routes>
			<Routes>
				<Route path="/" element={<Home />}></Route>
			</Routes>
		</Router>
	</>
	);
}


export default App;
