import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axiosConfig';

// Simple Modal Component (can be extracted to its own file later)
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

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

  // State for Add Dish Modal
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDishData, setNewDishData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  // State for Edit Restaurant Modal
  const [isEditRestaurantModalOpen, setIsEditRestaurantModalOpen] = useState(false);
  const [editedRestaurantData, setEditedRestaurantData] = useState(null);

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
      case 'waiting_restaurant_validation':
        return (
          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
            En attente de validation
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
    // Placeholder remains until API is ready or needed
    try {
       // Example: await apiClient.patch(`/orders/${id}`, { status });
       // Refresh orders or update local state optimistically/realistically
       // setAllOrders(prevOrders => prevOrders.map(o => o.id === id ? { ...o, status } : o));
       alert(`Statut de la commande ${id} mis à jour à ${status} (simulation)`); // Placeholder feedback
     } catch (err) {
       console.error("Failed to update order status", err);
       setError(`Erreur lors de la mise à jour du statut de la commande ${id}: ${err.message}`);
     }
  };

  // Function to validate an order that's waiting for restaurant validation
  const validateOrder = async (orderId) => {
    try {
      await apiClient.post(`/restaurants/orders/${orderId}/validate`, {
        restaurantId: user.id
      });
      
      // Update the order status in the local state
      setAllOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'processing' } 
            : order
        )
      );
      
      // Show success message (optional)
      alert('Commande validée avec succès');
    } catch (error) {
      console.error('Error validating order:', error);
      alert('Erreur lors de la validation de la commande');
    }
  };

  const toggleItemAvailability = async (id) => {
    const item = menu.find(i => i.id === id);
    if (!item) return;

    const newAvailability = !item.is_available;
    // Optimistic UI update
    setMenu(prevMenu => prevMenu.map(i => i.id === id ? { ...i, is_available: newAvailability } : i));

    try {
      await apiClient.patch(`/dishes/${id}`, { is_available: newAvailability });
      // State already updated optimistically
    } catch (err) {
      console.error("Failed to update dish availability", err);
      setError(`Erreur lors de la mise à jour de la disponibilité du plat ${item.name}: ${err.message}`);
      // Rollback UI on error
      setMenu(prevMenu => prevMenu.map(i => i.id === id ? { ...i, is_available: item.is_available } : i));
    }
  };

  const updateRestaurantStatus = async (status) => {
    console.warn('Fonctionnalité non implémentable: Le statut du restaurant (ouvert/fermé) nécessite une modification de la base de données.');
    alert('Fonctionnalité non disponible: Le statut du restaurant ne peut être modifié pour le moment.');
    // Keep original value displayed
    // Reset dropdown if needed, find the select element and set its value back
    const selectElement = document.getElementById('restaurant-status-select'); // Need to add this ID
    if (selectElement && restaurantDetails?.db_status) { // Assuming db_status if it existed
        selectElement.value = restaurantDetails.db_status;
    } else if (selectElement) {
         selectElement.value = 'closed'; // Default fallback
    }
    // try {
    //   if (!restaurantDetails?.id) throw new Error("ID du restaurant manquant");
    //   await apiClient.patch(`/restaurants/${restaurantDetails.id}`, { status }); // Replace 'status' with actual DB field if added
    //   setRestaurantDetails(prev => ({ ...prev, status })); // Update local state with the actual field
    // } catch (err) {
    //   console.error("Failed to update restaurant status", err);
    //   setError(`Erreur lors de la mise à jour du statut du restaurant: ${err.message}`);
    // }
  };

  const deleteDish = async (id, dishName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le plat "${dishName}" ? Cette action est irréversible.`)) {
      // Optimistic UI update (optional, can also update after success)
      // setMenu(prevMenu => prevMenu.filter(item => item.id !== id));

      try {
        await apiClient.delete(`/dishes/${id}`);
        // Update state after successful deletion
        setMenu(prevMenu => prevMenu.filter(item => item.id !== id));
        // Optionally show a success notification
        alert(`Le plat "${dishName}" a été supprimé.`);
      } catch (err) {
        console.error("Failed to delete dish", err);
        setError(`Erreur lors de la suppression du plat ${dishName}: ${err.message}`);
        // Rollback UI if optimistic update was used
        // To rollback, we might need to temporarily store the item or refetch the menu
        // For simplicity, we'll update the state only on success here.
      }
    }
  };

  const addDish = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!restaurantDetails?.id) {
      setError("ID du restaurant non disponible pour ajouter un plat.");
      return;
    }

    // Basic validation
    if (!newDishData.name || !newDishData.price || !newDishData.category) {
        setError("Le nom, le prix et la catégorie sont requis pour ajouter un plat.");
        return;
    }

    try {
      const response = await apiClient.post(
        `/restaurants/${restaurantDetails.id}/dishes`,
        {
          ...newDishData,
          // Ensure price is sent as a number if needed by the backend
          price: parseFloat(newDishData.price) || 0,
          // Add restaurant_id if backend doesn't infer it from the route
          // restaurant_id: restaurantDetails.id
        }
      );

      // Add the new dish to the menu state
      setMenu(prevMenu => [...prevMenu, response.data]);

      // Close modal and reset form
      setIsAddDishModalOpen(false);
      setNewDishData({ name: '', description: '', price: '', category: '', image: '' });
      setError(null); // Clear previous errors
      alert(`Plat "${response.data.name}" ajouté avec succès !`);

    } catch (err) {
      console.error("Failed to add dish:", err);
      let errorMsg = "Erreur lors de l'ajout du plat.";
      if (err.response?.data?.message) {
          errorMsg += ` ${err.response.data.message}`;
      } else if (err.message) {
          errorMsg += ` ${err.message}`;
      }
      setError(errorMsg);
      // Keep the modal open on error so the user can correct input
    }
  };

  const handleNewDishChange = (event) => {
    const { name, value } = event.target;
    setNewDishData(prevData => ({ ...prevData, [name]: value }));
  };

  const updateRestaurantInfo = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!restaurantDetails?.id || !editedRestaurantData) {
      setError("Données manquantes pour la mise à jour du restaurant.");
      return;
    }

    // Basic validation (can be expanded)
    if (!editedRestaurantData.name || !editedRestaurantData.address || !editedRestaurantData.phone) {
        setError("Le nom, l'adresse et le téléphone sont requis.");
        return;
    }

    // Prepare data for PATCH (only send changed fields potentially, or send all editable fields)
    const dataToSend = {
        name: editedRestaurantData.name,
        address: editedRestaurantData.address,
        cuisine: editedRestaurantData.cuisine,
        phone: editedRestaurantData.phone,
        email: editedRestaurantData.email,
        description: editedRestaurantData.description,
        delivery_time: editedRestaurantData.delivery_time,
        // Convert fee back to number, handle potential empty string
        delivery_fee: editedRestaurantData.delivery_fee ? parseFloat(editedRestaurantData.delivery_fee) : null,
        // opening_hours and images are complex, handle separately if needed
    };

    try {
      const response = await apiClient.patch(
        `/restaurants/${restaurantDetails.id}`,
        dataToSend
      );

      // Update the main restaurantDetails state
      setRestaurantDetails(response.data);

      // Close modal
      setIsEditRestaurantModalOpen(false);
      setError(null); // Clear previous errors
      alert(`Informations du restaurant mises à jour avec succès !`);

    } catch (err) {
      console.error("Failed to update restaurant info:", err);
      let errorMsg = "Erreur lors de la mise à jour des informations.";
      if (err.response?.data?.message) {
          errorMsg += ` ${err.response.data.message}`;
      } else if (err.message) {
          errorMsg += ` ${err.message}`;
      }
      setError(errorMsg); // Display error potentially inside the modal
      // Keep the modal open on error
    }
  };

  const handleEditRestaurantChange = (event) => {
    const { name, value } = event.target;
    setEditedRestaurantData(prevData => ({ ...prevData, [name]: value }));
  };

  // Function to open the edit modal and initialize its state
  const openEditRestaurantModal = () => {
      if (!restaurantDetails) return;
      // Initialize form with current details (handle potential missing fields)
      setEditedRestaurantData({
          name: restaurantDetails.name || '',
          address: restaurantDetails.address || '',
          cuisine: restaurantDetails.cuisine || '',
          phone: restaurantDetails.phone || '',
          email: restaurantDetails.email || '',
          description: restaurantDetails.description || '',
          delivery_time: restaurantDetails.delivery_time || '',
          // Ensure fee is a string for the input field, handle null/undefined
          delivery_fee: restaurantDetails.delivery_fee != null ? String(restaurantDetails.delivery_fee) : '',
          // opening_hours: JSON.stringify(restaurantDetails.opening_hours || {}, null, 2), // Example if needed
          // images: restaurantDetails.images || [], // Example if needed
      });
      setIsEditRestaurantModalOpen(true);
      setError(null); // Clear errors when opening modal
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
          <span className="font-medium">Statut (Info):</span>
          <select
            id="restaurant-status-select" // Added ID for potential rollback
            className="border p-2 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed" // Style as disabled
            value={'closed'} // Default display value, not tied to DB
            onChange={(e) => updateRestaurantStatus(e.target.value)}
            disabled // Disable the dropdown
          >
            <option value="open">Ouvert</option>
            <option value="busy">Occupé</option>
            <option value="closed">Fermé</option>
          </select>
           <span className="text-xs text-gray-400">(Non modifiable)</span>
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
        {/* Add Settings Tab */}
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
                        {/* Actions based on order status */}
                        {order.status === 'waiting_restaurant_validation' ? (
                          <button
                            onClick={() => validateOrder(order.id)}
                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-md text-sm"
                          >
                            Valider la commande
                          </button>
                        ) : (
                          /* Basic status update dropdown for other statuses */
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
                        )}
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
            <button
              onClick={() => setIsAddDishModalOpen(true)} // Open modal on click
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
            >
              Ajouter un article
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
                            <button className="text-blue-500 hover:underline text-xs">
                              Modifier {/* TODO: Implement Edit */}
                            </button>
                            <button
                              onClick={() => deleteDish(item.id || item._id, item.name)}
                              className="text-red-500 hover:underline text-xs"
                            >
                              Supprimer
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
            <button
              onClick={openEditRestaurantModal} // Open edit modal
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
            >
              Modifier les informations
            </button>
          </div>
        </div>
      )}

      {/* Add Dish Modal */}
      <Modal isOpen={isAddDishModalOpen} onClose={() => setIsAddDishModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau plat</h3>
        {error && <div className="mb-4 text-red-600 text-sm">Erreur: {error}</div>} {/* Display errors inside modal */}
        <form onSubmit={addDish}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom du plat*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newDishData.name}
              onChange={handleNewDishChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={newDishData.description}
              onChange={handleNewDishChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Prix (€)*</label>
              <input
                type="number"
                id="price"
                name="price"
                value={newDishData.price}
                onChange={handleNewDishChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                required
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Catégorie*</label>
              <input
                type="text"
                id="category"
                name="category"
                value={newDishData.category}
                onChange={handleNewDishChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
            <input
              type="url"
              id="image"
              name="image"
              value={newDishData.image}
              onChange={handleNewDishChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="https://exemple.com/image.jpg"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsAddDishModalOpen(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
            >
              Ajouter le plat
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Restaurant Modal */}
      <Modal isOpen={isEditRestaurantModalOpen} onClose={() => setIsEditRestaurantModalOpen(false)}>
          <h3 className="text-lg font-semibold mb-4">Modifier les informations du restaurant</h3>
          {error && <div className="mb-4 text-red-600 text-sm">Erreur: {error}</div>} {/* Display errors inside modal */}
          {editedRestaurantData && (
              <form onSubmit={updateRestaurantInfo}>
                  {/* Group fields for better layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
                          <input type="text" id="edit-name" name="name" value={editedRestaurantData.name} onChange={handleEditRestaurantChange} required className="w-full p-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                          <label htmlFor="edit-cuisine" className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                          <input type="text" id="edit-cuisine" name="cuisine" value={editedRestaurantData.cuisine} onChange={handleEditRestaurantChange} className="w-full p-2 border border-gray-300 rounded-md" />
                      </div>
                  </div>
                  <div className="mb-4">
                      <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-1">Adresse*</label>
                      <input type="text" id="edit-address" name="address" value={editedRestaurantData.address} onChange={handleEditRestaurantChange} required className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                          <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone*</label>
                          <input type="tel" id="edit-phone" name="phone" value={editedRestaurantData.phone} onChange={handleEditRestaurantChange} required className="w-full p-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                          <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input type="email" id="edit-email" name="email" value={editedRestaurantData.email} onChange={handleEditRestaurantChange} className="w-full p-2 border border-gray-300 rounded-md" />
                      </div>
                  </div>
                   <div className="mb-4">
                      <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea id="edit-description" name="description" value={editedRestaurantData.description} onChange={handleEditRestaurantChange} rows="3" className="w-full p-2 border border-gray-300 rounded-md"></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                          <label htmlFor="edit-delivery_time" className="block text-sm font-medium text-gray-700 mb-1">Temps livraison (ex: 20-30 min)</label>
                          <input type="text" id="edit-delivery_time" name="delivery_time" value={editedRestaurantData.delivery_time} onChange={handleEditRestaurantChange} className="w-full p-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                          <label htmlFor="edit-delivery_fee" className="block text-sm font-medium text-gray-700 mb-1">Frais livraison (€)</label>
                          <input type="number" id="edit-delivery_fee" name="delivery_fee" value={editedRestaurantData.delivery_fee} onChange={handleEditRestaurantChange} step="0.01" min="0" className="w-full p-2 border border-gray-300 rounded-md" />
                      </div>
                  </div>

                  {/* Add more fields as needed, e.g., images array editor, opening hours editor - these are complex */}

                  <div className="flex justify-end space-x-3 mt-6">
                      <button type="button" onClick={() => setIsEditRestaurantModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                          Annuler
                      </button>
                      <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
                          Enregistrer les modifications
                      </button>
                  </div>
              </form>
          )}
      </Modal>

    </div>
  );
};

export default RestaurateurDashboard; 