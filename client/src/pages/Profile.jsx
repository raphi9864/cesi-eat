import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Nom requis'),
    email: Yup.string().email('Email invalide').required('Email requis'),
    phone: Yup.string().required('Téléphone requis'),
    address: Yup.string().required('Adresse requise'),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setStatus({ success: 'Profil mis à jour avec succès' });
    } catch (error) {
      setStatus({ error: error.response?.data?.message || 'Erreur lors de la mise à jour du profil' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form>
              {status?.success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  {status.success}
                </div>
              )}
              {status?.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {status.error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label htmlFor="phone" className="block text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <Field
                    type="tel"
                    name="phone"
                    id="phone"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-gray-700 mb-2">
                    Adresse
                  </label>
                  <Field
                    type="text"
                    name="address"
                    id="address"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary-dark transition duration-300"
              >
                {isSubmitting ? 'Mise à jour...' : 'Mettre à jour le profil'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Profile;
