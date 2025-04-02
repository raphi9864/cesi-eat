import React from 'react';
import { Link } from 'react-router-dom';

const Orders = () => {
  // Données statiques pour le prototype
  const orders = [
    {
      id: '12345',
      date: new Date(2023, 4, 15, 18, 30),
      restaurant: {
        id: 1,
        name: 'Pizza Deluxe'
      },
      status: 'delivered',
      items: [
        { name: 'Pizza Margherita', quantity: 2, price: 12.00 },
        { name: 'Tiramisu', quantity: 1, price: 6.50 }
      ],
      total: 30.50,
      delivery: {
        address: '123 Rue de Paris, 75001 Paris',
        time: '40 min'
      }
    },
    {
      id: '12346',
      date: new Date(2023, 4, 10, 12, 15),
      restaurant: {
        id: 2,
        name: 'Burger King'
      },
      status: 'delivered',
      items: [
        { name: 'Whopper', quantity: 1, price: 7.50 },
        { name: 'Frites', quantity: 1, price: 3.50 },
        { name: 'Coca-Cola', quantity: 1, price: 2.50 }
      ],
      total: 13.50,
      delivery: {
        address: '123 Rue de Paris, 75001 Paris',
        time: '35 min'
      }
    },
    {
      id: '12347',
      date: new Date(),
      restaurant: {
        id: 3,
        name: 'Sushi Master'
      },
      status: 'processing',
      items: [
        { name: 'Plateau California', quantity: 1, price: 18.90 },
        { name: 'Miso Soup', quantity: 2, price: 3.50 }
      ],
      total: 25.90,
      delivery: {
        address: '123 Rue de Paris, 75001 Paris',
        time: 'En préparation'
      }
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Livré
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            En cours
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            Annulé
          </span>
        );
      default:
        return null;
    }
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

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-xl mb-6">Vous n'avez pas encore de commandes</p>
          <Link
            to="/restaurants"
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark"
          >
            Parcourir les restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex flex-wrap justify-between items-center">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-lg">Commande #{order.id}</h2>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-gray-600 text-sm">{formatDate(order.date)}</p>
              </div>
              <div className="text-right">
                <Link 
                  to={`/restaurants/${order.restaurant.id}`}
                  className="text-primary hover:underline font-medium"
                >
                  {order.restaurant.name}
                </Link>
                <p className="text-gray-700 font-bold">{order.total.toFixed(2)}€</p>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Articles commandés</h3>
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
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Livraison</h3>
                <p className="text-gray-700">{order.delivery.address}</p>
                <p className="text-gray-700">
                  Temps estimé: <span className="font-medium">{order.delivery.time}</span>
                </p>
              </div>
              
              {order.status === 'processing' && (
                <div className="mt-4 text-right">
                  <button className="text-red-500 hover:underline">
                    Annuler la commande
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