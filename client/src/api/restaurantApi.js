import api from './api';

// Récupérer la liste des restaurants (endpoint public)
const getRestaurants = async () => {
  try {
    console.log('🔄 Envoi de requête vers /restaurants/public');
    const response = await api.get('/restaurants/public');
    console.log('📥 Réponse reçue:', response.data);
    
    if (response.data && response.data.restaurants) {
      return response.data.restaurants;
    }
    return response.data;
  } catch (error) {
    console.error('❌ Erreur API restaurantApi.getRestaurants:', error);
    throw error;
  }
};

// Récupérer les détails d'un restaurant (endpoint public)
const getRestaurantById = async (id) => {
  try {
    const response = await api.get(`/restaurants/public/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur API restaurantApi.getRestaurantById(${id}):`, error);
    throw error;
  }
};

// Récupérer les plats d'un restaurant (endpoint public)
const getDishesByRestaurantId = async (restaurantId) => {
  try {
    const response = await api.get(`/dishes/restaurant/${restaurantId}`);
    return response.data.dishes || response.data;
  } catch (error) {
    console.error(`❌ Erreur API restaurantApi.getDishesByRestaurantId(${restaurantId}):`, error);
    throw error;
  }
};

// Récupérer les restaurants populaires (endpoint public)
const getPopularRestaurants = async () => {
  try {
    const response = await api.get('/restaurants/populaires');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur API restaurantApi.getPopularRestaurants:', error);
    throw error;
  }
};

// Rechercher des restaurants par critères (endpoint public)
const searchRestaurants = async (searchParams) => {
  try {
    const response = await api.get('/restaurants/public', { params: searchParams });
    return response.data.restaurants || response.data;
  } catch (error) {
    console.error('❌ Erreur API restaurantApi.searchRestaurants:', error);
    throw error;
  }
};

// Routes protégées (nécessitent un token)

// Noter un restaurant
const rateRestaurant = async (restaurantId, ratingData) => {
  try {
    const response = await api.post(`/restaurants/${restaurantId}/noter`, ratingData);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur API restaurantApi.rateRestaurant(${restaurantId}):`, error);
    throw error;
  }
};

export default {
  getRestaurants,
  getRestaurantById,
  getDishesByRestaurantId,
  getPopularRestaurants,
  searchRestaurants,
  rateRestaurant
}; 