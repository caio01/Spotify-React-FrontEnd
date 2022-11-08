import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";
import Header from "./components/js/Header.js";
import Home from "./components/js/Home.js";
import Support from "./components/js/Support.js";
import SignUp from "./components/js/SignUp.js";
import Login from "./components/js/Login.js";
import Footer from "./components/js/Footer.js";
import SinglePlaylist from "./components/js/SinglePlaylist.js";

function App() {
	return (
		<div className="App">
			<Header />
			<div className="div">
				<Routes className="routes">
					<Route path="/" element={<Home />} />
					<Route path="support" element={<Support />} />
					<Route path="signup" element={<SignUp />} />
					<Route path="login" element={<Login />} />
					<Route path="singleplaylist/:idPlaylist" element={<SinglePlaylist />} />
				</Routes>
			</div>
			<Footer />
		</div>
	);
}

export default App;
