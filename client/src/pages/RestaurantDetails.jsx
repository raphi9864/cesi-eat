import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Données statiques pour le prototype
  const restaurant = {
    id: parseInt(id),
    name: 'Restaurant ' + id,
    image: 'https://via.placeholder.com/800x300',
    cuisine: 'Cuisine variée',
    rating: 4.5,
    deliveryTime: '30-45 min',
    deliveryFee: '2.50€',
    address: '123 Rue du Restaurant, Ville',
    description: 'Un restaurant délicieux offrant une variété de plats pour tous les goûts.',
    categories: ['Entrées', 'Plats principaux', 'Desserts', 'Boissons']
  };

  const dishes = [
    {
      id: 1,
      name: 'Salade César',
      description: 'Salade romaine, croûtons, parmesan, sauce césar',
      price: 8.50,
      image: 'https://via.placeholder.com/150',
      category: 'Entrées'
    },
    {
      id: 2,
      name: 'Pizza Margherita',
      description: 'Tomate, mozzarella, basilic frais',
      price: 12.00,
      image: 'https://via.placeholder.com/150',
      category: 'Plats principaux'
    },
    {
      id: 3,
      name: 'Tiramisu',
      description: 'Dessert italien au café et mascarpone',
      price: 6.50,
      image: 'https://via.placeholder.com/150',
      category: 'Desserts'
    },
    {
      id: 4,
      name: 'Coca-Cola',
      description: 'Boisson gazeuse (33cl)',
      price: 2.50,
      image: 'https://via.placeholder.com/150',
      category: 'Boissons'
    }
  ];

  const filteredDishes = selectedCategory === 'all' 
    ? dishes 
    : dishes.filter(dish => dish.category === selectedCategory);

  const handleAddToCart = (dish) => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name
    });
    // Toast notification pourrait être ajouté ici
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête du restaurant */}
      <div className="mb-8">
        <div className="rounded-lg overflow-hidden shadow-md mb-4">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-64 object-cover"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
        <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
          <span>{restaurant.cuisine}</span>
          <span>•</span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{restaurant.rating}</span>
          </div>
          <span>•</span>
          <span>{restaurant.deliveryTime}</span>
          <span>•</span>
          <span>Frais de livraison: {restaurant.deliveryFee}</span>
        </div>
        <p className="mb-4">{restaurant.address}</p>
        <p className="text-gray-700">{restaurant.description}</p>
      </div>

      {/* Catégories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          <button 
            className={`px-4 py-2 rounded-full ${selectedCategory === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedCategory('all')}
          >
            Tous
          </button>
          {restaurant.categories.map((category) => (
            <button 
              key={category}
              className={`px-4 py-2 rounded-full ${selectedCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des plats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDishes.map((dish) => (
          <div key={dish.id} className="flex bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={dish.image} 
              alt={dish.name} 
              className="w-24 h-24 object-cover"
            />
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-semibold">{dish.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{dish.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{dish.price.toFixed(2)}€</span>
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
    </div>
  );
};

export default RestaurantDetails; 