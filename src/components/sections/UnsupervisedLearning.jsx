import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function UnsupervisedLearning() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('kmeans');
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [data, setData] = useState([]);
  const [clusters, setClusters] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const algorithms = {
    kmeans: {
      name: 'K-Means Clustering',
      description: 'Groups data into k clusters by minimizing within-cluster variance',
      color: '#2563eb',
      applications: ['Customer segmentation', 'Image compression', 'Market research'],
      complexity: 'Simple'
    },
    dbscan: {
      name: 'DBSCAN',
      description: 'Density-based clustering that can find clusters of arbitrary shape',
      color: '#10b981',
      applications: ['Anomaly detection', 'Image processing', 'Social network analysis'],
      complexity: 'Moderate'
    },
    pca: {
      name: 'PCA',
      description: 'Reduces dimensionality while preserving maximum variance',
      color: '#7c3aed',
      applications: ['Data visualization', 'Feature extraction', 'Noise reduction'],
      complexity: 'Intermediate'
    },
    autoencoder: {
      name: 'Autoencoders',
      description: 'Neural networks that learn compressed representations of data',
      color: '#ef4444',
      applications: ['Dimensionality reduction', 'Denoising', 'Anomaly detection'],
      complexity: 'Advanced'
    }
  };

  const characteristics = [
    {
      title: 'No Labels Required',
      description: 'Learns patterns from data without ground truth labels',
      icon: '🏷️',
      color: '#2563eb'
    },
    {
      title: 'Pattern Discovery',
      description: 'Finds hidden structures and relationships in data',
      icon: '🔍',
      color: '#10b981'
    },
    {
      title: 'Exploratory Analysis',
      description: 'Helps understand data structure before building models',
      icon: '📊',
      color: '#f59e0b'
    },
    {
      title: 'Feature Learning',
      description: 'Automatically extracts meaningful features from raw data',
      icon: '⚙️',
      color: '#7c3aed'
    }
  ];

  // Generate sample data for clustering visualization
  const generateData = () => {
    const newData = [];
    const centers = [
      [-2, -2], [2, 2], [-2, 2], [2, -2]
    ];
    
    centers.forEach((center, clusterIndex) => {
      for (let i = 0; i < 25; i++) {
        newData.push({
          x: center[0] + (Math.random() - 0.5) * 2,
          y: center[1] + (Math.random() - 0.5) * 2,
          cluster: -1,
          originalCluster: clusterIndex
        });
      }
    });
    
    setData(newData);
    
    // Initialize random centroids for k-means
    const initialClusters = [];
    for (let i = 0; i < 4; i++) {
      initialClusters.push({
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6,
        color: `hsl(${i * 90}, 70%, 60%)`
      });
    }
    setClusters(initialClusters);
  };

  // K-means clustering step
  const kMeansStep = () => {
    if (selectedAlgorithm !== 'kmeans') return;
    
    // Assign points to nearest centroids
    const newData = data.map(point => {
      let minDist = Infinity;
      let nearestCluster = -1;
      
      clusters.forEach((cluster, index) => {
        const dist = Math.sqrt(
          Math.pow(point.x - cluster.x, 2) + Math.pow(point.y - cluster.y, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          nearestCluster = index;
        }
      });
      
      return { ...point, cluster: nearestCluster };
    });
    
    // Update centroids
    const newClusters = clusters.map((cluster, index) => {
      const clusterPoints = newData.filter(point => point.cluster === index);
      if (clusterPoints.length === 0) return cluster;
      
      const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
      const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
      
      return { ...cluster, x: avgX, y: avgY };
    });
    
    setData(newData);
    setClusters(newClusters);
    setIteration(prev => prev + 1);
  };

  // Draw visualization
  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = 50;
    const xMin = -4, xMax = 4;
    const yMin = -4, yMax = 4;
    
    const xToCanvas = (x) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
    const yToCanvas = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = -4; i <= 4; i += 2) {
      ctx.beginPath();
      ctx.moveTo(xToCanvas(i), padding);
      ctx.lineTo(xToCanvas(i), height - padding);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(padding, yToCanvas(i));
      ctx.lineTo(width - padding, yToCanvas(i));
      ctx.stroke();
    }

    if (selectedAlgorithm === 'kmeans') {
      // Draw data points
      data.forEach(point => {
        const x = xToCanvas(point.x);
        const y = yToCanvas(point.y);
        
        if (point.cluster >= 0) {
          ctx.fillStyle = clusters[point.cluster].color;
        } else {
          ctx.fillStyle = '#94a3b8';
        }
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw centroids
      clusters.forEach((cluster, index) => {
        const x = xToCanvas(cluster.x);
        const y = yToCanvas(cluster.y);
        
        ctx.fillStyle = cluster.color;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Add "X" mark
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 6, y - 6);
        ctx.lineTo(x + 6, y + 6);
        ctx.moveTo(x + 6, y - 6);
        ctx.lineTo(x - 6, y + 6);
        ctx.stroke();
      });
    } else {
      // For other algorithms, show conceptual visualization
      const concepts = {
        dbscan: { title: 'Density-Based Clustering', icon: '🔘' },
        pca: { title: 'Principal Components', icon: '📏' },
        autoencoder: { title: 'Encoder-Decoder', icon: '🔄' }
      };
      
      const concept = concepts[selectedAlgorithm];
      ctx.fillStyle = algorithms[selectedAlgorithm].color;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(concept.icon, width / 2, height / 2 - 20);
      
      ctx.fillStyle = '#64748b';
      ctx.font = '16px Arial';
      ctx.fillText(concept.title, width / 2, height / 2 + 20);
      ctx.fillText('Interactive demo coming soon!', width / 2, height / 2 + 45);
    }
  };

  useEffect(() => {
    generateData();
  }, []);

  useEffect(() => {
    drawVisualization();
  }, [data, clusters, selectedAlgorithm]);

  useEffect(() => {
    if (isRunning && selectedAlgorithm === 'kmeans') {
      animationRef.current = setTimeout(() => {
        kMeansStep();
        if (iteration > 20) {
          setIsRunning(false);
        }
      }, 500);
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isRunning, iteration, data, clusters]);

  const startClustering = () => {
    setIsRunning(true);
    setIteration(0);
  };

  const resetClustering = () => {
    setIsRunning(false);
    setIteration(0);
    generateData();
  };

  return (
    <div className="section">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Unsupervised Learning
      </motion.h2>
      
      <motion.p 
        className="section-subtitle"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Discover hidden patterns in data without labeled examples
      </motion.p>

      {/* Key Characteristics */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-center mb-6" style={{ 
          fontSize: '1.8rem', 
          color: 'var(--accent)'
        }}>
          Key Characteristics
        </h3>
        
        <div className="grid grid-4">
          {characteristics.map((char, index) => (
            <motion.div
              key={char.title}
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                {char.icon}
              </div>
              <h4 style={{ color: char.color, marginBottom: '1rem' }}>
                {char.title}
              </h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {char.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Interactive Demo */}
      <div className="demo-container">
        <div className="demo-controls">
          <div className="control-group">
            <label>Algorithm:</label>
            <div className="button-group">
              {Object.entries(algorithms).map(([key, algo]) => (
                <button
                  key={key}
                  className={`control-btn ${selectedAlgorithm === key ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedAlgorithm(key);
                    setIsRunning(false);
                    setIteration(0);
                  }}
                  style={{
                    borderColor: selectedAlgorithm === key ? algo.color : 'var(--border)',
                    backgroundColor: selectedAlgorithm === key ? algo.color : 'var(--surface-light)'
                  }}
                >
                  {algo.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {selectedAlgorithm === 'kmeans' && (
            <div className="control-group">
              <div className="button-group">
                <button 
                  className="control-btn primary" 
                  onClick={startClustering}
                  disabled={isRunning}
                >
                  {isRunning ? 'Clustering...' : 'Start K-Means'}
                </button>
                <button 
                  className="control-btn" 
                  onClick={resetClustering}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-2">
          <div className="visualization-container">
            <canvas 
              ref={canvasRef}
              width={400}
              height={400}
              className="unsupervised-canvas"
            />
            {selectedAlgorithm === 'kmeans' && (
              <div className="iteration-info">
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Iteration: {iteration}
                </p>
              </div>
            )}
          </div>

          <div className="algorithm-info">
            <motion.div
              key={selectedAlgorithm}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 style={{ color: algorithms[selectedAlgorithm].color, marginBottom: '1rem' }}>
                {algorithms[selectedAlgorithm].name}
              </h3>
              
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                {algorithms[selectedAlgorithm].description}
              </p>

              <div className="algorithm-details">
                <div className="detail-item">
                  <strong style={{ color: 'var(--accent)' }}>Complexity:</strong>
                  <span style={{ marginLeft: '0.5rem', color: 'var(--text-primary)' }}>
                    {algorithms[selectedAlgorithm].complexity}
                  </span>
                </div>
                
                <div className="detail-item mt-3">
                  <strong style={{ color: 'var(--accent)' }}>Applications:</strong>
                  <ul style={{ 
                    color: 'var(--text-secondary)', 
                    marginTop: '0.5rem',
                    paddingLeft: '1.5rem'
                  }}>
                    {algorithms[selectedAlgorithm].applications.map((app, i) => (
                      <li key={i}>{app}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Algorithm Comparison */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-center mb-6" style={{ 
          fontSize: '1.8rem', 
          color: 'var(--accent)'
        }}>
          Algorithm Comparison
        </h3>
        
        <div className="grid grid-2">
          <div className="info-card">
            <h4 style={{ color: '#2563eb', marginBottom: '1rem' }}>
              Clustering Algorithms
            </h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
              <li><strong>K-Means:</strong> Fast, requires knowing number of clusters</li>
              <li><strong>DBSCAN:</strong> Finds arbitrary shapes, handles noise</li>
              <li><strong>Hierarchical:</strong> Creates cluster tree, no k needed</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h4 style={{ color: '#7c3aed', marginBottom: '1rem' }}>
              Dimensionality Reduction
            </h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
              <li><strong>PCA:</strong> Linear, preserves maximum variance</li>
              <li><strong>t-SNE:</strong> Non-linear, great for visualization</li>
              <li><strong>Autoencoders:</strong> Neural networks, learns complex patterns</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* When to Use Unsupervised Learning */}
      <motion.div
        className="demo-container mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="demo-title">
          When to Use Unsupervised Learning
        </h3>
        
        <div className="grid grid-3">
          <div className="use-case-card">
            <h4 style={{ color: '#10b981', marginBottom: '1rem' }}>
              ✅ Ideal For
            </h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
              <li>Exploratory data analysis</li>
              <li>Customer segmentation</li>
              <li>Anomaly detection</li>
              <li>Data preprocessing</li>
              <li>Feature extraction</li>
            </ul>
          </div>
          
          <div className="use-case-card">
            <h4 style={{ color: '#f59e0b', marginBottom: '1rem' }}>
              ⚠️ Challenges
            </h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
              <li>No ground truth for validation</li>
              <li>Subjective result interpretation</li>
              <li>Parameter tuning difficulty</li>
              <li>Scalability issues</li>
              <li>Curse of dimensionality</li>
            </ul>
          </div>
          
          <div className="use-case-card">
            <h4 style={{ color: '#ef4444', marginBottom: '1rem' }}>
              ❌ Not Suitable For
            </h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
              <li>Precise prediction tasks</li>
              <li>When labels are available</li>
              <li>Real-time classification</li>
              <li>Small datasets</li>
              <li>Clear target outcomes</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default UnsupervisedLearning;