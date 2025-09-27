import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

function SOMVisualizer() {
  const [isTraining, setIsTraining] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState('colors');
  const [gridSize, setGridSize] = useState(10);
  const [learningRate, setLearningRate] = useState(0.5);
  const [neighborhoodRadius, setNeighborhoodRadius] = useState(3);
  const [som, setSom] = useState(null);
  const [inputData, setInputData] = useState([]);
  const [currentInput, setCurrentInput] = useState(null);
  const [winnerNeuron, setWinnerNeuron] = useState(null);
  const canvasRef = useRef(null);
  const dataCanvasRef = useRef(null);
  const animationRef = useRef(null);

  // Different datasets for SOM training
  const datasets = {
    colors: {
      name: 'RGB Colors',
      description: 'Learn color clustering in RGB space',
      dimensions: 3,
      generateData: () => {
        const data = [];
        // Generate various color clusters
        const clusters = [
          [1, 0, 0], [0, 1, 0], [0, 0, 1], // Primary colors
          [1, 1, 0], [1, 0, 1], [0, 1, 1], // Secondary colors
          [0.5, 0.5, 0.5], [0, 0, 0], [1, 1, 1] // Grays
        ];
        
        clusters.forEach(center => {
          for (let i = 0; i < 20; i++) {
            data.push([
              Math.max(0, Math.min(1, center[0] + (Math.random() - 0.5) * 0.3)),
              Math.max(0, Math.min(1, center[1] + (Math.random() - 0.5) * 0.3)),
              Math.max(0, Math.min(1, center[2] + (Math.random() - 0.5) * 0.3))
            ]);
          }
        });
        return data;
      }
    },
    clusters2d: {
      name: '2D Clusters',
      description: 'Simple 2D clustering problem',
      dimensions: 2,
      generateData: () => {
        const data = [];
        const centers = [[-2, -2], [2, 2], [-2, 2], [2, -2], [0, 0]];
        
        centers.forEach(center => {
          for (let i = 0; i < 30; i++) {
            data.push([
              center[0] + (Math.random() - 0.5) * 2,
              center[1] + (Math.random() - 0.5) * 2
            ]);
          }
        });
        return data;
      }
    },
    iris: {
      name: 'Iris-like Data',
      description: 'Multi-dimensional classification data',
      dimensions: 4,
      generateData: () => {
        const data = [];
        // Simulate 3 classes of iris-like data
        const classes = [
          [5.1, 3.5, 1.4, 0.2], // Setosa-like
          [6.2, 2.8, 4.3, 1.3], // Versicolor-like
          [7.3, 3.0, 6.3, 1.8]  // Virginica-like
        ];
        
        classes.forEach(center => {
          for (let i = 0; i < 50; i++) {
            data.push([
              Math.max(0, center[0] + (Math.random() - 0.5) * 1.5),
              Math.max(0, center[1] + (Math.random() - 0.5) * 1.0),
              Math.max(0, center[2] + (Math.random() - 0.5) * 2.0),
              Math.max(0, center[3] + (Math.random() - 0.5) * 0.8)
            ]);
          }
        });
        return data;
      }
    }
  };

  // Initialize SOM
  const initializeSom = useCallback(() => {
    const dimensions = datasets[selectedDataset].dimensions;
    const neurons = [];
    
    for (let i = 0; i < gridSize; i++) {
      neurons[i] = [];
      for (let j = 0; j < gridSize; j++) {
        // Initialize weights randomly
        const weights = [];
        for (let d = 0; d < dimensions; d++) {
          weights.push(Math.random());
        }
        neurons[i][j] = {
          weights,
          x: i,
          y: j
        };
      }
    }
    
    setSom(neurons);
    const data = datasets[selectedDataset].generateData();
    setInputData(data);
  }, [selectedDataset, gridSize]);

  // Find Best Matching Unit (BMU)
  const findBMU = useCallback((input, somGrid) => {
    let minDistance = Infinity;
    let bmu = null;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const neuron = somGrid[i][j];
        let distance = 0;
        
        for (let d = 0; d < input.length; d++) {
          distance += Math.pow(input[d] - neuron.weights[d], 2);
        }
        distance = Math.sqrt(distance);
        
        if (distance < minDistance) {
          minDistance = distance;
          bmu = { x: i, y: j, distance };
        }
      }
    }
    
    return bmu;
  }, [gridSize]);

  // Calculate neighborhood function
  const neighborhoodFunction = useCallback((bmu, neuron, radius) => {
    const distance = Math.sqrt(
      Math.pow(bmu.x - neuron.x, 2) + Math.pow(bmu.y - neuron.y, 2)
    );
    return Math.exp(-Math.pow(distance, 2) / (2 * Math.pow(radius, 2)));
  }, []);

  // Update SOM weights
  const updateSom = useCallback((input, bmu, currentSom, lr, radius) => {
    const newSom = currentSom.map(row => 
      row.map(neuron => ({ ...neuron, weights: [...neuron.weights] }))
    );
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const neuron = newSom[i][j];
        const influence = neighborhoodFunction(bmu, neuron, radius);
        
        for (let d = 0; d < neuron.weights.length; d++) {
          neuron.weights[d] += lr * influence * (input[d] - neuron.weights[d]);
        }
      }
    }
    
    return newSom;
  }, [gridSize, neighborhoodFunction]);

  // Training step
  const trainingStep = useCallback(() => {
    if (!som || !inputData.length) return;
    
    // Select random input
    const randomInput = inputData[Math.floor(Math.random() * inputData.length)];
    setCurrentInput(randomInput);
    
    // Find BMU
    const bmu = findBMU(randomInput, som);
    setWinnerNeuron(bmu);
    
    // Calculate decaying learning rate and neighborhood radius
    const maxIterations = 1000;
    const currentLR = learningRate * Math.exp(-iteration / (maxIterations / 5));
    const currentRadius = neighborhoodRadius * Math.exp(-iteration / (maxIterations / 3));
    
    // Update SOM
    const updatedSom = updateSom(randomInput, bmu, som, currentLR, currentRadius);
    setSom(updatedSom);
    
    setIteration(prev => prev + 1);
    
    if (iteration >= maxIterations) {
      setIsTraining(false);
    }
  }, [som, inputData, iteration, learningRate, neighborhoodRadius, findBMU, updateSom]);

  // Animation loop
  useEffect(() => {
    if (isTraining) {
      animationRef.current = setTimeout(() => {
        trainingStep();
      }, 50);
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isTraining, trainingStep]);

  // Draw SOM grid
  const drawSom = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !som) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;
    
    // Draw neurons
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const neuron = som[i][j];
        const x = i * cellWidth;
        const y = j * cellHeight;
        
        // Color based on weights
        let color;
        if (selectedDataset === 'colors') {
          // For RGB data, use weights as RGB values
          const r = Math.floor(neuron.weights[0] * 255);
          const g = Math.floor(neuron.weights[1] * 255);
          const b = Math.floor(neuron.weights[2] * 255);
          color = `rgb(${r}, ${g}, ${b})`;
        } else {
          // For other data, use grayscale based on weight magnitude
          const magnitude = neuron.weights.reduce((sum, w) => sum + w * w, 0);
          const intensity = Math.min(255, Math.floor(Math.sqrt(magnitude) * 50));
          color = `rgb(${intensity}, ${intensity}, ${intensity})`;
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellWidth, cellHeight);
        
        // Draw border
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
        
        // Highlight winner neuron
        if (winnerNeuron && winnerNeuron.x === i && winnerNeuron.y === j) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, cellWidth, cellHeight);
        }
      }
    }
    
    // Draw neighborhood radius around winner
    if (winnerNeuron && isTraining) {
      const centerX = (winnerNeuron.x + 0.5) * cellWidth;
      const centerY = (winnerNeuron.y + 0.5) * cellHeight;
      const radiusPixels = neighborhoodRadius * Math.min(cellWidth, cellHeight);
      
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radiusPixels, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [som, gridSize, selectedDataset, winnerNeuron, neighborhoodRadius, isTraining]);

  // Draw input data visualization
  const drawInputData = useCallback(() => {
    const canvas = dataCanvasRef.current;
    if (!canvas || !inputData.length) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    if (selectedDataset === 'clusters2d') {
      // For 2D data, plot directly
      const padding = 20;
      const plotWidth = width - 2 * padding;
      const plotHeight = height - 2 * padding;
      
      // Find data bounds
      const xValues = inputData.map(d => d[0]);
      const yValues = inputData.map(d => d[1]);
      const xMin = Math.min(...xValues);
      const xMax = Math.max(...xValues);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);
      
      const xRange = xMax - xMin;
      const yRange = yMax - yMin;
      
      // Draw axes
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();
      
      // Plot data points
      inputData.forEach((point, index) => {
        const x = padding + ((point[0] - xMin) / xRange) * plotWidth;
        const y = height - padding - ((point[1] - yMin) / yRange) * plotHeight;
        
        ctx.fillStyle = currentInput && point === currentInput ? '#ef4444' : '#2563eb';
        ctx.beginPath();
        ctx.arc(x, y, currentInput && point === currentInput ? 6 : 3, 0, 2 * Math.PI);
        ctx.fill();
      });
      
      // Highlight current input
      if (currentInput) {
        const x = padding + ((currentInput[0] - xMin) / xRange) * plotWidth;
        const y = height - padding - ((currentInput[1] - yMin) / yRange) * plotHeight;
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.stroke();
      }
    } else {
      // For higher dimensional data, show as colored squares
      const cols = Math.ceil(Math.sqrt(inputData.length));
      const rows = Math.ceil(inputData.length / cols);
      const cellWidth = width / cols;
      const cellHeight = height / rows;
      
      inputData.forEach((point, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = col * cellWidth;
        const y = row * cellHeight;
        
        let color;
        if (selectedDataset === 'colors') {
          const r = Math.floor(point[0] * 255);
          const g = Math.floor(point[1] * 255);
          const b = Math.floor(point[2] * 255);
          color = `rgb(${r}, ${g}, ${b})`;
        } else {
          // For iris data, use PCA-like projection to RGB
          const r = Math.floor((point[0] / 8) * 255);
          const g = Math.floor((point[1] / 5) * 255);
          const b = Math.floor((point[2] / 8) * 255);
          color = `rgb(${r}, ${g}, ${b})`;
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellWidth, cellHeight);
        
        // Highlight current input
        if (currentInput && point === currentInput) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, cellWidth, cellHeight);
        }
      });
    }
  }, [inputData, selectedDataset, currentInput]);

  // Initialize on component mount and dataset change
  useEffect(() => {
    initializeSom();
  }, [initializeSom]);

  // Redraw visualizations
  useEffect(() => {
    drawSom();
  }, [drawSom]);

  useEffect(() => {
    drawInputData();
  }, [drawInputData]);

  const startTraining = () => {
    setIsTraining(true);
    setIteration(0);
  };

  const stopTraining = () => {
    setIsTraining(false);
  };

  const resetSom = () => {
    setIsTraining(false);
    setIteration(0);
    setCurrentInput(null);
    setWinnerNeuron(null);
    initializeSom();
  };

  const currentLR = isTraining ? learningRate * Math.exp(-iteration / 200) : learningRate;
  const currentRadius = isTraining ? neighborhoodRadius * Math.exp(-iteration / 300) : neighborhoodRadius;

  return (
    <div className="demo-container">
      <motion.h3 
        className="demo-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Self-Organizing Map (SOM) Visualizer
      </motion.h3>
      
      <motion.p 
        className="demo-description"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Watch a Self-Organizing Map learn to cluster data through unsupervised competitive learning.
      </motion.p>

      <div className="demo-controls">
        <div className="control-group">
          <label>Dataset:</label>
          <div className="button-group">
            {Object.entries(datasets).map(([key, dataset]) => (
              <button
                key={key}
                className={`control-btn ${selectedDataset === key ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDataset(key);
                  resetSom();
                }}
                disabled={isTraining}
              >
                {dataset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Grid Size: {gridSize}x{gridSize}</label>
          <div className="button-group">
            <button 
              className="control-btn" 
              onClick={() => setGridSize(8)}
              disabled={isTraining}
            >
              8x8
            </button>
            <button 
              className="control-btn" 
              onClick={() => setGridSize(10)}
              disabled={isTraining}
            >
              10x10
            </button>
            <button 
              className="control-btn" 
              onClick={() => setGridSize(15)}
              disabled={isTraining}
            >
              15x15
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>Learning Rate: {learningRate}</label>
          <div className="button-group">
            <button 
              className="control-btn" 
              onClick={() => setLearningRate(0.1)}
              disabled={isTraining}
            >
              0.1
            </button>
            <button 
              className="control-btn" 
              onClick={() => setLearningRate(0.5)}
              disabled={isTraining}
            >
              0.5
            </button>
            <button 
              className="control-btn" 
              onClick={() => setLearningRate(0.9)}
              disabled={isTraining}
            >
              0.9
            </button>
          </div>
        </div>

        <div className="control-group">
          <div className="button-group">
            <button 
              className="control-btn primary" 
              onClick={startTraining}
              disabled={isTraining}
            >
              Start Training
            </button>
            <button 
              className="control-btn" 
              onClick={stopTraining}
              disabled={!isTraining}
            >
              Stop
            </button>
            <button 
              className="control-btn" 
              onClick={resetSom}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="visualization-container">
          <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center' }}>
            Self-Organizing Map
          </h4>
          <canvas 
            ref={canvasRef}
            width={400}
            height={400}
            className="som-canvas"
          />
          <div className="som-info">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
              {selectedDataset === 'colors' ? 'Colors represent learned RGB values' : 
               'Brightness represents weight magnitudes'}
            </p>
          </div>
        </div>

        <div className="visualization-container">
          <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center' }}>
            Input Data
          </h4>
          <canvas 
            ref={dataCanvasRef}
            width={400}
            height={400}
            className="data-canvas"
          />
          <div className="data-info">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
              {datasets[selectedDataset].description}
            </p>
          </div>
        </div>
      </div>

      <div className="som-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Iteration:</span>
            <span className="stat-value">{iteration}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Current Learning Rate:</span>
            <span className="stat-value">{currentLR.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Neighborhood Radius:</span>
            <span className="stat-value">{currentRadius.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Data Dimensions:</span>
            <span className="stat-value">{datasets[selectedDataset].dimensions}D</span>
          </div>
        </div>

        {currentInput && (
          <div className="current-input-info">
            <h4 style={{ color: 'var(--accent)' }}>Current Input:</h4>
            <div style={{ 
              fontFamily: 'monospace', 
              background: 'var(--surface-light)', 
              padding: '0.5rem', 
              borderRadius: '4px' 
            }}>
              [{currentInput.map(v => v.toFixed(3)).join(', ')}]
            </div>
            {winnerNeuron && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Winner Position:</strong> ({winnerNeuron.x}, {winnerNeuron.y})
                <br />
                <strong>Distance:</strong> {winnerNeuron.distance.toFixed(4)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Algorithm Explanation */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
          How Self-Organizing Maps Work
        </h4>
        
        <div className="grid grid-2">
          <div className="algorithm-step">
            <h5 style={{ color: 'var(--primary)' }}>1. Competitive Learning</h5>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              For each input, neurons compete to be the "winner" (Best Matching Unit) based on 
              similarity to their weight vectors. The neuron with weights closest to the input wins.
            </p>
          </div>
          
          <div className="algorithm-step">
            <h5 style={{ color: 'var(--primary)' }}>2. Neighborhood Update</h5>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              The winner and its neighbors update their weights toward the input. 
              Closer neighbors are influenced more strongly than distant ones.
            </p>
          </div>
          
          <div className="algorithm-step">
            <h5 style={{ color: 'var(--primary)' }}>3. Topology Preservation</h5>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              The 2D grid structure ensures that similar inputs map to nearby locations, 
              preserving the topological relationships from the input space.
            </p>
          </div>
          
          <div className="algorithm-step">
            <h5 style={{ color: 'var(--primary)' }}>4. Self-Organization</h5>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Over time, the map organizes itself so that similar inputs activate nearby neurons, 
              creating a low-dimensional representation of the input space.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Applications */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
          Real-World Applications
        </h4>
        
        <div className="grid grid-3">
          <div className="application-example">
            <h6 style={{ color: 'var(--primary)' }}>Data Visualization</h6>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Reduce high-dimensional data to 2D for visualization and exploration
            </p>
          </div>
          
          <div className="application-example">
            <h6 style={{ color: 'var(--primary)' }}>Customer Segmentation</h6>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Group customers with similar behaviors for targeted marketing
            </p>
          </div>
          
          <div className="application-example">
            <h6 style={{ color: 'var(--primary)' }}>Image Processing</h6>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Color quantization and feature extraction from images
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SOMVisualizer;