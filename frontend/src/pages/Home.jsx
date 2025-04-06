import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Bienvenue sur CESI Eat</h1>
        <p className="text-lg text-gray-600 mb-8">
          Découvrez les meilleurs restaurants près de chez vous et commandez en quelques clics !
        </p>
        <Link
          to="/restaurants"
          className="bg-primary text-white px-6 py-3 rounded-md text-lg hover:bg-primary-dark transition duration-300"
        >
          Explorer les restaurants
        </Link>
      </div>
    </div>
  );
};

export default Home;
