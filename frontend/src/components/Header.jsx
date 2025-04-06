import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Transition } from '@headlessui/react';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-primary">
            CESI Eat
          </Link>

          {/* Search form - desktop */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Rechercher un restaurant..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-r-md hover:bg-primary-dark"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleMenu}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/restaurants"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
            >
              Restaurants
            </Link>

            {user ? (
              <>
                {user.role === 'livreur' && (
                  <Link
                    to="/livreur"
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                  >
                    Livraisons
                  </Link>
                )}
                {user.role === 'restaurateur' && (
                  <Link
                    to="/restaurateur"
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                  >
                    Mon Restaurant
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                  >
                    Administration
                  </Link>
                )}
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                >
                  Commandes
                </Link>
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md relative"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-semibold h-5 w-5 flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center">
                    <UserIcon className="h-6 w-6" />
                  </button>
                  <div className="absolute right-0 w-48 bg-white shadow-lg rounded-md p-2 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Mon Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                  Inscription
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Search form - mobile */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Rechercher un restaurant..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-r-md hover:bg-primary-dark"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Mobile menu */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden mt-3">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-md">
              <Link
                to="/restaurants"
                className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                onClick={toggleMenu}
              >
                Restaurants
              </Link>

              {user ? (
                <>
                  {user.role === 'livreur' && (
                    <Link
                      to="/livreur"
                      className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                      onClick={toggleMenu}
                    >
                      Livraisons
                    </Link>
                  )}
                  {user.role === 'restaurateur' && (
                    <Link
                      to="/restaurateur"
                      className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                      onClick={toggleMenu}
                    >
                      Mon Restaurant
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                      onClick={toggleMenu}
                    >
                      Administration
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                    onClick={toggleMenu}
                  >
                    Commandes
                  </Link>
                  <Link
                    to="/cart"
                    className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
                    onClick={toggleMenu}
                  >
                    <span>Panier</span>
                    {totalItems > 0 && (
                      <span className="ml-2 bg-secondary text-white text-xs font-semibold h-5 w-5 flex items-center justify-center rounded-full">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                    onClick={toggleMenu}
                  >
                    Mon Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="block w-full text-left text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                    onClick={toggleMenu}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block text-primary hover:text-primary-dark px-3 py-2 rounded-md"
                    onClick={toggleMenu}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </Transition>
      </div>
    </header>
  );
};

export default Header;
