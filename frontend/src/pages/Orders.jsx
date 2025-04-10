import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axiosConfig';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPending, setLoadingPending] = useState(false);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
    if (user?.role === 'delivery') {
      fetchPendingOrders();
    }
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
          // For restaurant owners, fetch orders using the email as user_id
          // First, get the restaurant ID using the email
          const restaurantResponse = await apiClient.get(`/restaurants/user/${user.email}`);
          if (restaurantResponse.data && restaurantResponse.data.id) {
            response = await apiClient.get(`/orders/restaurant/${restaurantResponse.data.id}`);
          } else {
            throw new Error('Restaurant not found');
          }
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

  const fetchPendingOrders = async () => {
    if (!user || user.role !== 'delivery') return;
    
    setLoadingPending(true);
    try {
      console.log('Fetching pending orders from:', '/delivery/orders/pending');
      const response = await apiClient.get('/delivery/orders/pending');
      console.log('Pending orders response:', response.data);
      setPendingOrders(response.data);
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      // Display a notification to the user about the error
      alert('Impossible de charger les commandes en attente: ' + 
        (err.response?.data?.message || err.message || 'Erreur inconnue'));
    } finally {
      setLoadingPending(false);
    }
  };

  // Function for delivery people to accept orders
  const acceptOrder = async (orderId) => {
    console.log("Attempting to accept order:", orderId);
    console.log("Current user:", user);
    
    if (!user || !user.id) {
      console.error("User is not authenticated or missing ID");
      alert("Vous devez être connecté pour accepter une commande");
      return;
    }
    
    if (user.role !== 'delivery') {
      console.error("User role is not delivery:", user.role);
      alert("Seuls les livreurs peuvent accepter des commandes");
      return;
    }
    
    setProcessingOrderId(orderId);
    try {
      console.log(`Sending request to /delivery/orders/${orderId}/accept with deliveryPersonId: ${user.id}`);
      const response = await apiClient.post(`/delivery/orders/${orderId}/accept`, {
        deliveryPersonId: user.id
      });
      
      console.log("Order accepted successfully:", response.data);
      
      // Remove from pending orders
      setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
      
      // Refresh orders list
      fetchOrders();
      
      // Show success notification
      alert("Commande acceptée avec succès");
    } catch (err) {
      console.error('Error accepting order:', err);
      if (err.response) {
        console.error('Response error data:', err.response.data);
        console.error('Response error status:', err.response.status);
      }
      alert('Impossible d\'accepter la commande: ' + 
        (err.response?.data?.message || err.message || 'Erreur inconnue'));
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Function for restaurants to validate orders
  const validateOrder = async (orderId) => {
    if (!user || !user.email || user.role !== 'restaurant') return;
    
    setProcessingOrderId(orderId);
    try {
      // Get restaurant ID first
      const restaurantResponse = await apiClient.get(`/restaurants/user/${user.email}`);
      if (!restaurantResponse.data || !restaurantResponse.data.id) {
        throw new Error('Restaurant not found');
      }
      
      const restaurantId = restaurantResponse.data.id;
      
      // Accept/validate the order
      await apiClient.post(`/restaurants/${restaurantId}/orders/${orderId}/accept`);
      
      // Refresh orders list
      fetchOrders();
      
      // Show success message
      alert('Commande acceptée avec succès');
    } catch (err) {
      console.error('Error validating order:', err);
      alert('Impossible de valider la commande: ' + 
        (err.response?.data?.message || err.message || 'Erreur inconnue'));
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Function for restaurants to mark orders as ready for pickup
  const markOrderAsReady = async (orderId) => {
    if (!user || !user.email || user.role !== 'restaurant') return;
    
    setProcessingOrderId(orderId);
    try {
      // Get restaurant ID first
      const restaurantResponse = await apiClient.get(`/restaurants/user/${user.email}`);
      if (!restaurantResponse.data || !restaurantResponse.data.id) {
        throw new Error('Restaurant not found');
      }
      
      const restaurantId = restaurantResponse.data.id;
      
      // Mark the order as ready for pickup
      await apiClient.post(`/restaurants/${restaurantId}/orders/${orderId}/ready`);
      
      // Refresh orders list
      fetchOrders();
      
      // Show success message
      alert('Commande marquée comme prête à être livrée');
    } catch (err) {
      console.error('Error marking order as ready:', err);
      alert('Impossible de marquer la commande comme prête: ' + 
        (err.response?.data?.message || err.message || 'Erreur inconnue'));
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Function for restaurants to reject orders
  const restaurantRejectOrder = async (orderId) => {
    if (!user || !user.email || user.role !== 'restaurant') return;
    
    setProcessingOrderId(orderId);
    try {
      // Get restaurant ID first
      const restaurantResponse = await apiClient.get(`/restaurants/user/${user.email}`);
      if (!restaurantResponse.data || !restaurantResponse.data.id) {
        throw new Error('Restaurant not found');
      }
      
      const restaurantId = restaurantResponse.data.id;
      
      // Reject the order
      await apiClient.post(`/restaurants/${restaurantId}/orders/${orderId}/reject`);
      
      // Refresh orders list
      fetchOrders();
      
      // Show success message
      alert('Commande rejetée');
    } catch (err) {
      console.error('Error rejecting order:', err);
      alert('Impossible de rejeter la commande: ' + 
        (err.response?.data?.message || err.message || 'Erreur inconnue'));
    } finally {
      setProcessingOrderId(null);
    }
  };

  const rejectOrder = async (orderId) => {
    console.log("Attempting to reject order:", orderId);
    console.log("Current user:", user);
    
    if (!user || !user.id) {
      console.error("User is not authenticated or missing ID");
      alert("Vous devez être connecté pour rejeter une commande");
      return;
    }
    
    if (user.role !== 'delivery') {
      console.error("User role is not delivery:", user.role);
      alert("Seuls les livreurs peuvent rejeter des commandes");
      return;
    }
    
    setProcessingOrderId(orderId);
    try {
      console.log(`Sending request to /delivery/orders/${orderId}/reject with deliveryPersonId: ${user.id}`);
      const response = await apiClient.post(`/delivery/orders/${orderId}/reject`, {
        deliveryPersonId: user.id
      });
      
      console.log("Order rejected successfully:", response.data);
      
      // Remove from pending orders
      setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
      
      // Show success notification
      alert("Commande rejetée avec succès");
    } catch (err) {
      console.error('Error rejecting order:', err);
      if (err.response) {
        console.error('Response error data:', err.response.data);
        console.error('Response error status:', err.response.status);
      }
      alert('Impossible de rejeter la commande: ' + 
        (err.response?.data?.message || err.message || 'Erreur inconnue'));
    } finally {
      setProcessingOrderId(null);
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

  // Function for delivery people to start delivery
  const startDelivery = async (orderId) => {
    console.log("Starting delivery for order:", orderId);
    
    if (!user || !user.id) {
      console.error("User is not authenticated or missing ID");
      alert("Vous devez être connecté pour commencer une livraison");
      return;
    }
    
    if (user.role !== 'delivery') {
      console.error("User role is not delivery:", user.role);
      alert("Seuls les livreurs peuvent commencer une livraison");
      return;
    }
    
    setProcessingOrderId(orderId);
    try {
      const response = await apiClient.post(`/delivery/orders/${orderId}/start-delivery`, {
        deliveryPersonId: user.id
      });
      
      console.log("Delivery started successfully:", response.data);
      
      // Refresh orders list
      fetchOrders();
      
      // Show success notification
      alert("Livraison commencée avec succès. Veuillez vous rendre chez le client.");
    } catch (err) {
      console.error('Error starting delivery:', err);
      if (err.response) {
        console.error('Response error data:', err.response.data);
        console.error('Response error status:', err.response.status);
      }
      alert('Impossible de commencer la livraison: ' + 
        (err.response?.data?.message || err.message || 'Erreur inconnue'));
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Function for delivery people to verify delivery with code
  const verifyDelivery = async (orderId, verificationCode) => {
    console.log("Verifying delivery for order:", orderId, "with code:", verificationCode);
    
    if (!user || !user.id) {
      console.error("User is not authenticated or missing ID");
      alert("Vous devez être connecté pour valider une livraison");
      return;
    }
    
    if (user.role !== 'delivery') {
      console.error("User role is not delivery:", user.role);
      alert("Seuls les livreurs peuvent valider une livraison");
      return;
    }
    
    setProcessingOrderId(orderId);
    try {
      const response = await apiClient.post(`/delivery/orders/${orderId}/verify-delivery`, {
        deliveryPersonId: user.id,
        verificationCode
      });
      
      console.log("Delivery verified successfully:", response.data);
      
      // Refresh orders list
      fetchOrders();
      
      // Show success notification
      alert("Livraison validée avec succès. Merci !");
    } catch (err) {
      console.error('Error verifying delivery:', err);
      if (err.response) {
        console.error('Response error data:', err.response.data);
        console.error('Response error status:', err.response.status);
      }
      alert('Impossible de valider la livraison: ' + 
        (err.response?.data?.message || err.message || 'Code de vérification invalide'));
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Component for verification code input modal
  const VerificationCodeModal = ({ orderId, onClose }) => {
    const [code, setCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const handleVerify = async () => {
      if (!code.trim()) {
        alert('Veuillez entrer le code de vérification');
        return;
      }
      
      setIsProcessing(true);
      try {
        await verifyDelivery(orderId, code);
        onClose();
      } catch (error) {
        console.error('Error in verification process:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Vérification de livraison</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-700 mb-2">Veuillez entrer le code de vérification fourni par le client :</p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code à 6 chiffres"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={6}
            />
          </div>
          
          <button
            onClick={handleVerify}
            disabled={isProcessing}
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-70"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Vérification...
              </span>
            ) : (
              'Vérifier la livraison'
            )}
          </button>
        </div>
      </div>
    );
  };

  // Add state for verification code modal
  const [verificationModalOrderId, setVerificationModalOrderId] = useState(null);
  
  // Function to open verification modal
  const openVerificationModal = (orderId) => {
    setVerificationModalOrderId(orderId);
  };

  // Section pour les restaurants: commandes en préparation
  const renderRestaurantProcessingOrdersSection = () => {
    if (user?.role !== 'restaurant') return null;
    
    // Filter orders that are in processing status
    const processingOrders = orders.filter(order => order.status === 'processing');
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Commandes En Préparation</h2>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Actualiser
          </button>
        </div>
        
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600">Chargement des commandes en préparation...</p>
          </div>
        ) : processingOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Aucune commande en préparation pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processingOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-white border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Commande #{order.id}</h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      En préparation
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
                </div>
                
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">Client</p>
                    <p className="font-medium">Client #{order.client_id}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">Adresse de livraison</p>
                    <p className="font-medium">{order.delivery_address}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Total</p>
                    <p className="font-bold text-lg">{typeof order.total_price === 'number' 
                      ? `${order.total_price.toFixed(2)}€` 
                      : 'Prix non disponible'}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Articles</p>
                    <ul className="mt-1 space-y-1">
                      {order.items && order.items.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      className="w-full py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      onClick={() => markOrderAsReady(order.id)}
                      disabled={processingOrderId === order.id}
                    >
                      {processingOrderId === order.id ? 'Traitement...' : 'Marquer comme prêt à livrer'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Component for the payment popup modal
  const PaymentModal = ({ order, onClose }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const handlePayment = async () => {
      setIsProcessing(true);
      // Simulate a payment processing time
      setTimeout(() => {
        setIsProcessing(false);
        alert('Paiement effectué avec succès !');
        onClose();
      }, 1500);
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Paiement de la commande #{order.id}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-700 font-medium">Montant total: 
              <span className="text-xl ml-2 text-primary">
                {typeof order.total_price === 'number' ? `${order.total_price.toFixed(2)}€` : 'Prix non disponible'}
              </span>
            </p>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-2 font-medium">Méthode de paiement:</p>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="h-5 w-5 text-primary"
                />
                <span>Carte bancaire</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className="h-5 w-5 text-primary"
                />
                <span>PayPal</span>
              </label>
            </div>
          </div>
          
          {paymentMethod === 'card' && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Numéro de carte</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Date d'expiration</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="MM/AA"
                  />
                </div>
                
                <div className="w-1/3">
                  <label className="block text-gray-700 text-sm font-medium mb-1">CVC</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-70"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement en cours...
              </span>
            ) : (
              'Payer maintenant'
            )}
          </button>
        </div>
      </div>
    );
  };

  // Add state for payment modal
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);
  
  // Function to open payment modal
  const openPaymentModal = (order) => {
    setPaymentModalOrder(order);
  };

  // Component to display verification code for client
  const VerificationCodeDisplay = ({ code }) => {
    return (
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <div className="flex items-start gap-3">
          <div className="text-yellow-500 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Code de vérification de livraison</h4>
            <p className="mt-1 text-sm text-yellow-700">
              Communiquez ce code au livreur à son arrivée pour valider la livraison :
            </p>
            <div className="mt-2 flex justify-center">
              <div className="py-3 px-4 bg-white rounded-md border border-yellow-300 shadow-sm">
                <p className="text-2xl font-bold tracking-widest text-center">{code}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-yellow-600">
              Ne partagez ce code qu'avec votre livreur au moment de la livraison.
            </p>
          </div>
        </div>
      </div>
    );
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

  // Section pour les livreurs: commandes en attente à accepter ou rejeter
  const renderPendingOrdersSection = () => {
    if (user?.role !== 'delivery') return null;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Commandes en Attente de Livraison</h2>
          <button 
            onClick={fetchPendingOrders}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Actualiser
          </button>
        </div>
        
        {loadingPending ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600">Chargement des commandes en attente...</p>
          </div>
        ) : pendingOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Aucune commande en attente de livraison pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-white border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Commande #{order.id}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      En attente
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
                </div>
                
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">Restaurant</p>
                    <p className="font-medium">{order.restaurant_name}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">Adresse de livraison</p>
                    <p className="font-medium">{order.delivery_address}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Total</p>
                    <p className="font-bold text-lg">{typeof order.total_price === 'number' 
                      ? `${order.total_price.toFixed(2)}€` 
                      : 'Prix non disponible'}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex-1 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                      onClick={() => acceptOrder(order.id)}
                      disabled={processingOrderId === order.id}
                    >
                      {processingOrderId === order.id ? 'Traitement...' : 'Accepter'}
                    </button>
                    
                    <button
                      className="flex-1 py-2 rounded-md bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                      onClick={() => rejectOrder(order.id)}
                      disabled={processingOrderId === order.id}
                    >
                      {processingOrderId === order.id ? 'Traitement...' : 'Refuser'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Section pour les restaurants: commandes en attente de validation
  const renderRestaurantPendingOrdersSection = () => {
    if (user?.role !== 'restaurant') return null;
    
    // Filter orders that are waiting for restaurant validation
    const pendingValidationOrders = orders.filter(order => order.status === 'waiting_restaurant_validation');
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Commandes En Attente de Validation</h2>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Actualiser
          </button>
        </div>
        
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600">Chargement des commandes en attente...</p>
          </div>
        ) : pendingValidationOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Aucune commande en attente de validation pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingValidationOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-white border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Commande #{order.id}</h3>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                      En attente de validation
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
                </div>
                
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">Client</p>
                    <p className="font-medium">Client #{order.client_id}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">Adresse de livraison</p>
                    <p className="font-medium">{order.delivery_address}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Total</p>
                    <p className="font-bold text-lg">{typeof order.total_price === 'number' 
                      ? `${order.total_price.toFixed(2)}€` 
                      : 'Prix non disponible'}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Articles</p>
                    <ul className="mt-1 space-y-1">
                      {order.items && order.items.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex-1 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                      onClick={() => validateOrder(order.id)}
                      disabled={processingOrderId === order.id}
                    >
                      {processingOrderId === order.id ? 'Traitement...' : 'Accepter'}
                    </button>
                    
                    <button
                      className="flex-1 py-2 rounded-md bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                      onClick={() => restaurantRejectOrder(order.id)}
                      disabled={processingOrderId === order.id}
                    >
                      {processingOrderId === order.id ? 'Traitement...' : 'Rejeter'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Section for delivery people to see orders ready for pickup or on delivery
  const renderDeliveryInProgressSection = () => {
    if (user?.role !== 'delivery') return null;
    
    // Filter the orders that are assigned to this delivery person and are ready for pickup or on delivery
    const readyOrInProgressOrders = orders.filter(
      order => (order.status === 'ready_for_pickup' || order.status === 'on_delivery') && 
               String(order.delivery_id) === String(user.id)
    );
    
    if (readyOrInProgressOrders.length === 0) return null;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Commandes à livrer</h2>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Actualiser
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {readyOrInProgressOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-white border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-800">Commande #{order.id}</h3>
                  <span className={`px-3 py-1 ${
                    order.status === 'ready_for_pickup' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-indigo-100 text-indigo-800'
                  } rounded-full text-xs font-medium`}>
                    {order.status === 'ready_for_pickup' ? 'Prêt à livrer' : 'En cours de livraison'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
              </div>
              
              <div className="p-4">
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Restaurant</p>
                  <p className="font-medium">{order.restaurant_name}</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Adresse de livraison</p>
                  <p className="font-medium">{order.delivery_address}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="font-bold text-lg">{typeof order.total_price === 'number' 
                    ? `${order.total_price.toFixed(2)}€` 
                    : 'Prix non disponible'}</p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  {order.status === 'ready_for_pickup' ? (
                    <button
                      className="w-full py-2 rounded-md bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                      onClick={() => startDelivery(order.id)}
                      disabled={processingOrderId === order.id}
                    >
                      {processingOrderId === order.id ? 'Traitement...' : 'Commencer la livraison'}
                    </button>
                  ) : (
                    <button
                      className="w-full py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      onClick={() => openVerificationModal(order.id)}
                      disabled={processingOrderId === order.id}
                    >
                      {processingOrderId === order.id ? 'Traitement...' : 'Valider la livraison'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Affichage s'il n'y a pas de commandes
  if (orders.length === 0 && (!user || user.role !== 'delivery' || pendingOrders.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
        
        {/* Section des commandes en attente pour les livreurs */}
        {renderPendingOrdersSection()}
        
        {/* Section des commandes en attente de validation pour les restaurants */}
        {renderRestaurantPendingOrdersSection()}
        
        {/* Section des commandes en préparation pour les restaurants */}
        {renderRestaurantProcessingOrdersSection()}
        
        {/* Section for delivery people to see orders ready for pickup or on delivery */}
        {renderDeliveryInProgressSection()}
        
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
      case 'waiting_restaurant_validation':
        return (
          <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
            En attente restaurant
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
      { key: 'waiting_restaurant_validation', label: 'En attente validation restaurant', icon: '🔄' },
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
                status === 'waiting_restaurant_validation' ? 'bg-amber-100 text-amber-800' :
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
                    status === 'waiting_restaurant_validation' ? 'bg-amber-400' :
                    status === 'processing' ? 'bg-yellow-400' :
                    status === 'ready_for_pickup' ? 'bg-purple-400' :
                    status === 'on_delivery' ? 'bg-indigo-400' :
                    'bg-green-400'
                  }
                `}></span>
                <span className={`
                  relative inline-flex rounded-full h-2 w-2
                  ${status === 'pending' ? 'bg-blue-500' : 
                    status === 'waiting_restaurant_validation' ? 'bg-amber-500' :
                    status === 'processing' ? 'bg-yellow-500' :
                    status === 'ready_for_pickup' ? 'bg-purple-500' :
                    status === 'on_delivery' ? 'bg-indigo-500' :
                    'bg-green-500'
                  }
                `}></span>
              </span>
              {status === 'pending' ? 'Commande en attente' :
                status === 'waiting_restaurant_validation' ? 'En attente de validation restaurant' :
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
      
      {/* Section des commandes en attente pour les livreurs */}
      {renderPendingOrdersSection()}
      
      {/* Section des commandes en attente de validation pour les restaurants */}
      {renderRestaurantPendingOrdersSection()}
      
      {/* Section des commandes en préparation pour les restaurants */}
      {renderRestaurantProcessingOrdersSection()}
      
      {/* Section for delivery people to see orders ready for pickup or on delivery */}
      {renderDeliveryInProgressSection()}
      
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
              {/* Show verification code for clients if order is ready for pickup or on delivery */}
              {user?.role === 'client' && 
               (order.status === 'ready_for_pickup' || order.status === 'on_delivery') && 
               order.verification_code && (
                <VerificationCodeDisplay code={order.verification_code} />
              )}
              
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
              
              <div className="mt-5 flex justify-end gap-2">
                {/* If client, show payment button for orders */}
                {user?.role === 'client' && (
                  <button 
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors flex items-center gap-1"
                    onClick={() => openPaymentModal(order)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payer
                  </button>
                )}
              
                {(order.status === 'pending' || order.status === 'processing') && (
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
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Render the payment modal if an order is selected */}
      {paymentModalOrder && (
        <PaymentModal 
          order={paymentModalOrder} 
          onClose={() => setPaymentModalOrder(null)} 
        />
      )}
      
      {/* Render the verification code modal if an order is selected */}
      {verificationModalOrderId && (
        <VerificationCodeModal 
          orderId={verificationModalOrderId} 
          onClose={() => setVerificationModalOrderId(null)} 
        />
      )}
    </div>
  );
};

export default Orders;