import React, { useState } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Données statiques pour le prototype
  const users = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      role: 'client',
      status: 'active',
      created: new Date(2023, 3, 15)
    },
    {
      id: 2,
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      role: 'restaurateur',
      status: 'active',
      created: new Date(2023, 2, 20)
    },
    {
      id: 3,
      name: 'Paul Bernard',
      email: 'paul.bernard@example.com',
      role: 'livreur',
      status: 'suspended',
      created: new Date(2023, 4, 5)
    },
    {
      id: 4,
      name: 'Admin Système',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      created: new Date(2023, 0, 1)
    }
  ];

  const restaurants = [
    {
      id: 1,
      name: 'Pizza Deluxe',
      owner: 'Marie Martin',
      email: 'contact@pizzadeluxe.com',
      status: 'active',
      created: new Date(2023, 2, 20)
    },
    {
      id: 2,
      name: 'Burger King',
      owner: 'Thomas Leroy',
      email: 'contact@burgerking.com',
      status: 'active',
      created: new Date(2023, 1, 10)
    },
    {
      id: 3,
      name: 'Sushi Master',
      owner: 'Sophie Petit',
      email: 'contact@sushimaster.com',
      status: 'pending',
      created: new Date(2023, 4, 8)
    }
  ];

  const stats = {
    users: {
      total: 120,
      clients: 100,
      restaurateurs: 10,
      livreurs: 9,
      admins: 1
    },
    restaurants: {
      total: 15,
      active: 12,
      pending: 3
    },
    orders: {
      total: 1250,
      thisMonth: 350,
      thisWeek: 75,
      today: 12
    },
    revenue: {
      total: 15000,
      thisMonth: 4500,
      thisWeek: 950,
      today: 180
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Actif
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            En attente
          </span>
        );
      case 'suspended':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            Suspendu
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
            Admin
          </span>
        );
      case 'restaurateur':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Restaurateur
          </span>
        );
      case 'livreur':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            Livreur
          </span>
        );
      case 'client':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            Client
          </span>
        );
      default:
        return null;
    }
  };

  const updateUserStatus = (id, status) => {
    console.log('Update user status:', id, status);
    // Ici, on ferait un appel API pour mettre à jour le statut
  };

  const updateRestaurantStatus = (id, status) => {
    console.log('Update restaurant status:', id, status);
    // Ici, on ferait un appel API pour mettre à jour le statut
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-500 text-sm uppercase font-semibold mb-4">Utilisateurs</h2>
          <p className="text-3xl font-bold mb-2">{stats.users.total}</p>
          <div className="text-sm text-gray-600">
            <p>{stats.users.clients} clients</p>
            <p>{stats.users.restaurateurs} restaurateurs</p>
            <p>{stats.users.livreurs} livreurs</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-500 text-sm uppercase font-semibold mb-4">Restaurants</h2>
          <p className="text-3xl font-bold mb-2">{stats.restaurants.total}</p>
          <div className="text-sm text-gray-600">
            <p>{stats.restaurants.active} actifs</p>
            <p>{stats.restaurants.pending} en attente</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-500 text-sm uppercase font-semibold mb-4">Commandes</h2>
          <p className="text-3xl font-bold mb-2">{stats.orders.total}</p>
          <div className="text-sm text-gray-600">
            <p>{stats.orders.thisMonth} ce mois-ci</p>
            <p>{stats.orders.thisWeek} cette semaine</p>
            <p>{stats.orders.today} aujourd'hui</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-500 text-sm uppercase font-semibold mb-4">Revenus</h2>
          <p className="text-3xl font-bold mb-2">{stats.revenue.total}€</p>
          <div className="text-sm text-gray-600">
            <p>{stats.revenue.thisMonth}€ ce mois-ci</p>
            <p>{stats.revenue.thisWeek}€ cette semaine</p>
            <p>{stats.revenue.today}€ aujourd'hui</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'users'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Utilisateurs
        </button>
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'restaurants'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Restaurants
        </button>
      </div>

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
              Ajouter un utilisateur
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(user.created)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:underline">
                          Modifier
                        </button>
                        {user.status === 'active' && (
                          <button
                            onClick={() => updateUserStatus(user.id, 'suspended')}
                            className="text-red-500 hover:underline"
                          >
                            Suspendre
                          </button>
                        )}
                        {user.status === 'suspended' && (
                          <button
                            onClick={() => updateUserStatus(user.id, 'active')}
                            className="text-green-500 hover:underline"
                          >
                            Réactiver
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restaurants Management */}
      {activeTab === 'restaurants' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold">Gestion des restaurants</h2>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
              Ajouter un restaurant
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriétaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restaurant.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restaurant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restaurant.owner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restaurant.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(restaurant.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(restaurant.created)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:underline">
                          Voir
                        </button>
                        {restaurant.status === 'pending' && (
                          <button
                            onClick={() => updateRestaurantStatus(restaurant.id, 'active')}
                            className="text-green-500 hover:underline"
                          >
                            Approuver
                          </button>
                        )}
                        {restaurant.status === 'active' && (
                          <button
                            onClick={() => updateRestaurantStatus(restaurant.id, 'suspended')}
                            className="text-red-500 hover:underline"
                          >
                            Suspendre
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 