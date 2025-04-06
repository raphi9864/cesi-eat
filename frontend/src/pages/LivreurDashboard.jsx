import React, { useState } from 'react';

const LivreurDashboard = () => {
  const [activeTab, setActiveTab] = useState('available');

  // Données statiques pour le prototype
  const availableDeliveries = [
    {
      id: 'DEL12345',
      restaurant: {
        name: 'Pizza Deluxe',
        address: '123 Rue de la Paix, 75001 Paris'
      },
      customer: {
        address: '456 Avenue des Champs-Élysées, 75008 Paris',
        distance: 3.2
      },
      estimatedTime: 25,
      fee: 4.50,
      created: new Date(Date.now() - 10 * 60000) // 10 minutes ago
    },
    {
      id: 'DEL12346',
      restaurant: {
        name: 'Sushi Master',
        address: '789 Boulevard Haussmann, 75009 Paris'
      },
      customer: {
        address: '101 Rue de Rivoli, 75001 Paris',
        distance: 2.8
      },
      estimatedTime: 20,
      fee: 4.00,
      created: new Date(Date.now() - 5 * 60000) // 5 minutes ago
    }
  ];

  const activeDeliveries = [
    {
      id: 'DEL12340',
      restaurant: {
        name: 'Burger King',
        address: '222 Rue Saint-Honoré, 75001 Paris'
      },
      customer: {
        name: 'Jean Dupont',
        phone: '06 12 34 56 78',
        address: '333 Rue de la Roquette, 75011 Paris',
        distance: 4.5
      },
      estimatedTime: 30,
      fee: 5.50,
      status: 'picking_up',
      created: new Date(Date.now() - 15 * 60000) // 15 minutes ago
    }
  ];

  const deliveryHistory = [
    {
      id: 'DEL12330',
      date: new Date(2023, 4, 15, 18, 30),
      restaurant: {
        name: 'Pizza Deluxe'
      },
      customer: {
        address: '123 Rue de Paris, 75001 Paris'
      },
      fee: 4.75,
      status: 'completed'
    },
    {
      id: 'DEL12331',
      date: new Date(2023, 4, 14, 12, 45),
      restaurant: {
        name: 'Sushi Master'
      },
      customer: {
        address: '456 Boulevard Saint-Germain, 75006 Paris'
      },
      fee: 5.25,
      status: 'completed'
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

  const acceptDelivery = (id) => {
    console.log('Accepted delivery:', id);
    // Ici, on ferait un appel API pour accepter la livraison
  };

  const updateDeliveryStatus = (id, status) => {
    console.log('Update delivery status:', id, status);
    // Ici, on ferait un appel API pour mettre à jour le statut
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
          Livraisons disponibles
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'active'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Mes livraisons actives
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
      </div>

      {/* Available Deliveries */}
      {activeTab === 'available' && (
        <div>
          {availableDeliveries.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-600">
                Aucune livraison disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                    <h2 className="font-semibold">{delivery.restaurant.name}</h2>
                    <span className="text-gray-500 text-sm">
                      {getTimeSince(delivery.created)}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="font-medium mb-1">Détails de la course</h3>
                      <p><span className="font-medium">Restaurant:</span> {delivery.restaurant.address}</p>
                      <p><span className="font-medium">Client:</span> {delivery.customer.address}</p>
                      <p><span className="font-medium">Distance:</span> {delivery.customer.distance} km</p>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-gray-700">
                          <span className="font-medium">Temps estimé:</span> {delivery.estimatedTime} min
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Rémunération:</span> {delivery.fee.toFixed(2)}€
                        </p>
                      </div>
                      <button
                        onClick={() => acceptDelivery(delivery.id)}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                      >
                        Accepter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Deliveries */}
      {activeTab === 'active' && (
        <div>
          {activeDeliveries.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-600">
                Vous n'avez pas de livraison en cours.
              </p>
            </div>
          ) : (
            <div>
              {activeDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold">{delivery.restaurant.name}</h2>
                      <p className="text-sm text-gray-500">Commande #{delivery.id}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        {delivery.status === 'picking_up' ? 'À récupérer' : 'En livraison'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Adresses</h3>
                      <p className="mb-2">
                        <span className="font-medium">Restaurant:</span> {delivery.restaurant.address}
                      </p>
                      <p>
                        <span className="font-medium">Client:</span> {delivery.customer.address}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Informations client</h3>
                      <p className="mb-1">
                        <span className="font-medium">Nom:</span> {delivery.customer.name}
                      </p>
                      <p>
                        <span className="font-medium">Téléphone:</span> {delivery.customer.phone}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Détails</h3>
                      <p className="mb-1">
                        <span className="font-medium">Distance:</span> {delivery.customer.distance} km
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">Temps estimé:</span> {delivery.estimatedTime} min
                      </p>
                      <p>
                        <span className="font-medium">Rémunération:</span> {delivery.fee.toFixed(2)}€
                      </p>
                    </div>
                    <div className="flex justify-between">
                      {delivery.status === 'picking_up' ? (
                        <button
                          onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
                          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                        >
                          J'ai récupéré la commande
                        </button>
                      ) : (
                        <button
                          onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                        >
                          Marquer comme livré
                        </button>
                      )}
                      <button className="text-red-500 hover:underline">
                        Signaler un problème
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delivery History */}
      {activeTab === 'history' && (
        <div>
          {deliveryHistory.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-600">
                Vous n'avez pas encore effectué de livraisons.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Restaurant</th>
                    <th className="py-3 px-4 text-left">Adresse client</th>
                    <th className="py-3 px-4 text-left">Rémunération</th>
                    <th className="py-3 px-4 text-left">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryHistory.map((delivery) => (
                    <tr key={delivery.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{delivery.id}</td>
                      <td className="py-3 px-4">{formatDate(delivery.date)}</td>
                      <td className="py-3 px-4">{delivery.restaurant.name}</td>
                      <td className="py-3 px-4">{delivery.customer.address}</td>
                      <td className="py-3 px-4">{delivery.fee.toFixed(2)}€</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Livré
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LivreurDashboard; 