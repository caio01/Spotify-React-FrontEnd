import "./../css/SignUp.css"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { URL, post } from "./services/api.js"
import crypt from "./services/crypt.js"
import axios from "axios"

function SignUp() {

    const[ email, setEmail ] = useState('')
    const[ emailConfirm, setEmailConfirm ] = useState('')
    const[ password, setPassword ] = useState('')
    const[ name, setName ] = useState('')
    const[ dayBirth, setDayBirth ] = useState('')
    const[ monthBirth, setMonthBirth ] = useState('')
    const[ yearBirth, setYearBirth ] = useState('')
    const[ gender, setGender ] = useState('')
    const[ users, setUsers ] = useState('')
    const[ alertFailed, setAlertFailed ] = useState(true)
    const[ alertSuccess, setAlertSuccess ] = useState(true)
    const[ msgAlert, setMsgAlert ] = useState('')

    useEffect(() => {
		axios.get(`${URL}/users`)
		.then(response => setUsers(response.data))
	}, [])

    function handleSubmit(e) {

        e.preventDefault()

        if(users?.filter(u=>u.email === email).length > 0) {
            setAlertSuccess(true)
            setAlertFailed(false)
            setMsgAlert('Email already registered')
        } else if(email === emailConfirm) {
            const dateBirth = dayBirth.toString() + '/' + monthBirth.toString() + '/' + yearBirth.toString()
            const data = {
                "name": name,
                "email": email,
                "password": crypt(password),
                "dateBirth": dateBirth,
                "gender": gender
            }

            post('users', data)

            resetForm()

            setAlertSuccess(false)
            setAlertFailed(true)
            setMsgAlert('User registered')
        } else {
            setAlertSuccess(true)
            setAlertFailed(false)
            setMsgAlert('Please verify confirm email')
        }
    }

    function resetForm() {
        setEmail('')
        setEmailConfirm('')
        setPassword('')
        setName('')
        setDayBirth('')
        setMonthBirth('')
        setYearBirth('')
        setGender('')
        document.getElementById("masc").checked = false
        document.getElementById("fem").checked = false
        document.getElementById("none").checked = false
    }
    
	return (
		<>
            <section className="signup-content">
                <div className="div-logo">
                    <Link to={"/"}>
                        <img src="./assets/img/logo-spotify.png" alt="logo-spotify"/>
                    </Link>
                </div>
                <div className="div-title">
                    <h1>Inscreva-se grátis e comece a curtir.</h1>
                </div>
                <div className="div-line-or">
                    <div className="div-line-1"></div>
                    <div className="div-or">ou</div>
                    <div className="div-line-2"></div>
                </div>
                <form onSubmit={e => handleSubmit(e)} id="form">
                    
                    <div class="alert alert-failed" hidden={alertFailed}>
                        <strong>Failed!</strong> {msgAlert}
                    </div>

                    <div class="alert alert-success" hidden={alertSuccess}>
                        <strong>Success!</strong> {msgAlert}
                    </div>

                    <div className="div-form">
                        <div className="form-cmp">
                            <h3>Qual é seu email?</h3>
                            <input type="email" placeholder="Insira seu e-mail." value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                        <div className="form-cmp" id="emailConfirm">
                            <h3>Confirme seu email</h3>
                            <input type="email" placeholder="Insira o e-mail novamente." value={emailConfirm} onChange={(e)=>setEmailConfirm(e.target.value)}/>
                        </div>
                        <div className="form-cmp">
                            <h3>Crie uma senha</h3>
                            <input type="password" placeholder="Crie uma senha." value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        </div>
                        <div className="form-cmp">
                            <h3>Como devemos chamar você?</h3>
                            <input type="text" placeholder="Insira um nome de perfil." value={name} onChange={(e)=>setName(e.target.value)}/>
                        </div>
                        <div className="form-cmp">
                            <h3>Qual a sua data de nascimento?</h3>
                            <div className="form-cmp-birth">
                                <div>
                                    <h3>Dia</h3>
                                    <input type="number" placeholder="DD" value={dayBirth} onChange={(e)=>setDayBirth(e.target.value)}/>
                                </div>
                                <div>
                                    <h3>Mês</h3>
                                    <input type="number" placeholder="MM" value={monthBirth} onChange={(e)=>setMonthBirth(e.target.value)}/>
                                </div>
                                <div>
                                    <h3>Ano</h3>
                                    <input type="number" placeholder="AAAA" value={yearBirth} onChange={(e)=>setYearBirth(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className="form-cmp">
                            <h3>Qual é o seu genêro?</h3>
                            <div className="form-cmp-sex">
                                <input type="radio" name="sex" id="masc" onChange={()=>setGender('M')}/>
                                <h3>Masculino</h3>
                                <input type="radio" name="sex" id="fem" onChange={()=>setGender('F')}/>
                                <h3>Feminino</h3>
                                <input type="radio" name="sex" id="none" onChange={()=>setGender('N')}/>
                                <h3>Não informar</h3>
                            </div>
                        </div>
                        <div className="form-cmp">
                            <div className="div-btn">
                                <button type="submit">Increver-se</button>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </>
	);
}

export default SignUp;