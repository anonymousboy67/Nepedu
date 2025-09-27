import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import WhatAreNeuralNetworks from './components/sections/WhatAreNeuralNetworks';
import ActivationFunctions from './components/interactive/ActivationFunctions';
import NetworkArchitecture from './components/sections/NetworkArchitecture';
import TrainingProcess from './components/sections/TrainingProcess';
import ApplicationsSection from './components/sections/ApplicationsSection';
import UnsupervisedLearning from './components/sections/UnsupervisedLearning';
import Footer from './components/layout/Footer';
import './styles/App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 1000);

    // Handle scroll-based section detection
    const handleScroll = () => {
      const sections = ['home', 'neurons', 'activation', 'networks', 'training', 'applications', 'unsupervised'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-content"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="neural-loader">
            <div className="neuron-pulse"></div>
            <div className="neuron-pulse"></div>
            <div className="neuron-pulse"></div>
          </div>
          <h2>Initializing Neural Network...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header currentSection={currentSection} />
      
      <main>
        <section id="home">
          <Hero />
        </section>

        <section id="neurons">
          <WhatAreNeuralNetworks />
        </section>

        <section id="activation">
          <ActivationFunctions />
        </section>

        <section id="networks">
          <NetworkArchitecture />
        </section>

        <section id="training">
          <TrainingProcess />
        </section>

        <section id="applications">
          <ApplicationsSection />
        </section>

        <section id="unsupervised">
          <UnsupervisedLearning />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;