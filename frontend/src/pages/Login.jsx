import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Adresse email invalide')
      .required('Email requis'),
    password: Yup.string()
      .required('Mot de passe requis'),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const loggedInUser = await login(values);
      switch (loggedInUser.role) {
        case 'client':
          navigate('/');
          break;
        case 'restaurant':
          navigate('/restaurant-dashboard');
          break;
        case 'delivery':
          navigate('/delivery-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Connexion</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="bg-white p-6 rounded-lg shadow-md">
            {status && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {status}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Mot de passe
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white p-3 rounded font-semibold hover:bg-primary-dark transition duration-300"
            >
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </button>
            <p className="mt-4 text-center text-gray-600">
              Vous n'avez pas de compte?{' '}
              <Link to="/register" className="text-primary hover:underline">
                S'inscrire
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
