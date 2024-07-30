import React, { useState, useEffect } from 'react';
import appFirebase from '../credenciales';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import '../estilo/Home.css';
import chicaImage from '../assets/chica.png'; // Importa la imagen aquí

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Home = ({ correoUsuario }) => {
  const [mensaje, setMensaje] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (mensaje.trim() === '') {
      alert('El mensaje no puede estar vacío');
      return;
    }
    try {
      await addDoc(collection(db, 'posts'), {
        correo: correoUsuario,
        mensaje,
        likes: 0,
        createdAt: new Date()
      });
      setMensaje('');
    } catch (error) {
      console.error('Error al publicar el mensaje:', error);
      alert('Error al publicar el mensaje. Intenta nuevamente.');
    }
  };

  const handleLike = async (id, currentLikes) => {
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {
        likes: currentLikes + 1
      });
    } catch (error) {
      console.error('Error al dar like:', error);
      alert('Error al dar like. Intenta nuevamente.');
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className='Mensajeria'>Mensajeria</h1>
        <button className="logout-button" onClick={() => signOut(auth)}>Regresar</button>
      </div>

      <div className="home-content">
        <div className="welcome-message">
          <h2>Bienvenido {correoUsuario}</h2>
        </div>

        <div className="post-form">
          <div className="image-container">
            <img src={chicaImage} alt="Profile" />
          </div>
          <form onSubmit={handlePost}>
            <div className="textarea-container">
              <div className="textarea-label">¿Qué estás pensando?</div>
              <textarea
                id="messageInput"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                required
              />
            </div>
            <button type="submit">Publicar</button>
          </form>
        </div>

        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-item">
              <h5>{post.correo}</h5>
              <p>{post.mensaje}</p>
              <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
              <button className="like-button" onClick={() => handleLike(post.id, post.likes)}>
                ❤️ {post.likes}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
