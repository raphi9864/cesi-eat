import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import restaurantApi from '../api/restaurantApi';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        // Récupérer les détails du restaurant
        const restaurantData = await restaurantApi.getRestaurantById(id);
        setRestaurant(restaurantData);

        // Récupérer les plats du restaurant
        const dishesData = await restaurantApi.getDishesByRestaurantId(id);
        setDishes(dishesData);
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données du restaurant:', err);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  // Extraire les catégories uniques des plats
  const categories = dishes && dishes.length > 0 
    ? ['all', ...new Set(dishes.map(dish => dish.categorie || dish.category))]
    : ['all'];

  const filteredDishes = selectedCategory === 'all' 
    ? dishes 
    : dishes.filter(dish => (dish.categorie || dish.category) === selectedCategory);

  const handleAddToCart = (dish) => {
    addItem({
      id: dish.id,
      name: dish.nom || dish.name,
      price: dish.prix || dish.price,
      image: dish.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.nom || restaurant.name
    });
    // Notification pourrait être ajoutée ici
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <p className="text-lg">Chargement des données du restaurant...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-4 bg-primary text-white px-4 py-2 rounded" 
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Restaurant non trouvé.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête du restaurant */}
      <div className="mb-8">
        <div className="rounded-lg overflow-hidden shadow-md mb-4">
          <img 
            src={restaurant.image} 
            alt={restaurant.nom || restaurant.name} 
            className="w-full h-64 object-cover"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">{restaurant.nom || restaurant.name}</h1>
        <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
          <span>{restaurant.cuisine}</span>
          <span>•</span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{restaurant.note || restaurant.rating}</span>
          </div>
          <span>•</span>
          <span>{restaurant.tempsLivraisonEstime || restaurant.deliveryTime}</span>
          <span>•</span>
          <span>Frais de livraison: {restaurant.fraisLivraison || restaurant.deliveryFee}</span>
        </div>
        <p className="mb-4">{restaurant.rue || restaurant.address} {restaurant.ville && `, ${restaurant.ville}`}</p>
        <p className="text-gray-700">{restaurant.description}</p>
      </div>

      {/* Catégories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          {categories.map((category) => (
            <button 
              key={category}
              className={`px-4 py-2 rounded-full ${selectedCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'Tous' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des plats */}
      {filteredDishes.length === 0 ? (
        <p>Aucun plat disponible dans cette catégorie.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDishes.map((dish) => (
            <div key={dish.id} className="flex bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={dish.image || 'https://via.placeholder.com/150'} 
                alt={dish.nom || dish.name} 
                className="w-24 h-24 object-cover"
              />
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold">{dish.nom || dish.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{dish.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{(dish.prix || dish.price).toFixed(2)}€</span>
                  <button 
                    onClick={() => handleAddToCart(dish)}
                    className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails; 