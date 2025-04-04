import api from './api';

// Créer une nouvelle commande
const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Récupérer les commandes de l'utilisateur connecté
const getUserOrders = async () => {
  try {
    const response = await api.get('/orders/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Récupérer les détails d'une commande
const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Annuler une commande
const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Payer une commande
const payOrder = async (orderId, paymentData) => {
  try {
    const response = await api.post(`/orders/${orderId}/payment`, paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Suivre une commande en cours
const trackOrder = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  payOrder,
  trackOrder
};