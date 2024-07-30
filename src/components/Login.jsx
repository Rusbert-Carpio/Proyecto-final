import React, { useState, useEffect } from 'react';
import Imagen from '../assets/loginvector.png';
import ImageProfile from '../assets/profile1.png';
import appFirebase from '../credenciales';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, orderBy } from 'firebase/firestore';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Login = () => {
    const [registrando, setRegistrando] = useState(false);
    const [mensajes, setMensajes] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMensajes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const funtAutenticacion = async (e) => {
        e.preventDefault();
        const correo = e.target.email.value;
        const Contraseña = e.target.password.value;

        if (registrando) {
            try {
                await createUserWithEmailAndPassword(auth, correo, Contraseña);
            } catch (error) {
                alert("Asegúrate de que la contraseña tenga más de 8 caracteres");
            }
        } else {
            try {
                await signInWithEmailAndPassword(auth, correo, Contraseña);
            } catch (error) {
                alert("El correo o la contraseña son incorrectos");
            }
        }
    }

    return (
        <div className='container'>
            <div className="header-label">
                <span className="label-text">Muro Interactivo💫</span>
                <div className="label-buttons">
                    <button className="label-button">Ayuda</button>
                    <button className="label-button">Información</button>
                </div>
            </div>

            <div className='row'>
                <div className='col-md-4'>
                    <div className="padre">
                        <div className='card card-body shadow-lg'>
                            <img src={ImageProfile} alt='' className='estilo-profile' />
                            <form onSubmit={funtAutenticacion}>
                                <input type="text" placeholder='Ingresar Email' className='cajatexto' id='email' />
                                <input type="password" placeholder='Ingresar Contraseña' className='cajatexto' id='password' />
                                <button className='btnform'>{registrando ? "Regístrate" : "Inicia sesión"}</button>
                            </form>
                            <h4 className='texto'>
                                {registrando ? "Si ya tienes cuenta" : "No tienes cuenta?"}
                            </h4>
                            <button className="btnswicth" onClick={() => setRegistrando(!registrando)}>
                                {registrando ? "Inicia sesión" : "Regístrate"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-8'>
                    <img src={Imagen} alt="" className='tamaño-imagen' />
                </div>
            </div>

            <div className="previous-messages">
                <h3>Mensajes anteriores</h3>
                {mensajes.map(msg => (
                    <div key={msg.id} className="message-item">
                        <h5>{msg.correo}</h5>
                        <p>{msg.mensaje}</p>
                        <p>{new Date(msg.createdAt.seconds * 1000).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Login;
