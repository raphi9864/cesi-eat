import React, { useState } from 'react';

const TestPage = () => {
  const [directData, setDirectData] = useState(null);
  const [proxyData, setProxyData] = useState(null);
  const [directError, setDirectError] = useState(null);
  const [proxyError, setProxyError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testDirectApi = async () => {
    setLoading(true);
    setDirectData(null);
    setDirectError(null);
    
    try {
      console.log('Test API direct - http://localhost:5000/api/restaurants/public');
      const response = await fetch('http://localhost:5000/api/restaurants/public');
      const data = await response.json();
      console.log('Données reçues (direct):', data);
      setDirectData(data);
    } catch (error) {
      console.error('Erreur API directe:', error);
      setDirectError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testProxyApi = async () => {
    setLoading(true);
    setProxyData(null);
    setProxyError(null);
    
    try {
      console.log('Test API via proxy - /api/restaurants/public');
      const response = await fetch('/api/restaurants/public');
      const data = await response.json();
      console.log('Données reçues (proxy):', data);
      setProxyData(data);
    } catch (error) {
      console.error('Erreur API proxy:', error);
      setProxyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
      <h1>Page de diagnostic API</h1>
      <p>Cette page vous permet de tester la connexion à l'API et de vérifier si le proxy est configuré correctement.</p>
      
      <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
        <button 
          onClick={testDirectApi}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF6B6B',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          Tester API directe (port 5000)
        </button>
        
        <button 
          onClick={testProxyApi}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          Tester API via proxy Nginx
        </button>
      </div>
      
      {loading && <p>Chargement en cours...</p>}
      
      <div style={{display: 'flex', gap: '20px', flexDirection: 'column'}}>
        <div>
          <h2>Résultat API directe</h2>
          {directError && (
            <div style={{color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px'}}>
              Erreur: {directError}
            </div>
          )}
          {directData && (
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '400px'
            }}>
              {JSON.stringify(directData, null, 2)}
            </pre>
          )}
        </div>
        
        <div>
          <h2>Résultat API proxy</h2>
          {proxyError && (
            <div style={{color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px'}}>
              Erreur: {proxyError}
            </div>
          )}
          {proxyData && (
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '400px'
            }}>
              {JSON.stringify(proxyData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage; 