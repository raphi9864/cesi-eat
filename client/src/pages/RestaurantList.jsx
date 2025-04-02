import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantList = () => {
  const restaurants = [
    { 
      id: 1, 
      name: 'Pizza Deluxe', 
      image: 'https://via.placeholder.com/300x200', 
      cuisine: 'Italien', 
      rating: 4.5,
      deliveryTime: '30-45 min'
    },
    { 
      id: 2, 
      name: 'Burger King', 
      image: 'https://via.placeholder.com/300x200', 
      cuisine: 'Fast Food', 
      rating: 4.2,
      deliveryTime: '20-35 min'
    },
    { 
      id: 3, 
      name: 'Sushi Master', 
      image: 'https://via.placeholder.com/300x200', 
      cuisine: 'Japonais', 
      rating: 4.8,
      deliveryTime: '40-55 min'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{restaurant.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{restaurant.deliveryTime}</span>
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