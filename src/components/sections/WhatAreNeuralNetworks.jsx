import React from 'react';
import { motion } from 'framer-motion';
import PerceptronDemo from '../interactive/PerceptronDemo';

function WhatAreNeuralNetworks() {
  return (
    <div className="section">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        What are Neural Networks?
      </motion.h2>
      
      <motion.p 
        className="section-subtitle"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Neural networks are computational models inspired by how the human brain processes information
      </motion.p>

      <div className="grid grid-2">
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-4" style={{color: 'var(--accent)', fontSize: '1.5rem'}}>
            Biological Inspiration
          </h3>
          <p className="mb-4" style={{color: 'var(--text-secondary)'}}>
            Neural networks mimic the structure and function of biological neurons in the brain, 
            where billions of interconnected neurons process and transmit information.
          </p>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-4" style={{color: 'var(--accent)', fontSize: '1.5rem'}}>
            Artificial Neurons
          </h3>
          <p className="mb-4" style={{color: 'var(--text-secondary)'}}>
            Artificial neurons are simplified computational units that receive inputs, 
            apply weights and bias, then generate output through an activation function.
          </p>
        </motion.div>
      </div>

      <PerceptronDemo />
    </div>
  );
}

export default WhatAreNeuralNetworks;