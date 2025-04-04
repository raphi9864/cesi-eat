import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '50px 20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '20px'}}>404 - Page Non Trouvée</h1>
      <p style={{fontSize: '1.2rem', marginBottom: '30px'}}>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link 
        to="/"
        style={{
          display: 'inline-block',
          backgroundColor: '#FF6B6B',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        Retourner à l'accueil
      </Link>
    </div>
  );
};

export default NotFound; 