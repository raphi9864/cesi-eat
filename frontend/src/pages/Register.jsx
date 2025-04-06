import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Nom requis')
      .min(2, 'Nom trop court'),
    email: Yup.string()
      .email('Adresse email invalide')
      .required('Email requis'),
    password: Yup.string()
      .required('Mot de passe requis')
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
      .required('Confirmation du mot de passe requise'),
    role: Yup.string()
      .oneOf(['client', 'restaurateur', 'livreur'], 'Rôle invalide')
      .required('Rôle requis'),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const { confirmPassword, ...userData } = values;
      await register(userData);
      navigate('/');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erreur d\'inscription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Inscription</h1>
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
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Nom complet
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
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
            <div className="mb-4">
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
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="role" className="block text-gray-700 mb-2">
                Je m'inscris en tant que
              </label>
              <Field
                as="select"
                name="role"
                id="role"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="client">Client</option>
                <option value="restaurateur">Restaurateur</option>
                <option value="livreur">Livreur</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white p-3 rounded font-semibold hover:bg-primary-dark transition duration-300"
            >
              {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
            <p className="mt-4 text-center text-gray-600">
              Vous avez déjà un compte?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
