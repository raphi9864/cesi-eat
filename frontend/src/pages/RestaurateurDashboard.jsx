import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axiosConfig';

const RestaurateurDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  // States for API data
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [menu, setMenu] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  // States for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setError('Impossible de récupérer l\'ID du restaurant connecté.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data concurrently
        const [restaurantRes, menuRes, ordersRes] = await Promise.all([
          apiClient.get(`/restaurants/${user.id}`), // Fetch restaurant details
          apiClient.get(`/restaurants/${user.id}/dishes`), // Fetch menu items (dishes)
          apiClient.get(`/orders/restaurant/${user.id}`) // Fetch all orders for this restaurant
        ]);

        setRestaurantDetails(restaurantRes.data);
        setMenu(menuRes.data);
        setAllOrders(ordersRes.data);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        let errorMessage = 'Impossible de charger les données du tableau de bord.';
        if (err.response) {
          // Try to get more specific error
          errorMessage += ` (${err.response.status}): ${err.response.data?.message || err.message}`;
        } else if (err.request) {
          errorMessage += ' Problème de réseau ou service API indisponible.';
        } else {
          errorMessage += ` ${err.message}`;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // Re-fetch if user changes

  // --- Derived Data ---
  const currentOrders = allOrders.filter(
    order => !['delivered', 'cancelled'].includes(order.status?.toLowerCase())
  );
  const orderHistory = allOrders.filter(
    order => ['delivered', 'cancelled'].includes(order.status?.toLowerCase())
  );

  // --- Helper Functions (keep as is or adapt based on API data format) ---
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

  const getStatusBadge = (status) => {
    if (!status) return null;
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case 'new':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Nouvelle
          </span>
        );
      case 'preparing':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            En préparation
          </span>
        );
      case 'ready':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Prête
          </span>
        );
      case 'delivering':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
            En livraison
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            Livrée
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            Annulée
          </span>
        );
      default:
        return <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">{status}</span>;
    }
  };

  // --- Action Functions (placeholders - implement API calls later) ---
  const updateOrderStatus = async (id, status) => {
    console.log('TODO: Update order status via API:', id, status);
    // Example:
    // try {
    //   await apiClient.patch(`/orders/${id}`, { status });
    //   // Refresh orders or update local state optimistically/realistically
    //   setAllOrders(prevOrders => prevOrders.map(o => o.id === id ? { ...o, status } : o));
    // } catch (err) {
    //   console.error("Failed to update order status", err);
    //   // Handle error (e.g., show toast notification)
    // }
  };

  const toggleItemAvailability = async (id) => {
    console.log('TODO: Toggle availability for item via API:', id);
    // Example: Find item, determine new status, call API, update state
    // const item = menu.find(i => i.id === id);
    // if (!item) return;
    // const newAvailability = !item.is_available;
    // try {
    //   await apiClient.patch(`/dishes/${id}`, { is_available: newAvailability });
    //   setMenu(prevMenu => prevMenu.map(i => i.id === id ? { ...i, is_available: newAvailability } : i));
    // } catch (err) {
    //   console.error("Failed to update dish availability", err);
    // }
  };

  const updateRestaurantStatus = async (status) => {
    console.log('TODO: Update restaurant status via API:', status);
    // Example:
    // if (!restaurantDetails?.id) return;
    // try {
    //   await apiClient.patch(`/restaurants/${restaurantDetails.id}`, { status }); // Assuming status field exists
    //   setRestaurantDetails(prev => ({ ...prev, status }));
    // } catch (err) {
    //   console.error("Failed to update restaurant status", err);
    // }
  };

  // --- Render Logic ---
  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Chargement du tableau de bord...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Erreur: {error}</div>;
  }

  if (!restaurantDetails) {
     return <div className="container mx-auto px-4 py-8 text-center text-red-600">Impossible d'afficher les informations du restaurant.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header using fetched data */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{restaurantDetails.name || 'Gestion Restaurant'}</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">Statut:</span>
          <select
            className="border p-2 rounded-md"
            // Use status from fetched details, provide fallback
            value={restaurantDetails.status || 'closed'}
            onChange={(e) => updateRestaurantStatus(e.target.value)}
          >
            <option value="open">Ouvert</option>
            <option value="busy">Occupé</option>
            <option value="closed">Fermé</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'orders'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Commandes ({currentOrders.length}) {/* Show count */}
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'menu'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Menu ({menu.length}) {/* Show count */}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'history'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Historique ({orderHistory.length}) {/* Show count */}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'settings'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Paramètres
        </button>
      </div>

      {/* --- Tab Content --- */}

      {/* Current Orders Tab - Using derived currentOrders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold">Commandes en cours</h2>
            {/* Consider adding filtering/sorting options */}
          </div>
          <div className="overflow-x-auto">
            {currentOrders.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Aucune commande en cours.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                {/* ... thead ... */}
                 <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Commande</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reçue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <tr key={order.id || order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{order.id || order._id}</td>
                      {/* Adapt based on actual order data structure */}
                      <td className="px-6 py-4 whitespace-nowrap">{order.customerName || order.customer?.name || order.userId || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                         {/* Adapt based on actual order data structure */}
                        {order.items?.map((item, index) => (
                           <div key={item.dishId || index}>{item.quantity}x {item.name} ({item.price?.toFixed(2)}€)</div>
                        )) || (order.dishes?.map((dish, index) => (
                           <div key={dish.dishId || index}>{dish.quantity}x {dish.name} ({dish.price?.toFixed(2)}€)</div>
                        ))) || '-'}
                      </td>
                       {/* Adapt based on actual order data structure */}
                      <td className="px-6 py-4 whitespace-nowrap">{typeof order.totalPrice === 'number' ? `${order.totalPrice.toFixed(2)}€` : (typeof order.total === 'number' ? `${order.total.toFixed(2)}€` : 'N/A')}</td>
                       {/* Adapt based on actual order data structure */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTimeSince(order.createdAt || order.orderTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Basic status update dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id || order._id, e.target.value)}
                          className="border p-1 rounded-md text-sm"
                          disabled={['delivered', 'cancelled'].includes(order.status?.toLowerCase())} // Disable for history items
                        >
                          {/* Add more relevant statuses based on workflow */}
                          <option value="new" disabled={order.status !== 'new'}>Nouvelle</option>
                          <option value="preparing" disabled={!['new', 'preparing'].includes(order.status)}>Préparation</option>
                          <option value="ready" disabled={!['preparing', 'ready'].includes(order.status)}>Prête</option>
                          <option value="delivering" disabled={!['ready', 'delivering'].includes(order.status)}>En Livraison</option>
                          <option value="delivered" disabled>Livrée</option>
                          <option value="cancelled" disabled={['delivered', 'cancelled'].includes(order.status)}>Annuler</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Menu Management Tab - Using fetched menu */}
      {activeTab === 'menu' && (
        <div>
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
              Ajouter un article {/* TODO: Implement Add Item Modal/Page */}
            </button>
          </div>
          <div className="overflow-x-auto">
             {menu.length === 0 ? (
               <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow-md">Aucun article dans le menu.</div>
             ) : (
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left">Image</th>
                      <th className="py-3 px-4 text-left">Nom</th>
                      <th className="py-3 px-4 text-left">Description</th>
                      <th className="py-3 px-4 text-left">Catégorie</th>
                      <th className="py-3 px-4 text-left">Prix</th>
                      <th className="py-3 px-4 text-left">Disponibilité</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menu.map((item) => ( // item is likely a 'dish' from API
                      <tr key={item.id || item._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {/* Adapt based on actual dish data structure */}
                          <img src={item.image || item.imageUrl || 'https://via.placeholder.com/48'} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                        </td>
                        <td className="py-3 px-4">{item.name || 'N/A'}</td>
                        <td className="py-3 px-4">{item.description || '-'}</td>
                        <td className="py-3 px-4">{item.category || 'N/A'}</td>
                        <td className="py-3 px-4">{typeof item.price === 'number' ? `${item.price.toFixed(2)}€` : 'N/A'}</td>
                        <td className="py-3 px-4">
                           {/* Adapt based on actual dish data structure */}
                          <button
                            onClick={() => toggleItemAvailability(item.id || item._id)}
                            className={`py-1 px-3 rounded-full text-xs ${
                              item.is_available // Assuming boolean field 'is_available'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.is_available ? 'Disponible' : 'Indisponible'}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-500 hover:underline">
                              Modifier {/* TODO: Implement Edit */}
                            </button>
                            <button className="text-red-500 hover:underline">
                              Supprimer {/* TODO: Implement Delete */}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
          </div>
        </div>
      )}

      {/* Order History Tab - Using derived orderHistory */}
      {activeTab === 'history' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Historique des commandes</h2>
          <div className="overflow-x-auto">
             {orderHistory.length === 0 ? (
               <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow-md">Aucun historique de commande.</div>
             ) : (
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left">ID</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Client</th>
                      <th className="py-3 px-4 text-left">Total</th>
                      <th className="py-3 px-4 text-left">Statut</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((order) => (
                      <tr key={order.id || order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-xs">{order.id || order._id}</td>
                        <td className="py-3 px-4">{formatDate(order.createdAt || order.completedAt || order.orderTime)}</td>
                         {/* Adapt based on actual order data structure */}
                        <td className="py-3 px-4">{order.customerName || order.customer?.name || order.userId || 'N/A'}</td>
                        <td className="py-3 px-4">{typeof order.totalPrice === 'number' ? `${order.totalPrice.toFixed(2)}€` : (typeof order.total === 'number' ? `${order.total.toFixed(2)}€` : 'N/A')}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-500 hover:underline">
                            Détails {/* TODO: Implement Details Modal/Page */}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
          </div>
        </div>
      )}

      {/* Restaurant Settings Tab - Using fetched restaurantDetails */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Paramètres du restaurant</h2>
          {/* Display fetched restaurant details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-4">Informations générales</h3>
              <div className="space-y-4">
                {/* Adapt field names based on actual restaurant data structure */}
                <div>
                  <label className="block text-gray-700 mb-2">Nom du restaurant</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" value={restaurantDetails.name || ''} readOnly />
                </div>
                 <div>
                  <label className="block text-gray-700 mb-2">Cuisine</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" value={restaurantDetails.cuisine || ''} readOnly />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Adresse</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" value={restaurantDetails.address || ''} readOnly />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Téléphone</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" value={restaurantDetails.phone || ''} readOnly />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" value={restaurantDetails.email || ''} readOnly />
                </div>
                 <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" value={restaurantDetails.description || ''} readOnly rows="3"></textarea>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Autres détails</h3>
               <div className="space-y-4">
                {/* Adapt field names based on actual restaurant data structure */}
                 <div>
                    <label className="block text-gray-700 mb-2">Temps de livraison estimé</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" value={restaurantDetails.delivery_time || restaurantDetails.deliveryTime || ''} readOnly />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Frais de livraison</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" value={typeof restaurantDetails.delivery_fee === 'number' ? `${restaurantDetails.delivery_fee.toFixed(2)}€` : (restaurantDetails.deliveryFee || '')} readOnly />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Évaluation</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" value={restaurantDetails.rating ? `${restaurantDetails.rating} (${restaurantDetails.review_count || 0} avis)` : 'N/A'} readOnly />
                  </div>
                {/* Displaying opening hours might require parsing the JSONB */}
                <div>
                  <label className="block text-gray-700 mb-2">Horaires (JSON)</label>
                  <textarea className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" value={JSON.stringify(restaurantDetails.opening_hours || restaurantDetails.openingHours || {}, null, 2)} readOnly rows="5"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-right">
            <button className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed" disabled>
              Modification non disponible {/* TODO: Implement modification request/edit feature */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurateurDashboard; 