import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get('/restaurants');
        setRestaurants(response.data);
        console.log('Fetched Restaurants:', response.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to fetch restaurants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error: {error}</div>;
  }

  if (restaurants.length === 0) {
    return <div className="container mx-auto px-4 py-8 text-center">No restaurants found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Link to={`/restaurants/${restaurant.id || restaurant._id}`} key={restaurant.id || restaurant._id}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img
                src={restaurant.images?.[0] || restaurant.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={restaurant.name}
                className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity duration-200"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                {restaurant.cuisine && <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>}
                <div className="flex justify-between items-center">
                  {restaurant.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{!isNaN(parseFloat(restaurant.rating)) ? parseFloat(restaurant.rating).toFixed(1) : 'N/A'}</span>
                    </div>
                  )}
                  {restaurant.deliveryTime && (
                    <span className="text-gray-500 text-sm">{restaurant.deliveryTime}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList; 