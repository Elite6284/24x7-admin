import React from "react";
import { Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dasboard";
import Navbar from "./components/Navbar";
import Users from "./pages/Users";
import Transactions from "./pages/Transactions";
import EditUser from "./pages/EditUser";

function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path='/upload/' element={<Upload />} />
				<Route path='/upload/:id' element={<Upload />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/transactions' element={<Transactions />} />
				<Route path='/users' element={<Users />} />
				<Route path='/user/:id' element={<EditUser />} />
			</Routes>
		</>
	);
}

export default App;
