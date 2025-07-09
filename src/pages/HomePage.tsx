import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { easeOut } from 'framer-motion';
import ensetLogo from '/images/enset-logo.png';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 }, 
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: easeOut
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <motion.div 
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-40 h-20 mb-6 mx-auto"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={ensetLogo} alt="ENSET Logo" className="" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Bienvenue à l'ENSET
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Votre guide de navigation au sein de l'ENSET
          </p>
        </motion.div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Exam Section */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-900 flex flex-col h-full"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col flex-1 p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-6 mx-auto">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                Accéder à ma salle d'examen
              </h2>
              <p className="text-gray-600 text-center mb-8 leading-relaxed flex-1">
                Saisissez votre code CIN pour consulter vos informations et être guidé vers votre salle.
              </p>
              <div className="mt-auto">
                <Link to="/examen">
                  <motion.button 
                    className="w-full bg-white hover:bg-blue-50 text-blue-900 font-semibold py-4 px-6 rounded-xl border-2 border-blue-900 transition-all duration-300 flex items-center justify-center space-x-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Accéder à ma salle d'examen</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>

          
          {/* Explorer Section */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col flex-1 p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                <MapPin className="w-8 h-8 text-blue-900" />
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                Explorer l'ENSET
              </h2>
              <p className="text-gray-600 text-center mb-8 leading-relaxed flex-1">
                Explorez les salles, amphis, laboratoires, bureaux administratifs et autres installations de l'école.
              </p>
              <div className="mt-auto">
                <Link to="/explorer">
                  <motion.button 
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Commencer la visite</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div> 

        {/* Footer */}
        <motion.div 
          className="text-center mt-16"
          variants={itemVariants}
        >
          <p className="text-gray-500 text-sm">
            École Nationale Supérieure de l'Enseignement Technique
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;