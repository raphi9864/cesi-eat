import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import apiClient from '../api/axiosConfig';
import placeholderImages from '../assets/images/placeholders';

import foodieHubIllustration from '../assets/images/Foodiehub_illustration.png';

const Home = () => {

  // States for API data
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetching all restaurants - adjust endpoint if needed (e.g., for featured/popular)
        const response = await apiClient.get('/restaurants'); 
        setRestaurants(response.data || []); // Ensure it's an array
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Impossible de charger les restaurants. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // --- Derived Data (Select restaurants to display) ---
  // Use the first restaurant for the featured card (or null if none)
  const featuredRestaurant = restaurants.length > 0 ? restaurants[0] : null;
  // Use the next 8 restaurants for the popular section
  const popularRestaurants = restaurants.slice(1, 9);

  return (
    <div className="bg-white text-gray-900 font-sans">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">

        {/* --- Loading State --- */}
        {loading && <div className="text-center py-16">Chargement des données...</div>}

        {/* --- Error State --- */}
        {error && <div className="text-center py-16 text-red-600">Erreur: {error}</div>}

        {/* --- Content (only render if not loading and no error) --- */}
        {!loading && !error && restaurants.length > 0 && (
          <>
            {/* --- Hero Section --- */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
              {/* Left Side: Text, Stats, Buttons */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-gray-900">
                  Explorez les <br />
                  restaurants et plats à proximité
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  Une sélection organisée de restaurants et de plats locaux.
                </p>

                {/* Stats - Adjusted text color */}
                <div className="flex justify-center md:justify-start space-x-8 mb-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{restaurants.reduce((sum, r) => sum + (r.dishes?.length || 0), 0)}+</p>
                    <p className="text-sm text-gray-600">Plats</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{restaurants.length}</p>
                    <p className="text-sm text-gray-600">Restaurants</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">5K+</p>
                    <p className="text-sm text-gray-600">Utilisateurs en ligne</p>
                  </div>
                </div>

                {/* Buttons - Changed primary to bg-primary (red), secondary to outline */}
                <div className="flex justify-center md:justify-start space-x-4">
                  <Link
                    to="/restaurants"
                    className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition duration-300"
                  >
                    Commencer l'exploration
                  </Link>
                  <button
                    type="button"
                    className="bg-white text-primary border border-primary px-6 py-3 rounded-md font-semibold hover:bg-primary hover:text-white transition duration-300"
                    onClick={() => alert('La fonctionnalité Ajouter au panier doit être implémentée.')}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>

              {/* Right Side: Featured Restaurant Card - Uses featuredRestaurant from API */}
              {featuredRestaurant && (
                <div className="flex-1 flex justify-center md:justify-end">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-sm border border-gray-200">
                    <img 
                      src={featuredRestaurant.images?.[0] || featuredRestaurant.imageUrl || featuredRestaurant.image || placeholderImages.featured} 
                      alt={featuredRestaurant.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        if (e.target.src !== placeholderImages.featured) {
                          e.target.src = placeholderImages.featured;
                        }
                      }}
                    />
                    <div className="bg-white p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500">{featuredRestaurant.cuisine || 'Restaurant'}</p>
                          <p className="text-lg font-semibold flex items-center text-gray-900">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" /> 
                            {typeof featuredRestaurant.rating === 'number' ? featuredRestaurant.rating.toFixed(1) : (typeof featuredRestaurant.rating === 'string' ? parseFloat(featuredRestaurant.rating).toFixed(1) : 'N/A')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500">Temps estimé</p>
                          <p className="text-lg font-semibold text-gray-900">{featuredRestaurant.delivery_time || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="flex-1 bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition duration-300"
                          onClick={() => alert('La fonctionnalité Commander maintenant doit être implémentée.')}
                        >
                          Commander maintenant
                        </button>
                        <Link 
                          to={`/restaurants/${featuredRestaurant.id}`}
                          className="flex-1 bg-white text-primary border border-primary py-2 rounded-md text-sm text-center font-medium hover:bg-primary hover:text-white transition duration-300"
                        >
                          Voir le menu
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --- Popular Restaurants Section (Replaces Popular Dishes) --- */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center md:text-left text-gray-900">Restaurants Populaires</h2>
              {popularRestaurants.length === 0 ? (
                 <p className="text-gray-600 text-center">Aucun autre restaurant populaire à afficher pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularRestaurants.map((resto) => (
                    <Link key={resto.id} to={`/restaurants/${resto.id}`} className="block group">
                       <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 group-hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                         <img 
                           src={resto.images?.[0] || resto.imageUrl || resto.image || placeholderImages.restaurant} 
                           alt={resto.name} 
                           className="w-full h-40 object-cover"
                           onError={(e) => {
                             if (e.target.src !== placeholderImages.restaurant) {
                               e.target.src = placeholderImages.restaurant;
                             }
                           }}
                         />
                         <div className="p-4 flex-grow flex flex-col">
                           <h3 className="font-semibold text-lg mb-1 text-gray-900">{resto.name}</h3>
                           <p className="text-sm text-gray-600 mb-2">{resto.cuisine}</p>
                           <div className="flex items-center text-sm text-gray-700 mb-4 mt-auto pt-2">
                              <StarIcon className="h-4 w-4 text-yellow-400 mr-1 flex-shrink-0" /> 
                              <span>{typeof resto.rating === 'number' ? resto.rating.toFixed(1) : (typeof resto.rating === 'string' ? parseFloat(resto.rating).toFixed(1) : 'N/D')}</span>
                              <span className="mx-2 text-gray-300">•</span>
                              <MapPinIcon className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                              <span className="truncate" title={resto.address}>{resto.address?.split(',')[1] || resto.address?.split(',')[0] || 'Emplacement'}</span> 
                           </div>
                         </div>
                       </div>
                     </Link>
                  ))}
                </div>
               )}
            </div>

            {/* --- Discover Section --- Changed background to white, added border */}
            <div className="bg-white rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 mb-16 border border-gray-200">
               <div className="flex-shrink-0">
                 <img src={foodieHubIllustration} alt="Illustration Découverte Saveurs" className="max-w-xs h-auto" />
               </div>

               <div className="flex-1">
                 <h2 className="text-3xl font-bold mb-4 text-gray-900">
                   Découvrez de nouvelles saveurs avec la collection de plats et cuisines tendance de FoodieHub.
                 </h2>
                 <div className="flex">
                   <input 
                     type="text" 
                     placeholder="Entrez votre localisation ici"
                     className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                   />
                   <button 
                     type="button"
                     className="bg-primary text-white px-6 py-3 rounded-r-md font-semibold hover:bg-primary-dark transition duration-300 flex items-center"
                   >
                     <MagnifyingGlassIcon className="h-5 w-5 mr-2" /> Rechercher
                   </button>
                 </div>
               </div>
            </div>
          </>
        )}
        
        {/* Show message if no restaurants are found after loading */}
        {!loading && !error && restaurants.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              Aucun restaurant trouvé pour le moment.
            </div>
        )}

      </div>

       {/* --- Footer --- Background white, adjusted text/link colors */}
       <footer className="border-t border-gray-200 mt-16 bg-white">
         <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-700">
           <div className="flex space-x-6 mb-4 md:mb-0">
             <Link to="/" className="hover:text-primary">Commander</Link>
             <Link to="/restaurants" className="hover:text-primary">Explorer Menu</Link>
             <Link to="/orders" className="hover:text-primary">Suivre Commande</Link> 
             <Link to="#" className="hover:text-primary">Notifications</Link> 
           </div>
           <div>
             © FoodieHub 2024
           </div>
         </div>
       </footer>

    </div>
  );
};

export default Home;
