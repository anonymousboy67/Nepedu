import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function TrainingProcess() {
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(2.5);
  const [accuracy, setAccuracy] = useState(0.1);
  const [learningRate, setLearningRate] = useState(0.01);
  const [batchSize, setBatchSize] = useState(32);
  const [selectedOptimizer, setSelectedOptimizer] = useState('sgd');
  const canvasRef = useRef(null);
  const lossHistoryRef = useRef([]);
  const accuracyHistoryRef = useRef([]);

  const optimizers = {
    sgd: {
      name: 'Stochastic Gradient Descent',
      description: 'Basic optimization algorithm that updates weights in the direction of negative gradient.',
      advantages: ['Simple and intuitive', 'Memory efficient', 'Works well for convex problems'],
      disadvantages: ['Can get stuck in local minima', 'Sensitive to learning rate', 'Slow convergence'],
      color: '#2563eb'
    },
    adam: {
      name: 'Adam Optimizer',
      description: 'Adaptive learning rate method that combines momentum and RMSprop.',
      advantages: ['Fast convergence', 'Adaptive learning rates', 'Works well in practice'],
      disadvantages: ['Higher memory usage', 'Can overshoot optimal solution', 'Hyperparameter sensitive'],
      color: '#10b981'
    },
    rmsprop: {
      name: 'RMSprop',
      description: 'Maintains per-parameter learning rates adapted based on recent gradients.',
      advantages: ['Good for non-stationary objectives', 'Handles sparse gradients well', 'Stable training'],
      disadvantages: ['Can be slow to converge', 'Sensitive to initial learning rate', 'Memory overhead'],
      color: '#7c3aed'
    }
  };

  const trainingSteps = [
    {
      step: 1,
      title: "Forward Pass",
      description: "Input data flows through the network, computing predictions at each layer.",
      details: "Data moves from input layer → hidden layers → output layer, applying weights, biases, and activation functions.",
      icon: "→",
      color: "#2563eb"
    },
    {
      step: 2,
      title: "Loss Calculation",
      description: "Compare predictions with actual targets using a loss function.",
      details: "Common loss functions: Mean Squared Error (regression), Cross-entropy (classification).",
      icon: "📊",
      color: "#f59e0b"
    },
    {
      step: 3,
      title: "Backward Pass",
      description: "Calculate gradients by propagating error backwards through the network.",
      details: "Uses chain rule to compute how much each weight contributed to the total error.",
      icon: "←",
      color: "#ef4444"
    },
    {
      step: 4,
      title: "Weight Update",
      description: "Adjust weights and biases based on calculated gradients and learning rate.",
      details: "New weight = Old weight - (Learning rate × Gradient). This minimizes the loss function.",
      icon: "⚡",
      color: "#10b981"
    }
  ];

  const hyperparameters = [
    {
      name: "Learning Rate",
      description: "Controls how big steps the optimizer takes during training.",
      range: "0.0001 - 0.1",
      impact: "Too high: overshooting, instability. Too low: slow convergence.",
      tips: "Start with 0.001-0.01, use learning rate scheduling"
    },
    {
      name: "Batch Size",
      description: "Number of samples processed before updating weights.",
      range: "1 - 512+",
      impact: "Larger batches: stable gradients, more memory. Smaller: noisy but faster updates.",
      tips: "Common choices: 32, 64, 128. Balance between speed and stability"
    },
    {
      name: "Epochs",
      description: "Number of complete passes through the entire training dataset.",
      range: "10 - 1000+",
      impact: "Too few: underfitting. Too many: overfitting, wasted computation.",
      tips: "Use early stopping and validation monitoring"
    },
    {
      name: "Optimizer",
      description: "Algorithm used to update network weights based on gradients.",
      range: "SGD, Adam, RMSprop, etc.",
      impact: "Different optimizers have different convergence properties and memory requirements.",
      tips: "Adam is often a good default choice for most problems"
    }
  ];

  // Simulate training process
  useEffect(() => {
    let interval;
    if (isTraining && epoch < 100) {
      interval = setInterval(() => {
        setEpoch(prev => {
          const newEpoch = prev + 1;
          
          // Simulate loss decrease with some noise
          const baseLoss = 2.5 * Math.exp(-newEpoch * learningRate * 2);
          const noise = (Math.random() - 0.5) * 0.1;
          const newLoss = Math.max(0.01, baseLoss + noise);
          setLoss(newLoss);
          
          // Simulate accuracy increase
          const baseAccuracy = 1 - Math.exp(-newEpoch * learningRate * 1.5);
          const accNoise = (Math.random() - 0.5) * 0.05;
          const newAccuracy = Math.min(0.98, Math.max(0.1, baseAccuracy + accNoise));
          setAccuracy(newAccuracy);
          
          // Store history
          lossHistoryRef.current.push(newLoss);
          accuracyHistoryRef.current.push(newAccuracy);
          
          // Keep only last 50 points for performance
          if (lossHistoryRef.current.length > 50) {
            lossHistoryRef.current.shift();
            accuracyHistoryRef.current.shift();
          }
          
          return newEpoch;
        });
      }, 100);
    } else if (epoch >= 100) {
      setIsTraining(false);
    }
    
    return () => clearInterval(interval);
  }, [isTraining, epoch, learningRate]);

  // Draw training curves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = 50;
    const graphWidth = width - 2 * padding;
    const graphHeight = (height - 3 * padding) / 2;

    // Draw loss curve
    if (lossHistoryRef.current.length > 1) {
      const maxLoss = Math.max(...lossHistoryRef.current, 1);
      const minLoss = Math.min(...lossHistoryRef.current);
      
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      lossHistoryRef.current.forEach((loss, index) => {
        const x = padding + (index / (lossHistoryRef.current.length - 1)) * graphWidth;
        const y = padding + ((maxLoss - loss) / (maxLoss - minLoss)) * graphHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Loss curve label
      ctx.fillStyle = '#ef4444';
      ctx.font = '14px Arial';
      ctx.fillText('Loss', padding, padding - 10);
    }

    // Draw accuracy curve
    if (accuracyHistoryRef.current.length > 1) {
      const maxAcc = Math.max(...accuracyHistoryRef.current, 1);
      const minAcc = Math.min(...accuracyHistoryRef.current, 0);
      
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      accuracyHistoryRef.current.forEach((acc, index) => {
        const x = padding + (index / (accuracyHistoryRef.current.length - 1)) * graphWidth;
        const y = height - padding - ((acc - minAcc) / (maxAcc - minAcc)) * graphHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Accuracy curve label
      ctx.fillStyle = '#10b981';
      ctx.font = '14px Arial';
      ctx.fillText('Accuracy', padding, height - padding - graphHeight - 10);
    }

    // Draw grid and axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * graphWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y1 = padding + (i / 4) * graphHeight;
      const y2 = height - padding - (i / 4) * graphHeight;
      
      ctx.beginPath();
      ctx.moveTo(padding, y1);
      ctx.lineTo(width - padding, y1);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(padding, y2);
      ctx.lineTo(width - padding, y2);
      ctx.stroke();
    }

  }, [lossHistoryRef.current, accuracyHistoryRef.current]);

  const startTraining = () => {
    setIsTraining(true);
  };

  const resetTraining = () => {
    setIsTraining(false);
    setEpoch(0);
    setLoss(2.5);
    setAccuracy(0.1);
    lossHistoryRef.current = [];
    accuracyHistoryRef.current = [];
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
        Training Process
      </motion.h2>
      
      <motion.p 
        className="section-subtitle"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Experience how neural networks learn through interactive gradient descent simulation
      </motion.p>

      {/* Interactive Training Simulator */}
      <motion.div
        className="demo-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="demo-title">
          Live Training Simulator
        </h3>
        
        <div className="demo-controls">
          <div className="control-group">
            <label>Learning Rate: {learningRate}</label>
            <div className="button-group">
              <button 
                className="control-btn" 
                onClick={() => setLearningRate(0.001)}
                disabled={isTraining}
              >
                0.001
              </button>
              <button 
                className="control-btn" 
                onClick={() => setLearningRate(0.01)}
                disabled={isTraining}
              >
                0.01
              </button>
              <button 
                className="control-btn" 
                onClick={() => setLearningRate(0.1)}
                disabled={isTraining}
              >
                0.1
              </button>
            </div>
          </div>

          <div className="control-group">
            <label>Batch Size: {batchSize}</label>
            <div className="button-group">
              <button 
                className="control-btn" 
                onClick={() => setBatchSize(16)}
                disabled={isTraining}
              >
                16
              </button>
              <button 
                className="control-btn" 
                onClick={() => setBatchSize(32)}
                disabled={isTraining}
              >
                32
              </button>
              <button 
                className="control-btn" 
                onClick={() => setBatchSize(64)}
                disabled={isTraining}
              >
                64
              </button>
            </div>
          </div>

          <div className="control-group">
            <label>Optimizer:</label>
            <div className="button-group">
              {Object.entries(optimizers).map(([key, opt]) => (
                <button
                  key={key}
                  className={`control-btn ${selectedOptimizer === key ? 'active' : ''}`}
                  onClick={() => setSelectedOptimizer(key)}
                  disabled={isTraining}
                  style={{
                    borderColor: selectedOptimizer === key ? opt.color : 'var(--border)',
                    backgroundColor: selectedOptimizer === key ? opt.color : 'var(--surface-light)'
                  }}
                >
                  {opt.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <div className="button-group">
              <button 
                className="control-btn primary" 
                onClick={startTraining}
                disabled={isTraining || epoch >= 100}
              >
                {isTraining ? 'Training...' : 'Start Training'}
              </button>
              <button 
                className="control-btn" 
                onClick={resetTraining}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="visualization-container">
            <canvas 
              ref={canvasRef}
              width={500}
              height={400}
              className="training-canvas"
            />
          </div>

          <div className="training-stats">
            <div className="stats-grid">
              <div className="stat-card">
                <h4 style={{ color: 'var(--primary)' }}>Epoch</h4>
                <div className="stat-value">{epoch}/100</div>
              </div>
              
              <div className="stat-card">
                <h4 style={{ color: '#ef4444' }}>Loss</h4>
                <div className="stat-value">{loss.toFixed(4)}</div>
              </div>
              
              <div className="stat-card">
                <h4 style={{ color: '#10b981' }}>Accuracy</h4>
                <div className="stat-value">{(accuracy * 100).toFixed(1)}%</div>
              </div>
              
              <div className="stat-card">
                <h4 style={{ color: 'var(--accent)' }}>Learning Rate</h4>
                <div className="stat-value">{learningRate}</div>
              </div>
            </div>

            <div className="optimizer-info">
              <h4 style={{ color: optimizers[selectedOptimizer].color }}>
                {optimizers[selectedOptimizer].name}
              </h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {optimizers[selectedOptimizer].description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Training Steps */}
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
          The Training Process
        </h3>
        
        <div className="grid grid-2">
          {trainingSteps.map((step, index) => (
            <motion.div
              key={step.step}
              className="card"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: step.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}
                >
                  {step.step}
                </div>
                <h4 style={{ 
                  color: step.color, 
                  fontSize: '1.3rem',
                  margin: 0
                }}>
                  {step.title}
                </h4>
              </div>
              
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: '1rem',
                lineHeight: '1.6'
              }}>
                {step.description}
              </p>
              
              <div style={{
                background: 'var(--surface-light)',
                padding: '1rem',
                borderRadius: '6px',
                borderLeft: `4px solid ${step.color}`
              }}>
                <strong style={{ color: 'var(--accent)' }}>Details:</strong>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  marginTop: '0.5rem',
                  lineHeight: '1.5'
                }}>
                  {step.details}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Hyperparameters Guide */}
      <motion.div
        className="demo-container mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="demo-title">
          Hyperparameter Tuning Guide
        </h3>
        <p className="demo-description">
          Learn how to choose the right hyperparameters for effective training.
        </p>
        
        <div className="grid grid-2">
          {hyperparameters.map((param, index) => (
            <motion.div
              key={param.name}
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
                {param.name}
              </h4>
              
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {param.description}
              </p>
              
              <div className="mb-3">
                <strong style={{ color: 'var(--accent)' }}>Typical Range:</strong>
                <span style={{ 
                  color: 'var(--text-primary)', 
                  marginLeft: '0.5rem',
                  fontFamily: 'monospace'
                }}>
                  {param.range}
                </span>
              </div>
              
              <div className="mb-3">
                <strong style={{ color: 'var(--accent)' }}>Impact:</strong>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  marginTop: '0.25rem',
                  lineHeight: '1.4'
                }}>
                  {param.impact}
                </p>
              </div>
              
              <div>
                <strong style={{ color: 'var(--accent)' }}>Tips:</strong>
                <p style={{ 
                  color: 'var(--text-primary)', 
                  marginTop: '0.25rem',
                  lineHeight: '1.4',
                  fontStyle: 'italic'
                }}>
                  {param.tips}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Common Training Problems */}
      <motion.div
        className="demo-container mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="demo-title">
          Common Training Problems & Solutions
        </h3>
        
        <div className="grid grid-3">
          <div className="info-card">
            <h4 style={{ color: '#ef4444', marginBottom: '1rem' }}>
              🔥 Overfitting
            </h4>
            <div className="mb-3">
              <strong style={{ color: 'var(--accent)' }}>Symptoms:</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Training accuracy high, validation accuracy low
              </p>
            </div>
            <div>
              <strong style={{ color: 'var(--accent)' }}>Solutions:</strong>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>Add dropout layers</li>
                <li>Reduce model complexity</li>
                <li>Get more training data</li>
                <li>Use early stopping</li>
              </ul>
            </div>
          </div>
          
          <div className="info-card">
            <h4 style={{ color: '#f59e0b', marginBottom: '1rem' }}>
              🐌 Slow Convergence
            </h4>
            <div className="mb-3">
              <strong style={{ color: 'var(--accent)' }}>Symptoms:</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Loss decreases very slowly or plateaus
              </p>
            </div>
            <div>
              <strong style={{ color: 'var(--accent)' }}>Solutions:</strong>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>Increase learning rate</li>
                <li>Use Adam optimizer</li>
                <li>Add batch normalization</li>
                <li>Check data preprocessing</li>
              </ul>
            </div>
          </div>
          
          <div className="info-card">
            <h4 style={{ color: '#7c3aed', marginBottom: '1rem' }}>
              💥 Exploding Gradients
            </h4>
            <div className="mb-3">
              <strong style={{ color: 'var(--accent)' }}>Symptoms:</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Loss becomes NaN or increases rapidly
              </p>
            </div>
            <div>
              <strong style={{ color: 'var(--accent)' }}>Solutions:</strong>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>Reduce learning rate</li>
                <li>Apply gradient clipping</li>
                <li>Use batch normalization</li>
                <li>Check weight initialization</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TrainingProcess;