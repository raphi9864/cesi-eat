import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axiosConfig';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.id || !user.role) return;

      setLoading(true);
      try {
        let response;
        // Différentes routes selon le rôle de l'utilisateur
        switch (user.role) {
          case 'client':
            response = await apiClient.get(`/orders/client/${user.id}`);
            break;
          case 'restaurant':
            response = await apiClient.get(`/orders/restaurant/${user.id}`);
            break;
          case 'delivery':
            response = await apiClient.get(`/orders/delivery/${user.id}`);
            break;
          default:
            throw new Error('Role non reconnu');
        }
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Impossible de charger les commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p>Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Livré
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            En cours
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            Annulé
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Affichage s'il n'y a pas de commandes
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-xl mb-6">Vous n'avez pas encore de commandes</p>
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

  // Affichage de la liste des commandes
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex flex-wrap justify-between items-center">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-lg">Commande #{order.id}</h2>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-gray-600 text-sm">{formatDate(order.date)}</p>
              </div>
              <div className="text-right">
                {order.restaurant_id && (
                  <Link 
                    to={`/restaurants/${order.restaurant_id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {order.restaurant_name || 'Restaurant'}
                  </Link>
                )}
                <p className="text-gray-700 font-bold">
                  {typeof order.total === 'number' 
                    ? `${order.total.toFixed(2)}€`
                    : 'Prix non disponible'}
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Articles commandés</h3>
                <ul className="space-y-2">
                  {order.items && order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>
                        {item.quantity} x {item.name}
                      </span>
                      <span className="text-gray-700">
                        {typeof item.price === 'number' && typeof item.quantity === 'number'
                          ? `${(item.price * item.quantity).toFixed(2)}€`
                          : 'Prix non disponible'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Livraison</h3>
                {order.delivery ? (
                  <>
                    <p className="text-gray-700">{order.delivery.address}</p>
                    <p className="text-gray-700">
                      Temps estimé: <span className="font-medium">{order.delivery.time}</span>
                    </p>
                  </>
                ) : (
                  <p className="text-gray-700">Informations de livraison non disponibles</p>
                )}
              </div>
              
              {order.status === 'processing' && (
                <div className="mt-4 text-right">
                  <button className="text-red-500 hover:underline">
                    Annuler la commande
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;