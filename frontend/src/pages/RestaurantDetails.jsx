import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useCart } from '../contexts/CartContext';
import placeholderImages from '../assets/images/placeholders';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch restaurant details
        const restaurantResponse = await apiClient.get(`/restaurants/${id}`);
        const dishesResponse = await apiClient.get(`/restaurants/${id}/dishes`);
        
        setRestaurantData({
          ...restaurantResponse.data,
          dishes: dishesResponse.data
        });
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
        if (err.response) {
            if (err.response.status === 404) {
                setError('Restaurant not found.');
            } else {
                setError('Failed to fetch restaurant details. Please try again later.');
            }
        } else {
             setError('Network error or CORS issue. Check console for details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]); // Re-fetch if id changes

  // Handle Loading State
  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading restaurant details...</div>;
  }

  // Handle Error State
  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error: {error}</div>;
  }

  // Handle No Data Found
  if (!restaurantData) {
    return <div className="container mx-auto px-4 py-8 text-center">Restaurant data not available.</div>;
  }

  // Assume restaurantData contains restaurant details and an array `dishes`
  const { dishes = [], categories = [], ...restaurant } = restaurantData;

  const filteredDishes = selectedCategory === 'all' 
    ? dishes 
    : dishes.filter(dish => dish.category === selectedCategory);

  const handleAddToCart = (dish) => {
    addItem({
      id: dish.id || dish._id, // Use _id if provided by MongoDB
      name: dish.name,
      price: dish.price,
      image: dish.imageUrl || dish.image, // Assume API provides imageUrl or image
      restaurantId: restaurant.id || restaurant._id,
      restaurantName: restaurant.name
    });
    // Optional: Add toast notification
  };

  // Extract categories from dishes if not provided separately
  const availableCategories = categories.length > 0 
    ? categories 
    : [...new Set(dishes.map(d => d.category))].filter(Boolean);

  // Fonction pour choisir l'image de secours selon le type de cuisine
  const getFallbackImageByCuisine = (cuisine) => {
    if (!cuisine) return placeholderImages.restaurantBanner;
    
    const lowerCuisine = cuisine.toLowerCase();
    
    if (lowerCuisine.includes('thai')) return placeholderImages.thai;
    if (lowerCuisine.includes('indian') || lowerCuisine.includes('curry')) return placeholderImages.curry;
    if (lowerCuisine.includes('italian') || lowerCuisine.includes('pasta') || lowerCuisine.includes('pizza')) return placeholderImages.italian;
    if (lowerCuisine.includes('japan') || lowerCuisine.includes('sushi') || lowerCuisine.includes('asiat')) return placeholderImages.japanese;
    if (lowerCuisine.includes('bbq') || lowerCuisine.includes('barbecue') || lowerCuisine.includes('grill')) return placeholderImages.bbq;
    if (lowerCuisine.includes('vegan') || lowerCuisine.includes('vegetarian') || lowerCuisine.includes('veggie')) return placeholderImages.vegan;
    if (lowerCuisine.includes('seafood') || lowerCuisine.includes('fish') || lowerCuisine.includes('sea')) return placeholderImages.seafood;
    if (lowerCuisine.includes('mediterranean') || lowerCuisine.includes('greek') || lowerCuisine.includes('lebanese')) return placeholderImages.mediterranean;
    
    return placeholderImages.restaurantBanner;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête du restaurant */}
      <div className="mb-8">
        <div className="rounded-lg overflow-hidden shadow-md mb-4">
          <img 
            src={restaurant.imageUrl || restaurant.image || restaurant.images?.[0] || getFallbackImageByCuisine(restaurant.cuisine)} 
            alt={restaurant.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              if (e.target.src !== getFallbackImageByCuisine(restaurant.cuisine)) {
                e.target.src = getFallbackImageByCuisine(restaurant.cuisine);
              }
            }}
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-gray-600">
          {restaurant.cuisine && <span>{restaurant.cuisine}</span>}
          {restaurant.cuisine && <span>•</span>}
          {restaurant.rating && (
              <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>
                      {typeof restaurant.rating === 'string' 
                          ? parseFloat(restaurant.rating).toFixed(1) 
                          : typeof restaurant.rating === 'number' 
                              ? restaurant.rating.toFixed(1) 
                              : 'N/A'}
                  </span>
              </div>
          )}
          {restaurant.rating && <span>•</span>}
          {restaurant.deliveryTime && <span>{restaurant.deliveryTime}</span>}
          {restaurant.deliveryTime && <span>•</span>}
          {restaurant.deliveryFee && <span>Frais de livraison: {typeof restaurant.deliveryFee === 'number' ? `${restaurant.deliveryFee.toFixed(2)}€` : restaurant.deliveryFee}</span>}
        </div>
        {restaurant.address && <p className="mb-4">{restaurant.address}</p>}
        {restaurant.description && <p className="text-gray-700">{restaurant.description}</p>}
      </div>

      {/* Catégories */}
      {availableCategories.length > 0 && (
          <div className="mb-8 overflow-x-auto">
              <div className="flex space-x-4 pb-2">
                  <button
                      className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === 'all'
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-800'}`}
                      onClick={() => setSelectedCategory('all')}
                  >
                      Tous
                  </button>
                  {availableCategories.map((category) => (
                      <button
                          key={category}
                          className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === category
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 text-gray-800'}`}
                          onClick={() => setSelectedCategory(category)}
                      >
                          {category}
                      </button>
                  ))}
              </div>
          </div>
      )}

      {/* Liste des plats */}
      <h2 className="text-2xl font-semibold mb-4">Menu</h2>
      {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDishes.map((dish) => (
                  <div key={dish.id || dish._id} className="flex bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                          src={dish.imageUrl || dish.image || placeholderImages.dish} 
                          alt={dish.name}
                          className="w-24 h-24 object-cover flex-shrink-0"
                          onError={(e) => {
                            if (e.target.src !== placeholderImages.dish) {
                              e.target.src = placeholderImages.dish;
                            }
                          }}
                      />
                      <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                              <h3 className="font-semibold">{dish.name}</h3>
                              {dish.description && <p className="text-gray-600 text-sm mb-2">{dish.description}</p>}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                              <span className="font-medium">
                                  {typeof dish.price === 'string' 
                                      ? `${parseFloat(dish.price).toFixed(2)}€`
                                      : dish.price 
                                          ? `${dish.price.toFixed(2)}€` 
                                          : 'Prix non disponible'}
                              </span>
                              <button
                                  onClick={() => handleAddToCart(dish)}
                                  className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark text-sm whitespace-nowrap"
                              >
                                  Ajouter
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      ) : (
          <p>Aucun plat disponible pour cette catégorie.</p>
      )}
    </div>
  );
};

export default RestaurantDetails;