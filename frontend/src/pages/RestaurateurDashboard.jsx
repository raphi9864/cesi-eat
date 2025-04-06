import React, { useState } from 'react';

const RestaurateurDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');

  // Données statiques pour le prototype
  const restaurant = {
    id: 1,
    name: 'Pizza Deluxe',
    address: '123 Rue de la Paix, 75001 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@pizzadeluxe.com',
    openingHours: '10:00 - 22:00',
    status: 'open' // 'open', 'closed', 'busy'
  };

  const currentOrders = [
    {
      id: 'ORD12345',
      customer: 'Jean Dupont',
      items: [
        { name: 'Pizza Margherita', quantity: 2, price: 12.00 },
        { name: 'Tiramisu', quantity: 1, price: 6.50 }
      ],
      total: 30.50,
      status: 'new', // 'new', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'
      time: new Date(Date.now() - 10 * 60000) // 10 minutes ago
    },
    {
      id: 'ORD12346',
      customer: 'Marie Martin',
      items: [
        { name: 'Pizza Quatre Fromages', quantity: 1, price: 14.00 },
        { name: 'Salade César', quantity: 1, price: 8.50 },
        { name: 'Eau minérale', quantity: 1, price: 2.00 }
      ],
      total: 24.50,
      status: 'preparing', // 'new', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'
      time: new Date(Date.now() - 20 * 60000) // 20 minutes ago
    },
    {
      id: 'ORD12347',
      customer: 'Paul Bernard',
      items: [
        { name: 'Pizza Royale', quantity: 1, price: 13.50 },
        { name: 'Coca-Cola', quantity: 2, price: 2.50 }
      ],
      total: 18.50,
      status: 'ready', // 'new', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'
      time: new Date(Date.now() - 30 * 60000) // 30 minutes ago
    }
  ];

  const menuItems = [
    {
      id: 1,
      name: 'Pizza Margherita',
      description: 'Tomate, mozzarella, basilic frais',
      price: 12.00,
      image: 'https://via.placeholder.com/150',
      category: 'Pizzas',
      available: true
    },
    {
      id: 2,
      name: 'Pizza Quatre Fromages',
      description: 'Tomate, mozzarella, gorgonzola, parmesan, chèvre',
      price: 14.00,
      image: 'https://via.placeholder.com/150',
      category: 'Pizzas',
      available: true
    },
    {
      id: 3,
      name: 'Salade César',
      description: 'Salade romaine, croûtons, parmesan, sauce césar',
      price: 8.50,
      image: 'https://via.placeholder.com/150',
      category: 'Entrées',
      available: true
    },
    {
      id: 4,
      name: 'Tiramisu',
      description: 'Dessert italien au café et mascarpone',
      price: 6.50,
      image: 'https://via.placeholder.com/150',
      category: 'Desserts',
      available: true
    }
  ];

  const orderHistory = [
    {
      id: 'ORD12340',
      customer: 'Sophie Petit',
      total: 27.00,
      status: 'delivered',
      date: new Date(2023, 4, 15, 18, 30)
    },
    {
      id: 'ORD12341',
      customer: 'Thomas Leroy',
      total: 19.50,
      status: 'delivered',
      date: new Date(2023, 4, 15, 12, 45)
    },
    {
      id: 'ORD12342',
      customer: 'Julie Dubois',
      total: 32.00,
      status: 'cancelled',
      date: new Date(2023, 4, 14, 19, 20)
    }
  ];

  const getTimeSince = (date) => {
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

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    switch (status) {
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
        return null;
    }
  };

  const updateOrderStatus = (id, status) => {
    console.log('Update order status:', id, status);
    // Ici, on ferait un appel API pour mettre à jour le statut
  };

  const toggleItemAvailability = (id) => {
    console.log('Toggle availability for item:', id);
    // Ici, on ferait un appel API pour modifier la disponibilité
  };

  const updateRestaurantStatus = (status) => {
    console.log('Update restaurant status:', status);
    // Ici, on ferait un appel API pour modifier le statut du restaurant
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion Restaurant</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">Statut:</span>
          <select
            className="border p-2 rounded-md"
            value={restaurant.status}
            onChange={(e) => updateRestaurantStatus(e.target.value)}
          >
            <option value="open">Ouvert</option>
            <option value="busy">Occupé (45+ min)</option>
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
          Commandes en cours
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'menu'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'history'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Historique
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

      {/* Current Orders */}
      {activeTab === 'orders' && (
        <div>
          {currentOrders.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-600">
                Aucune commande en cours.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="font-semibold">Commande #{order.id}</h2>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500">{getTimeSince(order.time)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{order.total.toFixed(2)}€</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="mb-3"><span className="font-medium">Client:</span> {order.customer}</p>
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Articles</h3>
                      <ul className="space-y-2">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>
                              {item.quantity} x {item.name}
                            </span>
                            <span className="text-gray-700">
                              {(item.price * item.quantity).toFixed(2)}€
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between">
                      {order.status === 'new' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                        >
                          Commencer la préparation
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                        >
                          Marquer comme prête
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivering')}
                          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                        >
                          Remise au livreur
                        </button>
                      )}
                      {(order.status === 'new' || order.status === 'preparing') && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="text-red-500 hover:underline"
                        >
                          Annuler
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

      {/* Menu Management */}
      {activeTab === 'menu' && (
        <div>
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
              Ajouter un article
            </button>
          </div>
          <div className="overflow-x-auto">
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
                {menuItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                    </td>
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.description}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4">{item.price.toFixed(2)}€</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleItemAvailability(item.id)}
                        className={`py-1 px-3 rounded-full text-xs ${
                          item.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.available ? 'Disponible' : 'Indisponible'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:underline">
                          Modifier
                        </button>
                        <button className="text-red-500 hover:underline">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order History */}
      {activeTab === 'history' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Historique des commandes</h2>
          <div className="overflow-x-auto">
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
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{formatDate(order.date)}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.total.toFixed(2)}€</td>
                    <td className="py-3 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-500 hover:underline">
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restaurant Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Paramètres du restaurant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-4">Informations générales</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nom du restaurant</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={restaurant.name}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={restaurant.address}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={restaurant.phone}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={restaurant.email}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Horaires d'ouverture</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Lundi - Vendredi</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={restaurant.openingHours}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Samedi</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={restaurant.openingHours}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Dimanche</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={restaurant.openingHours}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-right">
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
              Demander des modifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurateurDashboard; 