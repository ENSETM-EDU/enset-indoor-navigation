import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, SkipBack, RotateCcw, SkipForward, CheckCircle, Home, Play, Info, MousePointer, ArrowRight, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavigatePage = () => {
  const { salle } = useParams<{ salle: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [showHelper, setShowHelper] = useState(true); // État pour afficher la page d'aide

  useEffect(() => {
    if (!salle) return;

    const loadImages = async () => {
      setLoading(true);
      setError(null);
      const imageList: string[] = [];
      let stepIndex = 1;
      const maxSteps = 50; // Safety limit to prevent infinite loop

      // Try to load images until we find the last one
      while (stepIndex < maxSteps) {
        try {
          const imagePath = `/photos-navigation/${salle}/${stepIndex}.png`;
          
          // Create a promise to check if image exists
          const imageExists = await new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imagePath;
          });

          if (imageExists) {
            imageList.push(imagePath);
            stepIndex++;
          } else {
            break;
          }
        } catch (error) {
          console.error('Error loading image:', error);
          break;
        }
      }

      if (imageList.length === 0) {
        setError(`No images found for ${salle}`);
      }

      setImages(imageList);
      setTotalSteps(imageList.length);
      setLoading(false);
    };

    loadImages();
  }, [salle]);

  // Reset image loaded state when step changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentStep]);

  // Preload next image for smoother transitions
  useEffect(() => {
    if (images.length > 0 && currentStep < images.length - 1) {
      const nextImg = new window.Image();
      nextImg.src = images[currentStep + 1];
    }
  }, [currentStep, images]);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
  };

  const startNavigation = () => {
    setShowHelper(false);
  };

  const isLastStep = currentStep === totalSteps - 1;

  // Page d'aide
  const HelpPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-indigo-200 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

        {/* Header */}
        <div className="text-center mb-8 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-4"
          >
            <Info className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Navigation vers {salle}
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Prêt à être guidé ? Voici comment ça fonctionne
          </motion.p>
        </div>

        {/* Instructions */}
        <div className="space-y-6 mb-8">
          <motion.div 
            className="flex items-start space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Navigation par étapes</h3>
              <p className="text-gray-600">Nous allons vous guider jusqu'à votre salle en vous montrant une série d'images réelles du parcours à suivre.</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-start space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Contrôles intuitifs</h3>
              <p className="text-gray-600">Cliquez sur l'image ou utilisez le bouton "Suivant" pour avancer. Utilisez "Précédent" pour revenir en arrière.</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-start space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Suivi de progression</h3>
              <p className="text-gray-600">Une barre de progression vous indique votre avancement. Vous pouvez recommencer à tout moment.</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-start space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Arrivée à destination</h3>
              <p className="text-gray-600">Une fois arrivé à la fin du parcours, un message vous confirmera que vous êtes arrivé à destination.</p>
            </div>
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/explorer" className="flex-1">
            <motion.button 
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Annuler</span>
            </motion.button>
          </Link>
          
          <motion.button 
            onClick={startNavigation}
            className="flex-1 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Play className="w-5 h-5" />
            <span>Commencer la navigation</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-900 font-semibold">Chargement du parcours...</p>
        </div>
      </div>
    );
  }

  if (error || totalSteps === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Parcours non disponible
          </h1>
          <p className="text-gray-600 mb-8">
            {error || `Aucun parcours n'a été trouvé pour "${salle}".`}
          </p>
          <Link to="/explorer">
            <motion.button 
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retour à l'exploration
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  // Afficher la page d'aide si showHelper est true
  if (showHelper) {
    return <HelpPage />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/explorer">
              <motion.button 
                className="flex items-center space-x-2 text-blue-900 hover:text-blue-700 transition-colors"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Retour</span>
              </motion.button>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <h1 className="text-lg font-bold text-blue-900">
                  {salle}
                </h1>
                <p className="text-sm text-gray-600">
                  Étape {currentStep + 1} sur {totalSteps}
                </p>
              </div>
              
              <Link to="/">
                <motion.button 
                  className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-blue-900 h-2 rounded-full transition-all duration-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pb-32 sm:pb-4">
        <div className="relative max-w-4xl w-full">
          {/* Image */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative will-change-transform"
            >
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-800 rounded-2xl flex items-center justify-center min-h-[400px]">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={images[currentStep]}
                alt={`Étape ${currentStep + 1} vers ${salle}`}
                className={`w-full h-auto rounded-2xl shadow-2xl cursor-pointer transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'} max-h-[60vh] sm:max-h-[70vh] object-contain`}
                onClick={nextStep}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  console.error('Failed to load image:', images[currentStep]);
                  setImageLoaded(true);
                }}
                style={{ willChange: 'opacity, transform' }}
              />
              {/* Click hint */}
              {imageLoaded && !isLastStep && (
                <motion.div 
                  className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Cliquez pour continuer
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Success Message */}
          {isLastStep && (
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  Vous êtes arrivé à destination !
                </motion.h2>
                <motion.p 
                  className="text-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  Bienvenue à {salle}
                </motion.p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 left-0 w-full z-20 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-center space-x-2 px-2 py-3 sm:space-x-4 sm:px-4">
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex flex-col items-center justify-center flex-1 px-2 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-xl transition-all duration-300 disabled:cursor-not-allowed text-xs sm:text-base"
            whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
            whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
          >
            <SkipBack className="w-6 h-6 mb-1" />
            <span className="font-semibold">Précédent</span>
          </motion.button>

          <motion.button
            onClick={restart}
            className="flex flex-col items-center justify-center flex-1 px-2 py-2 sm:px-4 sm:py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all duration-300 text-xs sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-6 h-6 mb-1" />
            <span className="font-semibold">Recommencer</span>
          </motion.button>

          <motion.button
            onClick={nextStep}
            disabled={isLastStep}
            className="flex flex-col items-center justify-center flex-1 px-2 py-2 sm:px-4 sm:py-2 bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed text-xs sm:text-base"
            whileHover={{ scale: isLastStep ? 1 : 1.05 }}
            whileTap={{ scale: isLastStep ? 1 : 0.95 }}
          >
            <SkipForward className="w-6 h-6 mb-1" />
            <span className="font-semibold">Suivant</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default NavigatePage;