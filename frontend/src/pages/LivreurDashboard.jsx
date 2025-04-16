import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axiosConfig';

const LivreurDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');

  // States for API data
  const [activeDeliveriesData, setActiveDeliveriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch active deliveries for the current user
  useEffect(() => {
    if (!user?.id) {
      // setError('Impossible de récupérer l'ID du livreur connecté.');
      setLoading(false); // Don't show loading if no user ID
      return;
    }

    const fetchActiveDeliveries = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the Nginx route /api/delivery/ which proxies to delivery_service
        const response = await apiClient.get(`/delivery/deliveries/person/${user.id}`);
        setActiveDeliveriesData(response.data);
      } catch (err) {
        console.error('Error fetching active deliveries:', err);
        setError('Impossible de charger les livraisons actives. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchActiveDeliveries();
  }, [user]);

  const getTimeSince = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins === 1) return 'Il y a 1 minute';
    if (diffMins < 60) return `Il y a ${diffMins} minutes`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return 'Il y a 1 heure';
    if (diffHours < 24) return `Il y a ${diffHours} heures`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Hier';
    return `Il y a ${diffDays} jours`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'assigned': return 'Assignée';
      case 'picking_up':
      case 'picked-up': return 'Récupérée';
      case 'delivering': return 'En cours de livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status || 'Inconnu';
    }
  };

  const acceptDelivery = async (id) => {
    console.log('TODO: Accept delivery via API:', id);
    // Requires backend endpoint for available deliveries and accepting them
    // Example:
    // try {
    //   await apiClient.post(`/delivery/deliveries/${id}/accept`, { deliveryPersonId: user.id });
    //   // Re-fetch or update state
    // } catch (err) { ... }
  };

  const updateDeliveryStatus = async (id, status) => {
    console.log('TODO: Update delivery status via API:', id, status);
    // Example:
    // try {
    //   const response = await apiClient.patch(`/delivery/deliveries/${id}/status`, { status });
    //   setActiveDeliveriesData(prev => prev.map(d => d.id === id ? response.data : d));
    // } catch (err) {
    //   console.error("Failed to update delivery status", err);
    //   // Handle error
    // }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Livreur</h1>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab('available')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'available'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Livraisons disponibles {/* Count? Requires API */}
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'active'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Mes livraisons ({loading ? '...' : activeDeliveriesData.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'history'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Historique {/* Count? Requires API */}
        </button>
      </div>

      {/* Display loading state */}
      {loading && <div className="p-4 text-center">Chargement...</div>}

      {/* Display error state */}
      {error && <div className="p-4 text-center text-red-600">Erreur: {error}</div>}

      {/* --- Tab Content (only render when not loading/error) --- */}
      {!loading && !error && (
        <>
          {/* Available Deliveries Tab - Placeholder */}
          {activeTab === 'available' && (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-600">
                Fonctionnalité "Livraisons disponibles" non connectée à l'API pour le moment.
              </p>
              {/* Placeholder for future implementation
              {availableDeliveriesFromAPI.length === 0 ? (...) : (...map...)}
              */}
            </div>
          )}

          {/* Active Deliveries Tab - Using API Data */}
          {activeTab === 'active' && (
            <div>
              {activeDeliveriesData.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-md">
                  <p className="text-xl text-gray-600">
                    Vous n'avez pas de livraison en cours.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeDeliveriesData.map((delivery) => (
                    <div key={delivery.id || delivery._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                         {/* Adapt based on actual delivery data structure from API */}
                        <div>
                           <h2 className="font-semibold">Commande #{delivery.order_id}</h2>
                           <p className="text-sm text-gray-500">Assignée {getTimeSince(delivery.assigned_at)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ 
                            delivery.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
                            delivery.status === 'picked-up' ? 'bg-yellow-100 text-yellow-800' : 
                            delivery.status === 'delivering' ? 'bg-purple-100 text-purple-800' : 
                            'bg-gray-100 text-gray-800' 
                        }`}>
                          {getStatusLabel(delivery.status)}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Adresses</h3>
                           {/* Pickup/Delivery locations likely JSON - need careful parsing */}
                          <p className="mb-1">
                            <span className="font-medium">Récupérer:</span> {delivery.pickup_location?.address || JSON.stringify(delivery.pickup_location) || 'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">Livrer:</span> {delivery.delivery_location?.address || JSON.stringify(delivery.delivery_location) || 'N/A'}
                          </p>
                        </div>
                        <div className="mb-4">
                           <h3 className="font-medium mb-2">Infos</h3>
                           {/* Add more relevant details if available from API */}
                           <p>ID Livraison: <span className="font-mono text-xs">{delivery.id}</span></p>
                           <p>Temps estimé: {delivery.estimated_delivery_time ? `${delivery.estimated_delivery_time} min` : 'N/A'}</p>
                        </div>
                         {/* Actions to update status */}
                         <div className="flex justify-end space-x-2">
                             {delivery.status === 'assigned' && (
                               <button 
                                 onClick={() => updateDeliveryStatus(delivery.id, 'picked-up')}
                                 className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                               >
                                 Récupérée
                               </button>
                             )}
                              {delivery.status === 'picked-up' && (
                               <button 
                                 onClick={() => updateDeliveryStatus(delivery.id, 'delivering')}
                                 className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
                               >
                                 En Livraison
                               </button>
                             )}
                              {delivery.status === 'delivering' && (
                                <button 
                                  onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                                >
                                  Livrée
                                </button>
                              )}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Delivery History Tab - Placeholder */}
          {activeTab === 'history' && (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-600">
                Fonctionnalité "Historique" non connectée à l'API pour le moment.
              </p>
               {/* Placeholder for future implementation
               {historyDeliveriesFromAPI.length === 0 ? (...) : (...map...)}
               */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LivreurDashboard; 