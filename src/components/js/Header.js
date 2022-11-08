import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import 'react-dropdown/style.css'
import "./../css/Header.css"

export default function Header() {

	const[ userLogged, setUserLogged ] = useState()
	const[ iconUser, setIconUser ] = useState(false)
	
	useEffect(()=>{
		if(localStorage.length > 0) {
			setUserLogged(JSON.parse(localStorage.getItem("userLogged")).name)
			setIconUser(true)
		}
	}, [userLogged])
	
	function logout() {
		localStorage.removeItem("userLogged")
		setUserLogged()
		setIconUser(false)
	}

	const btnLogin = 
		<li className="nav-item">
			<Link className='nav-link' to="/login">
				Login
			</Link>
		</li>

	const btnLogout = 
		<li className="nav-item">
			<Link className='nav-link' onClick={logout} to="#">
				Logout
			</Link>
		</li>

	const btnSingUp = 
		<li className="nav-item">
			<Link className="nav-link link-support" to="/signup">
				Sing-up
			</Link>
		</li>
	
	return (
		<>
			<header>
				<nav className="navbar navbar-expand-lg">
					<div className="container-fluid">
						<Link to="/" className="navbar-brand">
							<img className="navbar-logo" 
								 src="https://logodownload.org/wp-content/uploads/2016/09/Spotify-logo.png" 
								 alt="logo-spotify"
							/>
						</Link>
						<button
							className="navbar-toggler"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarNav"
							aria-controls="navbarNav"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="navbarNav">
							<ul className="navbar-nav">
								<li className="nav-item">
									<Link className="nav-link link-support" to="#">
										Premium
									</Link>
								</li>
								<li className="nav-item ">
									<Link className="nav-link link-support" to="/support">
										Support
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link link-support" to="#">
										|
									</Link>
								</li>
								{!iconUser ? btnSingUp : ''} 
								{!iconUser ? btnLogin : btnLogout}
							</ul>
						</div>
					</div>
				</nav>
			</header>
		</>
	)
}
