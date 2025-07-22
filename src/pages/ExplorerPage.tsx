import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight, MapPin, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StructureData {
  [category: string]: {
    [location: string]: string;
  }; 
}

const ExplorerPage = () => {
  const [structure, setStructure] = useState<StructureData>({});
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStructure = async () => {
      try {
        const response = await fetch('/structure.json');
        const data = await response.json();
        setStructure(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading structure:', error);
        setLoading(false);
      }
    };

    loadStructure();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('pedagogique')) return '🎓';
    if (category.includes('departement')) return '🏛️';
    if (category.includes('laboratoire')) return '🔬';
    return '📍';
  };

  const getCategoryTitle = (category: string) => {
    const titles: { [key: string]: string } = {
      'espaces_pedagogiques': 'Espaces Pédagogiques',
      'departements': 'Départements',
      'laboratoires_et_ateliers': 'Laboratoires et Ateliers'
    };
    return titles[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-900 font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
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
              className="flex items-center space-x-2 text-blue-900 hover:text-blue-700 transition-colors"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Retour</span>
            </motion.button>
          </Link>
          <Link to="/">
            <motion.button 
              className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Explorer l'ENSET
          </h1>
          <p className="text-gray-600 text-lg">
            Découvrez tous les espaces de l'école
          </p>
        </motion.div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto space-y-6">
          {Object.entries(structure).map(([category, locations], index) => (
            <motion.div 
              key={category}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.button
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(category)}
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-900">
                      {getCategoryTitle(category)}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {Object.keys(locations).length} lieux disponibles
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.includes(category) ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-blue-900" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {expandedSections.includes(category) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border-t border-gray-200">
                      {Object.entries(locations).map(([location, path]) => {
                        // use the folder name from the structure file rather
                        // than the displayed location title. This avoids
                        // issues when the folder name differs from the label
                        // (for example with accents).
                        const folder = path.replace(/^photos-navigation\//, '');
                        return (
                        <Link
                          key={location}
                          to={`/navigate/${folder}`}
                          className="block"
                        >
                          <motion.div
                            className="p-4 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex items-center space-x-3">
                              <MapPin className="w-5 h-5 text-blue-900" />
                              <span className="font-semibold text-gray-800 group-hover:text-blue-900 transition-colors">
                                {location}
                              </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-900 transition-colors" />
                          </motion.div>
                        </Link>
                      );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorerPage;
