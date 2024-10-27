import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      backgroundColor: '#091115',
      color: '#fff',
    },
    title: {
      fontSize: '1.2rem',
      marginBottom: '1rem',
    },
    text: {
      fontSize: '1rem',
      marginBottom: '2rem',
      lineHeight: '1.2',
    },
    button: {
      padding: '10px 20px',
      fontSize: '1rem',
      backgroundColor: '#2c3e50',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'background-color 0.3s',
    },
    canvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: -1,
    },
  };

  React.useEffect(() => {
    const canvas = document.getElementById('notFoundCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function drawRandomLine() {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
      ctx.lineWidth = Math.random() * 2;
      ctx.stroke();
    }

    function animate() {
      drawRandomLine();
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div style={styles.container}>
      <canvas id="notFoundCanvas" style={styles.canvas}></canvas>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.text}>The artwork you're looking for has wandered off the canvas.</p>
      <Link to="/" style={styles.button}>
        Return to Gallery
      </Link>
    </div>
  );
}

export default NotFound;
