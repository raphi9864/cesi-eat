import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';

// Données statiques de repli
const FALLBACK_RESTAURANTS = [
  { 
    id: 1, 
    nom: "Sushi Express", 
    cuisine: "Japonais", 
    note: 4.7, 
    tempsLivraisonEstime: 35, 
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c"
  },
  { 
    id: 2, 
    nom: "Chez Pierre", 
    cuisine: "Français", 
    note: 4.8, 
    tempsLivraisonEstime: 40, 
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
  },
  { 
    id: 3, 
    nom: "Tasty Treats", 
    cuisine: "Américain", 
    note: 4.5, 
    tempsLivraisonEstime: 25, 
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828"
  },
  { 
    id: 4, 
    nom: "Delicious Dishes", 
    cuisine: "International", 
    note: 4.6, 
    tempsLivraisonEstime: 30, 
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543"
  }
];

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useStatic, setUseStatic] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        console.log('📱 Début de la récupération des restaurants');
        
        // Utilisation de l'API avec URL relative
        console.log('🔍 Récupération des restaurants depuis l\'API');
        
        // Test direct avec fetch pour déboguer
        try {
          console.log('Tentative de récupération avec fetch...');
          const response = await fetch('http://localhost:5000/api/restaurants/public');
          const data = await response.json();
          console.log('Données reçues via fetch:', data);
          
          if (data && data.restaurants) {
            setRestaurants(data.restaurants);
            setUseStatic(false);
          } else if (Array.isArray(data)) {
            setRestaurants(data);
            setUseStatic(false);
          } else {
            console.warn('Format inattendu, utilisation des données statiques');
            setRestaurants(FALLBACK_RESTAURANTS);
            setUseStatic(true);
          }
        } catch (fetchError) {
          console.error('Erreur avec fetch:', fetchError);
          
          // Tentative avec Axios
          try {
            console.log('Tentative de récupération avec axios...');
            const data = await restaurantApi.getRestaurants();
            console.log('Données reçues via axios:', data);
            
            if (Array.isArray(data)) {
              setRestaurants(data);
              setUseStatic(false);
            } else if (data && Array.isArray(data.restaurants)) {
              setRestaurants(data.restaurants);
              setUseStatic(false);
            } else {
              console.warn('Format inattendu avec axios, utilisation des données statiques');
              setRestaurants(FALLBACK_RESTAURANTS);
              setUseStatic(true);
            }
          } catch (axiosError) {
            console.error('Erreur avec axios:', axiosError);
            setRestaurants(FALLBACK_RESTAURANTS);
            setUseStatic(true);
          }
        }
      } catch (err) {
        console.error('❌ Erreur lors du chargement des restaurants:', err);
        setError(`Erreur lors du chargement des restaurants: ${err.message}`);
        setRestaurants(FALLBACK_RESTAURANTS);
        setUseStatic(true);
      } finally {
        setLoading(false);
        console.log('🏁 Fin de la récupération des restaurants');
      }
    };

    fetchRestaurants();
  }, []);

  // Style simple sans dépendance à Tailwind
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    header: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    error: {
      backgroundColor: '#FFEBEE',
      color: '#D32F2F',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    button: {
      backgroundColor: '#FF6B6B',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px'
    },
    card: {
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      backgroundColor: 'white'
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    content: {
      padding: '15px'
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    info: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px'
    },
    rating: {
      display: 'flex',
      alignItems: 'center'
    },
    star: {
      color: '#FFB400',
      marginRight: '5px'
    },
    dataSource: {
      marginTop: '20px',
      padding: '10px',
      backgroundColor: useStatic ? '#FFF3CD' : '#D1E7DD',
      borderRadius: '4px',
      color: useStatic ? '#856404' : '#155724'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Chargement des restaurants...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Restaurants</h1>
      
      {useStatic && (
        <div style={styles.dataSource}>
          <p><strong>Attention:</strong> Affichage des données statiques de test. Pas de connexion à l'API.</p>
        </div>
      )}
      
      {!useStatic && (
        <div style={styles.dataSource}>
          <p><strong>Succès:</strong> Données chargées depuis l'API.</p>
        </div>
      )}
      
      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button 
            style={styles.button}
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      )}
      
      {restaurants.length === 0 ? (
        <p>Aucun restaurant disponible pour le moment.</p>
      ) : (
        <div style={styles.grid}>
          {restaurants.map((restaurant) => (
            <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
              <div style={styles.card}>
                <img
                  src={restaurant.image || 'https://via.placeholder.com/300x200'}
                  alt={restaurant.nom || restaurant.name}
                  style={styles.image}
                />
                <div style={styles.content}>
                  <h2 style={styles.title}>{restaurant.nom || restaurant.name}</h2>
                  <p>{restaurant.categories ? restaurant.categories[0] : restaurant.cuisine}</p>
                  <div style={styles.info}>
                    <div style={styles.rating}>
                      <span style={styles.star}>★</span>
                      <span>{restaurant.note || restaurant.rating}</span>
                    </div>
                    <span>{restaurant.tempsLivraisonEstime || restaurant.deliveryTime} min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList; 