import "./../css/Home.css"
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { URL, update, post } from "./services/api"
import { encrypt, decrypt } from "./services/crypt"
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import axios from "axios"

function Home() {
	const [collections, setCollections] = useState()
	const [playlists, setPlaylists] = useState()
	const [musics, setMusics] = useState()

	const [users, setUsers] = useState()
	const [id, setId] = useState('')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [dateBirth, setDateBirth] = useState('')
	const [gender, setGender] = useState('')
	const [modalTitle, setModalTitle] = useState('')
	const [show, setShow] = useState(false)
	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	const [namePlaylist, setNamePlaylist] = useState('')
	const [descPlaylist, setDescPlaylist] = useState('')
	const [coverPlaylist, setCoverPlaylist] = useState('')
	const [showPlaylist, setShowPlaylist] = useState(false)
	const handleClosePlaylist = () => setShowPlaylist(false)
	const handleShowPlaylist = () => setShowPlaylist(true)

	const [searchMusic, setSearchMusic] = useState('')
	const [musicsArray, setMusicsArray] = useState([])
	const [show2, setShow2] = useState(false)
	const handleClose2 = () => setShow2(false)
	const handleShow2 = () => setShow2(true)

	useEffect(() => {
		axios.get(`${URL}/users`)
		.then(response => setUsers(response.data))
	}, [])
	useEffect(() => {
		axios.get(`${URL}/collections`)
		.then(response => setCollections(response.data))
	}, [handleClosePlaylist])
	useEffect(() => {
		axios.get(`${URL}/playlists`)
		.then(response => setPlaylists(response.data))
	}, [handleClosePlaylist])
	useEffect(() => {
		axios.get(`${URL}/musics`)
		.then(response => setMusics(response.data))
	}, [])
	
	let user
	if(localStorage.length > 0) user = JSON.parse(localStorage.getItem("userLogged"))

	function handleSubmit(e) {
		e.preventDefault()
		
		const data = {
			"name": name,
			"email": email,
			"password": encrypt(password),
			"dateBirth": dateBirth,
			"gender": gender
		}
		update('users', id, data)
	}
	
	function handleSubmitPlaylist(e) {
		e.preventDefault()

		var stringMusic = ''
		musicsArray.map(m => {
			stringMusic.length == 0 ? stringMusic = m : stringMusic += "," + m
		})
		
		const data = {
			"name": namePlaylist,
			"desc": descPlaylist,
			"cover": coverPlaylist,
			"musics": stringMusic,
			"users": user._id
		}
		post('playlists', data)
	}

	const dataHTML = collections?.map((collection) => (
		<div>
			<div className="section-content-title">
				<h1>
					{collection.name}
				</h1>
				<h3>
					<Link to="#">VER TUDO</Link>
				</h3>
			</div>
			<div className="section-content-albuns">
				{collection.playlists.split(',')?.map(a => playlists?.filter(p => p._id == a))?.map(x => x?.map(playlist=>
					<div className="section-content-albuns-album">
						<Link to={`/singleplaylist/${(playlist._id)}`} className="navbar-brand">
							<img className="section-content-albuns-album-img" src={playlist.cover} alt="capa-album" />
							<h3>
								{playlist.name}
							</h3>
							<h4>
								{playlist.desc}
							</h4>
						</Link>
					</div>
				))}
			</div>
		</div>
	))

	
	if(localStorage.length > 0) {
		return (
			<div>
				<div className="menu-user">
					<h3 onClick={()=>setModalTitle('Update User')&setId(user._id)&setName(user.name)&setEmail(user.email)
									&setPassword(user.password)&setDateBirth(user.dateBirth)&setGender(user.gender)}
									onMouseUp={handleShow}>
					User Settings</h3>
					<h3 onClick={handleShowPlaylist}>New Playlist</h3>
				</div>
				<div className="body">
					<section className="content">
						<div>
							<div className="section-content-title">
								<h1>
									Playlists do {user.name}
								</h1>
								<h3>
									<Link to="#">VER TUDO</Link>
								</h3>
							</div>
							<div className="section-content-albuns">
								{playlists?.filter(w=>w.users == user._id)
								.map(playlist =>
									<div className="section-content-albuns-album">
										<Link to={`/singleplaylist/${(playlist._id)}`} className="navbar-brand">
											<img className="section-content-albuns-album-img" src={playlist.cover} alt="capa-album" />
											<h3>
												{playlist.name}
											</h3>
											<h4>
												{playlist.desc}
											</h4>
										</Link>
									</div>
								)}
							</div>
						</div>
						
						{dataHTML}
					</section>
				</div>


				<Modal show={show} onHide={handleClose} >
					<form onSubmit={e => handleSubmit(e)}>
						<Modal.Header closeButton>
						<Modal.Title>{modalTitle}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
								<p>{"Id: " + id}</p>
								<p>Name: <input type="text" value={name} onChange={(e)=>setName(e.target.value)}></input></p>
								<p>Email: <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}></input></p>
								<p>Password: <input type="text" value={decrypt(password)} onChange={(e)=>setPassword(e.target.value)}></input></p>
								<p>DateBirth: <input type="text" value={dateBirth} onChange={(e)=>setDateBirth(e.target.value)}></input></p>
								<p>Gender: <input type="text" value={gender} onChange={(e)=>setGender(e.target.value)}></input></p>
						</Modal.Body>
						<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Cancel
						</Button>
						<Button variant="primary" type="submit" onClick={handleClose}>
							Save Changes
						</Button>
						</Modal.Footer>
					</form>
				</Modal>
				
				<Modal show={showPlaylist} onHide={handleClosePlaylist} >
					<form onSubmit={e => handleSubmitPlaylist(e)}>
						<Modal.Header closeButton>
						<Modal.Title>{modalTitle}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
								<h5>Playlist is private to {user.name}</h5>
								<p>{"Id: "}</p>
								<p>Name: <input type="text" value={namePlaylist} onChange={(e)=>setNamePlaylist(e.target.value)}></input></p>
								<p>Desc: <input type="text" value={descPlaylist} onChange={(e)=>setDescPlaylist(e.target.value)}></input></p>
								<p>Cover: <input type="text" value={coverPlaylist} onChange={(e)=>setCoverPlaylist(e.target.value)}></input></p>
								<div className="div-add-musics">Musics: <p onClick={handleShow2}>Add or remove musics</p></div>
						</Modal.Body>
						<Modal.Footer>
						<Button variant="secondary" onClick={handleClosePlaylist}>
							Cancel
						</Button>
						<Button variant="primary" type="submit" onClick={handleClosePlaylist}>
							Save Changes
						</Button>
						</Modal.Footer>
					</form>
				</Modal>
				

				<Modal show={show2} onHide={handleClose2} size='xl'>
					<form>
						<Modal.Header closeButton>
							<Modal.Title className="modal-title">
								<h2>Add Musics in Playlist</h2>
								<input type="text" className="input-search"
									placeholder="Search music" value={searchMusic} onChange={(e)=>setSearchMusic(e.target.value)}/>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div class="table-wrapper-scroll-y my-custom-scrollbar">
								<div className="div-table">
									<table className="table">
										<thead>
											<tr>
											<th scope="col">Id</th>
											<th scope="col">Name</th>
											<th scope="col">Author</th>
											<th scope="col">Album</th>
											<th scope="col">Actions</th>
											</tr>
										</thead>
										<tbody>
											{musics?.filter(m => 
												m.musicname.toLowerCase().includes(searchMusic.toLowerCase())||
												m.author.toLowerCase().includes(searchMusic.toLowerCase())||
												m.album.toLowerCase().includes(searchMusic.toLowerCase())
												)	
												.map(music => (
												<tr className="line">
												<th scope="row">{music._id}</th>
												<td>{music.musicname}</td>
												<td>{music.author}</td>
												<td>{music.album}</td>
												<td className="actions">
													<Button id={music._id}
															className={musicsArray.includes(music._id) ? 'btn-del' : 'btn-upd'}
															variant="primary"
															onClick={()=>{
																const index = musicsArray.indexOf(music._id)
																if (index > -1) {
																	musicsArray.splice(index, 1)
																	document.getElementById(music._id).className = 'btn-upd'
																	document.getElementById(music._id).textContent = 'Add'
																} else {
																	musicsArray.push(music._id)
																	document.getElementById(music._id).className = 'btn-del'
																	document.getElementById(music._id).textContent = 'Del'
																}
															}}>
														{musicsArray.includes(music._id) ? 'Del' : 'Add'}
													</Button>
												</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
						</Modal.Footer>
					</form>
				</Modal>

			</div>
		)
	}
	

	while(playlists?.length == undefined) {
		return (
			<div className="div-spinner">
				<Spinner animation="border" className="spinner"/>
			</div>
		)
	}

	return (
		<div className="body">
			<section className="content">
				{dataHTML}
			</section>
		</div>
	)
}

export default Home;