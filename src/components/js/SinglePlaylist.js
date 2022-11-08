import "./../css/SinglePlaylist.css"
import ReactAudioPlayer from 'react-audio-player'
import { useParams, useNavigate, Link } from 'react-router-dom'
import React, { useEffect, useState } from "react"
import { del, update, URL } from "./services/api.js"
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import axios from "axios"

export default function SinglePlaylist() {

	var {idPlaylist} = useParams()
	const navigate = useNavigate()
	const [playlists, setPlaylists] = useState()
	const [musics, setMusics] = useState()

	const [name, setName] = useState('')
	const [desc, setDesc] = useState('')
	const [cover, setCover] = useState('')
	const [modalTitle, setModalTitle] = useState('')
	const [show, setShow] = useState(false)
	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	const [searchMusic, setSearchMusic] = useState('')
	const [musicsArray, setMusicsArray] = useState([])
	const [show2, setShow2] = useState(false)
	const handleClose2 = () => setShow2(false)
	const handleShow2 = () => setShow2(true)
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios.get(`${URL}/playlists`)
		.then(response => setPlaylists(response.data))
	}, [handleClose])
	useEffect(() => {
		axios.get(`${URL}/musics`)
		.then(response => setMusics(response.data))
	}, [handleClose])

	let user
	if(localStorage.length > 0) user = JSON.parse(localStorage.getItem("userLogged"))

	function handleSubmit(e) {
		e.preventDefault()

		var stringMusic = ''
		musicsArray.map(m => {
			stringMusic.length == 0 ? stringMusic = m : stringMusic += "," + m
		})

		const data = {
			"name": name,
			"desc": desc,
			"cover": cover,
			"musics": stringMusic,
			"users": user._id
		}
		update('playlists', idPlaylist, data)
	}

	const musicsHTML = 
		playlists?.filter(x => x._id == idPlaylist)
		.map(p => p.musics.split(',')?.map(id => musics?.filter(m => m._id == id)))
		.map( m => m?.map(y => y?.map(music =>
			<div className="music-audio">
				<div className="music">
					<h3>{music.musicname}</h3>
					<h7>{music.author} {music.album}</h7>
				</div>
				<div className="audio-play">
					<ReactAudioPlayer src="./music.mp3" controls/>
				</div>
			</div>
		)))

	while(musics?.length == undefined) {
		return (
			<div className="div-spinner">
				<Spinner animation="border" className="spinner"/>
			</div>
		)
	}

	return (
		playlists?.filter(x => x._id == idPlaylist).map(playlist => 
			<main>
				<div className="singlePlaylist">
					<div className="playlist">
						<div className="desc-playlist">
							<h3> {playlist.name} </h3>
							<img className="album-img" src={playlist.cover} alt="capa-album" />
							<h4> {playlist.desc} </h4>
							{(playlists?.filter(x=>x._id == idPlaylist)[0].users).length > 0 ? 
							<Link to={'#'} className='edit-play'><p onMouseUp={()=>setModalTitle('Update Playlist')
											 &setName(playlists?.filter(x=>x._id == idPlaylist).map(playlist=>playlist.name)[0])
											 &setDesc(playlists?.filter(x=>x._id == idPlaylist).map(playlist=>playlist.desc)[0])
							   				 &setCover(playlists?.filter(x=>x._id == idPlaylist).map(playlist=>playlist.cover)[0])
											 &setMusicsArray(playlists?.filter(x=>x._id == idPlaylist)[0].musics.split(','))
										}
							   onClick={handleShow}>Edit Playlist</p></Link> : <p></p>}
							{playlists?.filter(x=>x._id == idPlaylist)[0].users.length > 0 ? 
							<Link to={'/'}><p onClick={()=>del('playlists', idPlaylist)}>Delete Playlist</p></Link> : <p></p>}
						</div>
						<div className="div-musics">
							{musicsHTML}
						</div>
					</div>
				</div>
			

				<Modal show={show} onHide={handleClose} >
				<form onSubmit={e => handleSubmit(e)}>
					<Modal.Header closeButton>
					<Modal.Title>{modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
							<p>{"Id: " + idPlaylist}</p>
							<p>Name: <input type="text" value={name} onChange={(e)=>setName(e.target.value)}></input></p>
							<p>Desc: <input type="text" value={desc} onChange={(e)=>setDesc(e.target.value)}></input></p>
							<p>Cover: <input type="text" value={cover} onChange={(e)=>setCover(e.target.value)}></input></p>
							<div className="div-add-musics">Musics: <p onClick={handleShow2}>Add or remove musics</p></div>
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


			</main>
		)
	)
}