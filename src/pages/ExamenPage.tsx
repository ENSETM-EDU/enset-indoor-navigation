import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, User, MapPin, Calendar, FileText, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface StudentData {
  cin: string;
  nom: string;
  prenom: string;
  numero_examen: string;
  concours: string;
  salle: string;
}

const ExamenPage = () => {
  const [cin, setCin] = useState('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const searchStudent = async () => {
  if (!cin.trim()) {
    setError('Veuillez saisir votre code CIN');
    return;
  }

  setLoading(true);
  setError('');

  try {
    // Vérification des variables d'environnement
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configuration Supabase manquante');
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/etudiant?cin=eq.${cin}`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
      }
    );

    // Vérification du statut de la réponse
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API:', response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.length > 0) {
      setStudent(data[0]);
    } else {
      setError('Aucun étudiant trouvé avec ce code CIN');
    }
  } catch (err) {
    console.error('Erreur complète:', err);
    setError(`Erreur lors de la recherche: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchStudent();
  };

  const goToSalle = () => {
    if (student?.salle) {
      navigate(`/navigate/${student.salle}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/">
            <motion.button
              className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Retour</span>
            </motion.button>
          </Link>
          <Link to="/">
            <motion.button
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        <div className="max-w-md mx-auto">
          {/* Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Accéder à mon examen
            </h1>
            <p className="text-blue-100">
              Saisissez votre code CIN pour consulter vos informations
            </p>
          </motion.div>

          {/* Search Form */}
          {!student && (
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="cin" className="block text-sm font-semibold text-gray-700 mb-2">
                    Code CIN
                  </label>
                  <input
                    type="text"
                    id="cin"
                    value={cin}
                    onChange={(e) => setCin(e.target.value)}
                    placeholder="Entrez votre code CIN"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <motion.div
                    className="text-red-600 text-sm bg-red-50 p-3 rounded-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Rechercher</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Student Info */}
          {student && (
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Informations trouvées
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-semibold text-gray-800">
                      {student.nom} {student.prenom}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Numéro d'examen</p>
                    <p className="font-semibold text-gray-800">
                      {student.numero_examen}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Concours</p>
                    <p className="font-semibold text-gray-800">
                      {student.concours}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Salle d'examen</p>
                    <p className="font-semibold text-blue-800">
                      {student.salle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  onClick={goToSalle}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Aller vers ma salle</span>
                </motion.button>

                <motion.button
                  onClick={() => setStudent(null)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Nouvelle recherche
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamenPage;