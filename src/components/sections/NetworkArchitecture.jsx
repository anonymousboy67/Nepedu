import React from 'react';
import { motion } from 'framer-motion';
import NeuralNetworkVisualizer from '../interactive/NeuralNetworkVisualizer';

function NetworkArchitecture() {
  const architectureTypes = [
    {
      name: "Feedforward Neural Network",
      description: "The most basic type where information flows in one direction from input to output.",
      layers: [4, 6, 4, 2],
      useCase: "Classification, Regression",
      advantages: ["Simple to understand", "Fast training", "Good for basic tasks"],
      icon: "→"
    },
    {
      name: "Deep Neural Network",
      description: "Multiple hidden layers that can learn complex patterns and representations.",
      layers: [4, 8, 6, 4, 2],
      useCase: "Complex pattern recognition",
      advantages: ["Learns complex features", "High accuracy", "Versatile"],
      icon: "⧉"
    },
    {
      name: "Autoencoder",
      description: "Symmetric network that learns to compress and reconstruct data.",
      layers: [8, 6, 3, 6, 8],
      useCase: "Dimensionality reduction, Denoising",
      advantages: ["Unsupervised learning", "Feature extraction", "Data compression"],
      icon: "⟷"
    }
  ];

  const networkComponents = [
    {
      name: "Input Layer",
      description: "Receives the raw data features. The number of neurons equals the number of input features.",
      color: "#f59e0b",
      role: "Data Entry Point",
      characteristics: ["No activation function", "Simply passes data forward", "Size = feature count"]
    },
    {
      name: "Hidden Layers",
      description: "Process and transform the data through weights, biases, and activation functions.",
      color: "#2563eb", 
      role: "Feature Learning",
      characteristics: ["Apply activation functions", "Learn complex patterns", "Can have multiple layers"]
    },
    {
      name: "Output Layer",
      description: "Produces the final prediction or classification result.",
      color: "#10b981",
      role: "Decision Making",
      characteristics: ["Size = number of classes/outputs", "Different activation for task type", "Final prediction"]
    }
  ];

  const layerSizingTips = [
    {
      layer: "Input Layer",
      rule: "Size = Number of features in your dataset",
      example: "For image (28x28): 784 neurons"
    },
    {
      layer: "Hidden Layers", 
      rule: "Start with 2/3 of input size, experiment from there",
      example: "Common patterns: [100, 50, 25] or [64, 32, 16]"
    },
    {
      layer: "Output Layer",
      rule: "Binary: 1 neuron, Multi-class: N neurons (N = classes)",
      example: "Dog/Cat: 1 neuron, MNIST: 10 neurons"
    }
  ];

  return (
    <div className="section">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Neural Network Architecture
      </motion.h2>
      
      <motion.p 
        className="section-subtitle"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Understand how layers work together to solve complex problems
      </motion.p>

      {/* Interactive Network Builder */}
      <NeuralNetworkVisualizer />

      {/* Architecture Types */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-center mb-8" style={{ 
          fontSize: '2rem', 
          color: 'var(--accent)',
          marginBottom: '2rem'
        }}>
          Common Architecture Types
        </h3>
        
        <div className="grid grid-3">
          {architectureTypes.map((arch, index) => (
            <motion.div
              key={arch.name}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center mb-4">
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {arch.icon}
                </div>
                <h4 style={{ 
                  color: 'var(--primary)', 
                  fontSize: '1.3rem',
                  marginBottom: '0.5rem'
                }}>
                  {arch.name}
                </h4>
              </div>
              
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: '1rem',
                lineHeight: '1.6'
              }}>
                {arch.description}
              </p>
              
              <div className="mb-4">
                <strong style={{ color: 'var(--accent)' }}>Structure:</strong>
                <div style={{
                  fontFamily: 'monospace',
                  background: 'var(--surface-light)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  marginTop: '0.5rem'
                }}>
                  {arch.layers.join(' → ')}
                </div>
              </div>
              
              <div className="mb-4">
                <strong style={{ color: 'var(--accent)' }}>Use Case:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {arch.useCase}
                </p>
              </div>
              
              <div>
                <strong style={{ color: 'var(--accent)' }}>Advantages:</strong>
                <ul style={{ 
                  color: 'var(--text-secondary)', 
                  marginTop: '0.5rem',
                  paddingLeft: '1.5rem'
                }}>
                  {arch.advantages.map((advantage, i) => (
                    <li key={i}>{advantage}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Network Components */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-center mb-8" style={{ 
          fontSize: '2rem', 
          color: 'var(--accent)',
          marginBottom: '2rem'
        }}>
          Understanding Network Components
        </h3>
        
        <div className="grid grid-3">
          {networkComponents.map((component, index) => (
            <motion.div
              key={component.name}
              className="card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: component.color,
                    marginRight: '1rem'
                  }}
                />
                <h4 style={{ 
                  color: component.color, 
                  fontSize: '1.3rem',
                  margin: 0
                }}>
                  {component.name}
                </h4>
              </div>
              
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: '1rem',
                lineHeight: '1.6'
              }}>
                {component.description}
              </p>
              
              <div className="mb-4">
                <strong style={{ color: 'var(--accent)' }}>Primary Role:</strong>
                <p style={{ color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {component.role}
                </p>
              </div>
              
              <div>
                <strong style={{ color: 'var(--accent)' }}>Key Characteristics:</strong>
                <ul style={{ 
                  color: 'var(--text-secondary)', 
                  marginTop: '0.5rem',
                  paddingLeft: '1.5rem'
                }}>
                  {component.characteristics.map((char, i) => (
                    <li key={i}>{char}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Layer Sizing Guidelines */}
      <motion.div
        className="demo-container mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="demo-title">
          Layer Sizing Guidelines
        </h3>
        <p className="demo-description">
          Learn how to determine the optimal number of neurons for each layer type.
        </p>
        
        <div className="grid grid-3">
          {layerSizingTips.map((tip, index) => (
            <motion.div
              key={tip.layer}
              className="info-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 style={{ 
                color: 'var(--primary)', 
                marginBottom: '1rem',
                fontSize: '1.2rem'
              }}>
                {tip.layer}
              </h4>
              
              <div className="mb-4">
                <strong style={{ color: 'var(--accent)' }}>Rule:</strong>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  marginTop: '0.5rem',
                  lineHeight: '1.5'
                }}>
                  {tip.rule}
                </p>
              </div>
              
              <div>
                <strong style={{ color: 'var(--accent)' }}>Example:</strong>
                <p style={{ 
                  color: 'var(--text-primary)', 
                  marginTop: '0.5rem',
                  fontFamily: 'monospace',
                  background: 'var(--surface)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  {tip.example}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Architecture Design Tips */}
      <motion.div
        className="demo-container mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="demo-title">
          Architecture Design Best Practices
        </h3>
        
        <div className="grid grid-2">
          <div>
            <h4 style={{ color: 'var(--success)', marginBottom: '1rem' }}>
              ✅ Do These Things
            </h4>
            <ul style={{ 
              color: 'var(--text-secondary)', 
              lineHeight: '1.8',
              paddingLeft: '1.5rem'
            }}>
              <li>Start simple, then add complexity</li>
              <li>Use ReLU activation for hidden layers</li>
              <li>Consider dropout for regularization</li>
              <li>Monitor for overfitting during training</li>
              <li>Experiment with different depths</li>
              <li>Validate design choices empirically</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: 'var(--error)', marginBottom: '1rem' }}>
              ❌ Avoid These Mistakes
            </h4>
            <ul style={{ 
              color: 'var(--text-secondary)', 
              lineHeight: '1.8',
              paddingLeft: '1.5rem'
            }}>
              <li>Making networks unnecessarily deep</li>
              <li>Using too many neurons without justification</li>
              <li>Ignoring computational constraints</li>
              <li>Not considering the data size</li>
              <li>Using sigmoid in deep networks</li>
              <li>Copying architectures without understanding</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default NetworkArchitecture;