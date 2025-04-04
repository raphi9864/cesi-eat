import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer style={{
      backgroundColor: '#f8f9fa', 
      padding: '20px 0', 
      borderTop: '1px solid #eaeaea',
      marginTop: '30px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <Link to="/" style={{textDecoration: 'none', color: '#333'}}>Accueil</Link>
          <Link to="/restaurants" style={{textDecoration: 'none', color: '#333'}}>Restaurants</Link>
          <Link to="/test" style={{textDecoration: 'none', color: '#333'}}>Tester API</Link>
        </div>
        <div style={{color: '#666', fontSize: '0.9rem'}}>
          &copy; {year} CESI Eat. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 