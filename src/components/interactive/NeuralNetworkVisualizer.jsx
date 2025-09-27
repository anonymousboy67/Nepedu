import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function NeuralNetworkVisualizer() {
  const [layers, setLayers] = useState([4, 6, 4, 2]);
  const [isForwardPassing, setIsForwardPassing] = useState(false);
  const [activations, setActivations] = useState([]);
  const [networkType, setNetworkType] = useState('classification');
  const canvasRef = useRef(null);

  // Initialize activations
  useEffect(() => {
    const newActivations = layers.map(layerSize => 
      Array(layerSize).fill(0).map(() => Math.random())
    );
    setActivations(newActivations);
  }, [layers]);

  // Draw the network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const layerSpacing = width / (layers.length + 1);
    const maxNeurons = Math.max(...layers);

    // Draw connections first
    for (let i = 0; i < layers.length - 1; i++) {
      const currentLayerX = layerSpacing * (i + 1);
      const nextLayerX = layerSpacing * (i + 2);
      const currentLayerSize = layers[i];
      const nextLayerSize = layers[i + 1];

      for (let j = 0; j < currentLayerSize; j++) {
        for (let k = 0; k < nextLayerSize; k++) {
          const currentY = (height / (currentLayerSize + 1)) * (j + 1);
          const nextY = (height / (nextLayerSize + 1)) * (k + 1);

          // Connection strength based on activation
          const strength = isForwardPassing ? 
            (activations[i] && activations[i][j] ? activations[i][j] : 0.5) : 0.3;
          
          ctx.strokeStyle = `rgba(37, 99, 235, ${strength})`;
          ctx.lineWidth = strength * 3 + 0.5;
          ctx.beginPath();
          ctx.moveTo(currentLayerX + 15, currentY);
          ctx.lineTo(nextLayerX - 15, nextY);
          ctx.stroke();
        }
      }
    }

    // Draw neurons
    layers.forEach((layerSize, layerIndex) => {
      const x = layerSpacing * (layerIndex + 1);
      
      for (let neuronIndex = 0; neuronIndex < layerSize; neuronIndex++) {
        const y = (height / (layerSize + 1)) * (neuronIndex + 1);
        
        // Neuron activation level
        const activation = activations[layerIndex] && activations[layerIndex][neuronIndex] ? 
          activations[layerIndex][neuronIndex] : 0.5;
        
        // Color based on layer type
        let color;
        if (layerIndex === 0) color = '#f59e0b'; // Input layer
        else if (layerIndex === layers.length - 1) color = '#10b981'; // Output layer  
        else color = '#2563eb'; // Hidden layers

        // Glow effect during forward pass
        if (isForwardPassing) {
          const glowSize = 30 + activation * 20;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
          gradient.addColorStop(0, `${color}60`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fillRect(x - glowSize, y - glowSize, glowSize * 2, glowSize * 2);
        }

        // Neuron circle
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3 + activation * 0.7;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Neuron border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.stroke();

        // Activation value
        if (isForwardPassing) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(activation.toFixed(2), x, y + 25);
        }
      }

      // Layer labels
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      let label;
      if (layerIndex === 0) label = 'Input';
      else if (layerIndex === layers.length - 1) label = 'Output';
      else label = `Hidden ${layerIndex}`;
      
      ctx.fillText(label, x, 30);
      ctx.fillText(`(${layerSize})`, x, 45);
    });

  }, [layers, activations, isForwardPassing]);

  const addLayer = () => {
    if (layers.length < 6) {
      const newLayers = [...layers];
      newLayers.splice(-1, 0, Math.floor(Math.random() * 6) + 2);
      setLayers(newLayers);
    }
  };

  const removeLayer = () => {
    if (layers.length > 2) {
      const newLayers = [...layers];
      newLayers.splice(-2, 1);
      setLayers(newLayers);
    }
  };

  const changeLayerSize = (layerIndex, delta) => {
    const newLayers = [...layers];
    const newSize = Math.max(1, Math.min(10, newLayers[layerIndex] + delta));
    newLayers[layerIndex] = newSize;
    setLayers(newLayers);
  };

  const animateForwardPass = async () => {
    setIsForwardPassing(true);
    
    // Animate layer by layer
    for (let i = 0; i < layers.length; i++) {
      // Update activations for current layer
      const newActivations = [...activations];
      newActivations[i] = Array(layers[i]).fill(0).map(() => Math.random());
      setActivations(newActivations);
      
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setTimeout(() => setIsForwardPassing(false), 1000);
  };

  const resetNetwork = () => {
    setLayers([4, 6, 4, 2]);
    setIsForwardPassing(false);
  };

  const changeNetworkType = (type) => {
    setNetworkType(type);
    if (type === 'classification') {
      setLayers([4, 6, 4, 3]); // Multi-class output
    } else if (type === 'regression') {
      setLayers([4, 6, 4, 1]); // Single output
    } else if (type === 'autoencoder') {
      setLayers([8, 4, 2, 4, 8]); // Encoder-decoder structure
    }
  };

  return (
    <div className="demo-container">
      <motion.h3 
        className="demo-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Neural Network Architecture Builder
      </motion.h3>

      <motion.p 
        className="demo-description"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Design your own neural network architecture and watch data flow through the layers.
      </motion.p>

      <div className="demo-controls">
        <div className="control-group">
          <label>Network Type:</label>
          <div className="button-group">
            <button 
              className={`control-btn ${networkType === 'classification' ? 'active' : ''}`}
              onClick={() => changeNetworkType('classification')}
            >
              Classification
            </button>
            <button 
              className={`control-btn ${networkType === 'regression' ? 'active' : ''}`}
              onClick={() => changeNetworkType('regression')}
            >
              Regression
            </button>
            <button 
              className={`control-btn ${networkType === 'autoencoder' ? 'active' : ''}`}
              onClick={() => changeNetworkType('autoencoder')}
            >
              Autoencoder
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>Network Structure:</label>
          <div className="button-group">
            <button onClick={addLayer} className="demo-button">Add Layer</button>
            <button onClick={removeLayer} className="demo-button">Remove Layer</button>
            <button onClick={animateForwardPass} className="demo-button primary">
              Forward Pass
            </button>
            <button onClick={resetNetwork} className="demo-button">Reset</button>
          </div>
        </div>
      </div>

      <div className="layer-controls">
        {layers.map((size, index) => (
          <motion.div 
            key={index}
            className="layer-control"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.1 }}
          >
            <label>
              {index === 0 ? 'Input' : 
               index === layers.length - 1 ? 'Output' : 
               `Hidden ${index}`}
            </label>
            <div className="size-controls">
              <button 
                onClick={() => changeLayerSize(index, -1)}
                className="size-btn"
                disabled={size <= 1}
              >
                -
              </button>
              <span className="size-display">{size}</span>
              <button 
                onClick={() => changeLayerSize(index, 1)}
                className="size-btn"
                disabled={size >= 10}
              >
                +
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="visualization-container">
        <canvas 
          ref={canvasRef}
          width={800}
          height={400}
          className="network-canvas"
        />
      </div>

      <div className="network-info">
        <div className="info-card">
          <h4>Network Statistics</h4>
          <div className="stats">
            <div className="stat">
              <span className="stat-label">Total Layers:</span>
              <span className="stat-value">{layers.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Neurons:</span>
              <span className="stat-value">{layers.reduce((sum, size) => sum + size, 0)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Parameters (approx):</span>
              <span className="stat-value">
                {layers.reduce((total, size, index) => {
                  if (index === layers.length - 1) return total;
                  return total + (size * layers[index + 1]) + layers[index + 1];
                }, 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h4>Layer Information</h4>
          <div className="layer-info">
            <div className="color-legend">
              <div className="legend-item">
                <div className="color-box" style={{backgroundColor: '#f59e0b'}}></div>
                <span>Input Layer</span>
              </div>
              <div className="legend-item">
                <div className="color-box" style={{backgroundColor: '#2563eb'}}></div>
                <span>Hidden Layers</span>
              </div>
              <div className="legend-item">
                <div className="color-box" style={{backgroundColor: '#10b981'}}></div>
                <span>Output Layer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NeuralNetworkVisualizer;