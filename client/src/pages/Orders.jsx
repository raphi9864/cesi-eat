import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderApi from '../api/orderApi';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderApi.getUserOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des commandes:', err);
        setError('Erreur lors du chargement des commandes. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getStatusBadge = (status) => {
    let color = '';
    let text = '';

    switch (status) {
      case 'pending':
        color = 'bg-yellow-100 text-yellow-800';
        text = 'En attente';
        break;
      case 'processing':
        color = 'bg-blue-100 text-blue-800';
        text = 'En préparation';
        break;
      case 'delivered':
        color = 'bg-green-100 text-green-800';
        text = 'Livré';
        break;
      case 'cancelled':
        color = 'bg-red-100 text-red-800';
        text = 'Annulé';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
        text = status;
    }

    return (
      <span className={`${color} px-2 py-1 rounded-full text-xs`}>{text}</span>
    );
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderApi.cancelOrder(orderId);
      // Mettre à jour l'état local après l'annulation
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
    } catch (err) {
      console.error('Erreur lors de l\'annulation de la commande:', err);
      alert('Impossible d\'annuler la commande. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <p className="text-lg">Chargement de vos commandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-xl mb-6">Veuillez vous connecter pour voir vos commandes</p>
          <Link
            to="/login"
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

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
                <p className="text-gray-600 text-sm">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <Link 
                  to={`/restaurants/${order.restaurant.id}`}
                  className="text-primary hover:underline font-medium"
                >
                  {order.restaurant.nom || order.restaurant.name}
                </Link>
                <p className="text-gray-700 font-bold">{order.total.toFixed(2)}€</p>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Articles commandés</h3>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>
                        {item.quantity} x {item.nom || item.name}
                      </span>
                      <span className="text-gray-700">
                        {((item.prix || item.price) * item.quantity).toFixed(2)}€
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Livraison</h3>
                <p className="text-gray-700">{order.address}</p>
                <p className="text-gray-700">
                  Temps estimé: <span className="font-medium">{order.estimatedDeliveryTime}</span>
                </p>
              </div>
              
              {order.status === 'processing' && (
                <div className="mt-4 text-right">
                  <button 
                    className="text-red-500 hover:underline"
                    onClick={() => handleCancelOrder(order.id)}
                  >
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