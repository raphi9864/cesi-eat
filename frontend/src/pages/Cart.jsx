import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Regrouper les articles par restaurant
  const itemsByRestaurant = items.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = {
        restaurantName: item.restaurantName,
        items: []
      };
    }
    acc[item.restaurantId].items.push(item);
    return acc;
  }, {});

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(item);
    } else {
      updateQuantity(item, newQuantity);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Simulation d'un appel API pour créer une commande
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirection vers la page de commandes après validation
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Erreur lors du checkout:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Votre Panier</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-xl mb-6">Votre panier est vide</p>
          <Link
            to="/restaurants"
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark"
          >
            Parcourir les restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Votre Panier</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Articles du panier */}
        <div className="lg:col-span-2">
          {Object.entries(itemsByRestaurant).map(([restaurantId, { restaurantName, items }]) => (
            <div key={restaurantId} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div className="bg-gray-100 p-4 border-b">
                <h2 className="text-xl font-semibold">{restaurantName}</h2>
              </div>
              <div>
                {items.map((item) => (
                  <div key={item.id} className="p-4 border-b flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">{item.price.toFixed(2)}€</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="text-gray-500 bg-gray-200 px-2 py-1 rounded-l-md"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-100">
                        {item.quantity}
                      </span>
                      <button
                        className="text-gray-500 bg-gray-200 px-2 py-1 rounded-r-md"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="ml-4 font-medium">
                      {(item.price * item.quantity).toFixed(2)}€
                    </div>
                    <button
                      className="ml-4 text-red-500"
                      onClick={() => removeItem(item)}
                    >
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Résumé de commande */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Résumé de commande</h2>
            <div className="border-t border-b py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Sous-total</span>
                <span>{getTotal().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Frais de livraison</span>
                <span>2.99€</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>{(getTotal() + 2.99).toFixed(2)}€</span>
            </div>
            <button
              className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary-dark disabled:opacity-50"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Traitement en cours...' : 'Valider la commande'}
            </button>
            <button
              className="w-full text-gray-600 py-3 mt-3 rounded-md font-semibold border border-gray-300 hover:bg-gray-100"
              onClick={() => navigate('/restaurants')}
            >
              Continuer les achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 