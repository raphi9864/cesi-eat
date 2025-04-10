import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axiosConfig';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

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
    setError(null);
    
    try {
      // Vérifier que l'utilisateur est connecté
      if (!user || !user.id) {
        throw new Error('Vous devez être connecté pour passer une commande');
      }
      
      // Pour simplifier, nous prenons le premier restaurant si plusieurs
      const restaurantId = Object.keys(itemsByRestaurant)[0];
      const restaurantName = itemsByRestaurant[restaurantId].restaurantName;
      
      // Préparer les données de commande
      const orderData = {
        clientId: user.id,
        restaurantId: parseInt(restaurantId),
        restaurantName,
        items: items.map(item => ({
          dishId: item.id,
          name: item.name,
          price: typeof item.price === 'number' ? item.price : Number(item.price),
          quantity: item.quantity
        })),
        totalPrice: getTotal() + 2.99, // Total + frais de livraison
        deliveryAddress: user.address || "Adresse à définir", // Idéalement, récupérer depuis le profil
        deliveryNotes: "",
        paymentMethod: "card" // Valeur par défaut, à remplacer par un choix de l'utilisateur
      };
      
      console.log("Order data being sent:", orderData);

      // Try alternative approach with fetch() API as a fallback
      try {
        // First attempt with apiClient
        const response = await apiClient.post('/orders', orderData);
        console.log("Order created successfully with axios:", response.data);
      } catch (axiosError) {
        console.warn("Axios request failed, trying fetch as fallback:", axiosError);
        
        // Fallback to fetch API
        const token = localStorage.getItem('token');
        const fetchResponse = await fetch('http://localhost:4000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify(orderData),
        });
        
        if (!fetchResponse.ok) {
          throw new Error(`Server responded with ${fetchResponse.status}: ${await fetchResponse.text()}`);
        }
        
        console.log("Order created successfully with fetch");
      }
      
      // Redirection vers la page de commandes après validation
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Erreur lors du checkout:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Votre Panier</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-xl mb-6 text-gray-700">Votre panier est vide</p>
            <Link
              to="/restaurants"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Parcourir les restaurants
            </Link>
          </div>
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
            <div key={restaurantId} className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-white p-5 border-b">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.3 1.33A.75.75 0 0 0 8.9 1l-6 13.5c-.18.38.05.84.47.96l7 2c.12.04.25.04.38 0l7-2c.41-.12.64-.58.47-.96l-6-13.5a.75.75 0 0 0-.92-.67Z" />
                  </svg>
                  {restaurantName}
                </h2>
              </div>
              <div>
                {items.map((item) => (
                  <div key={item.id} className="p-5 border-b flex items-center hover:bg-gray-50 transition-colors">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md mr-5 shadow-md"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price).toFixed(2)}€</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="text-gray-600 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-l-md flex items-center justify-center transition-colors"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center bg-gray-50 text-gray-700 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        className="text-gray-600 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-r-md flex items-center justify-center transition-colors"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="ml-5 font-medium text-gray-800 w-20 text-right">
                      {typeof item.price === 'number' 
                        ? (item.price * item.quantity).toFixed(2) 
                        : (Number(item.price) * item.quantity).toFixed(2)}€
                    </div>
                    <button
                      className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => removeItem(item)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Résumé de commande */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 border border-gray-100">
            <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Résumé de commande
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-5">
              <div className="flex justify-between mb-3 text-gray-600">
                <span>Sous-total</span>
                <span className="font-medium">{getTotal().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between mb-3 text-gray-600">
                <span>Frais de livraison</span>
                <span className="font-medium">2.99€</span>
              </div>
              <div className="border-t border-gray-200 my-3"></div>
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span>{(getTotal() + 2.99).toFixed(2)}€</span>
              </div>
            </div>
            
            {error && (
              <div className="p-4 mb-5 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <button
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors shadow-md hover:shadow-lg mb-4 flex items-center justify-center gap-2"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Valider la commande
                </>
              )}
            </button>
            <button
              className="w-full py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 flex items-center justify-center gap-2"
              onClick={() => navigate('/restaurants')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Continuer les achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 