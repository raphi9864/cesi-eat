import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axiosConfig';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, [user]);

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

  const cancelOrder = async (orderId) => {
    if (!orderId) return;
    
    setCancellingOrderId(orderId);
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status: 'cancelled' });
      // Mettre à jour l'état local
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' } 
            : order
        )
      );
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Impossible d\'annuler la commande');
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Chargement des commandes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium text-lg">{error}</p>
            <button 
              onClick={fetchOrders} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Affichage s'il n'y a pas de commandes
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-xl mb-6 text-gray-700">Vous n'avez pas encore de commandes</p>
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Livré
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            En attente
          </span>
        );
      case 'processing':
        return (
          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
            En préparation
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
            Prêt à être livré
          </span>
        );
      case 'on_delivery':
        return (
          <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
            En cours de livraison
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            Annulé
          </span>
        );
      default:
        return null;
    }
  };

  const getOrderStatusTimeline = (status) => {
    const steps = [
      { key: 'pending', label: 'Commande reçue', icon: '📋' },
      { key: 'processing', label: 'En préparation', icon: '👨‍🍳' },
      { key: 'ready_for_pickup', label: 'Prêt pour livraison', icon: '📦' },
      { key: 'on_delivery', label: 'En cours de livraison', icon: '🚚' },
      { key: 'delivered', label: 'Livré', icon: '✅' }
    ];
    
    let currentStepIndex = steps.findIndex(step => step.key === status);
    if (currentStepIndex === -1) currentStepIndex = 0;
    
    if (status === 'cancelled') {
      return (
        <div className="mt-4 py-3 px-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>Cette commande a été annulée</span>
        </div>
      );
    }
    
    return (
      <div className="mt-6 mb-2">
        <div className="w-full bg-gray-100 rounded-lg p-4">
          <ol className="relative flex flex-col md:flex-row md:items-center">
            {steps.map((step, idx) => {
              const isActive = idx <= currentStepIndex;
              const isCurrentStep = idx === currentStepIndex;
              
              return (
                <li key={step.key} className={`flex-1 ${idx < steps.length - 1 ? 'mb-6 md:mb-0' : ''}`}>
                  <div className="flex items-center md:block md:text-center">
                    {/* Step Indicator */}
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full
                      ${isActive 
                        ? isCurrentStep 
                          ? 'bg-primary text-white ring-4 ring-primary-light animate-pulse' 
                          : 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-500'
                      } mb-0 md:mb-2 md:mx-auto z-10
                    `}>
                      <span>{step.icon}</span>
                    </div>
                    
                    {/* Step Label */}
                    <div className="ml-3 md:ml-0">
                      <h3 className={`
                        font-medium text-sm 
                        ${isActive ? 'text-gray-900' : 'text-gray-500'}
                      `}>
                        {step.label}
                      </h3>
                      
                      {isCurrentStep && (
                        <p className="text-xs text-primary-dark font-medium md:hidden">En cours</p>
                      )}
                    </div>
                    
                    {/* Connector Line - Only visible on desktop */}
                    {idx < steps.length - 1 && (
                      <div className={`
                        hidden md:block absolute h-0.5 top-5 
                        ${isActive && idx < currentStepIndex ? 'bg-primary' : 'bg-gray-300'}`} 
                        style={{ 
                          left: `${(idx * 100) / (steps.length - 1) + 5}%`, 
                          right: `${100 - ((idx + 1) * 100) / (steps.length - 1) + 5}%` 
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Vertical connector - Only visible on mobile */}
                  {idx < steps.length - 1 && (
                    <div className={`
                      md:hidden absolute h-full w-0.5 left-5 -ml-px top-0 mt-10
                      ${isActive && idx < currentStepIndex ? 'bg-primary' : 'bg-gray-300'}`} 
                      style={{ height: 'calc(100% - 2.5rem)' }}
                    />
                  )}
                </li>
              );
            })}
          </ol>
          
          {/* Current Status Text */}
          <div className="mt-4 text-center hidden md:block">
            <p className={`
              inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full
              ${status === 'pending' ? 'bg-blue-100 text-blue-800' : 
                status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                status === 'ready_for_pickup' ? 'bg-purple-100 text-purple-800' :
                status === 'on_delivery' ? 'bg-indigo-100 text-indigo-800' :
                'bg-green-100 text-green-800'
              }
            `}>
              <span className="relative flex h-2 w-2">
                <span className={`
                  animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                  ${status === 'pending' ? 'bg-blue-400' : 
                    status === 'processing' ? 'bg-yellow-400' :
                    status === 'ready_for_pickup' ? 'bg-purple-400' :
                    status === 'on_delivery' ? 'bg-indigo-400' :
                    'bg-green-400'
                  }
                `}></span>
                <span className={`
                  relative inline-flex rounded-full h-2 w-2
                  ${status === 'pending' ? 'bg-blue-500' : 
                    status === 'processing' ? 'bg-yellow-500' :
                    status === 'ready_for_pickup' ? 'bg-purple-500' :
                    status === 'on_delivery' ? 'bg-indigo-500' :
                    'bg-green-500'
                  }
                `}></span>
              </span>
              {status === 'pending' ? 'Commande en attente' :
                status === 'processing' ? 'Commande en préparation' :
                status === 'ready_for_pickup' ? 'Prêt à être livré' :
                status === 'on_delivery' ? 'En cours de livraison' :
                'Commande livrée'
              }
            </p>
          </div>
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Trier les commandes par date (plus récente en premier)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );

  // Affichage de la liste des commandes
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
      
      <div className="space-y-6">
        {sortedOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl">
            <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-b flex flex-wrap justify-between items-center">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-bold text-lg text-gray-800">Commande #{order.id}</h2>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-gray-500 text-sm mt-1">{formatDate(order.created_at)}</p>
              </div>
              <div className="flex flex-col items-end">
                {order.restaurant_id && (
                  <Link 
                    to={`/restaurants/${order.restaurant_id}`}
                    className="text-primary hover:text-primary-dark font-medium transition-colors flex items-center gap-1"
                  >
                    <span>{order.restaurant_name || 'Restaurant'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                )}
                <p className="text-gray-800 font-bold text-lg mt-1">
                  {typeof order.total_price === 'number' 
                    ? `${order.total_price.toFixed(2)}€`
                    : 'Prix non disponible'}
                </p>
              </div>
            </div>

            {/* Statut de la commande avec visualisation */}
            <div className="px-5">
              {getOrderStatusTimeline(order.status)}
            </div>
            
            <div className="p-5">
              <div className="mb-5">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Articles commandés
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="divide-y divide-gray-200">
                    {order.items && order.items.map((item, index) => (
                      <li key={index} className="flex justify-between py-2 first:pt-0 last:pb-0">
                        <span className="flex items-center">
                          <span className="w-6 h-6 bg-primary-light text-primary rounded-full flex items-center justify-center text-xs mr-2">
                            {item.quantity}
                          </span>
                          <span className="text-gray-700">{item.name}</span>
                        </span>
                        <span className="font-medium text-gray-800">
                          {typeof item.price === 'number' && typeof item.quantity === 'number'
                            ? `${(item.price * item.quantity).toFixed(2)}€`
                            : 'Prix non disponible'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="border-t pt-5">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Livraison
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{order.delivery_address}</p>
                  {order.delivery_notes && (
                    <p className="text-gray-700 mt-2 pt-2 border-t border-gray-200">
                      <span className="font-medium">Notes:</span> {order.delivery_notes}
                    </p>
                  )}
                </div>
              </div>
              
              {(order.status === 'pending' || order.status === 'processing') && (
                <div className="mt-5 flex justify-end">
                  <button 
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                    onClick={() => cancelOrder(order.id)}
                    disabled={cancellingOrderId === order.id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {cancellingOrderId === order.id ? 'Annulation en cours...' : 'Annuler la commande'}
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