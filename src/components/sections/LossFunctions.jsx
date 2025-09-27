import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function LossFunctions() {
  const [selectedLoss, setSelectedLoss] = useState('mse');
  const [prediction, setPrediction] = useState(0.7);
  const [target, setTarget] = useState(1.0);
  const canvasRef = useRef(null);

  const lossFunctions = {
    mse: {
      name: 'Mean Squared Error',
      formula: 'L = ½(y - ŷ)²',
      useCase: 'Regression',
      func: (y, yhat) => 0.5 * Math.pow(y - yhat, 2),
      derivative: (y, yhat) => yhat - y,
      color: '#2563eb',
      description: 'Penalizes large errors more than small ones'
    },
    mae: {
      name: 'Mean Absolute Error',
      formula: 'L = |y - ŷ|',
      useCase: 'Robust Regression',
      func: (y, yhat) => Math.abs(y - yhat),
      derivative: (y, yhat) => yhat > y ? 1 : -1,
      color: '#10b981',
      description: 'Less sensitive to outliers than MSE'
    },
    crossentropy: {
      name: 'Cross-Entropy',
      formula: 'L = -y log(ŷ) - (1-y) log(1-ŷ)',
      useCase: 'Binary Classification',
      func: (y, yhat) => {
        const eps = 1e-15;
        yhat = Math.max(eps, Math.min(1 - eps, yhat));
        return -(y * Math.log(yhat) + (1 - y) * Math.log(1 - yhat));
      },
      derivative: (y, yhat) => {
        const eps = 1e-15;
        yhat = Math.max(eps, Math.min(1 - eps, yhat));
        return (yhat - y) / (yhat * (1 - yhat));
      },
      color: '#ef4444',
      description: 'Ideal for probability-based predictions'
    },
    huber: {
      name: 'Huber Loss',
      formula: 'L = ½(y-ŷ)² if |y-ŷ|≤δ, else δ|y-ŷ|-½δ²',
      useCase: 'Robust Regression',
      func: (y, yhat, delta = 0.5) => {
        const error = Math.abs(y - yhat);
        return error <= delta ? 
          0.5 * Math.pow(error, 2) : 
          delta * error - 0.5 * Math.pow(delta, 2);
      },
      derivative: (y, yhat, delta = 0.5) => {
        const error = yhat - y;
        return Math.abs(error) <= delta ? error : delta * Math.sign(error);
      },
      color: '#7c3aed',
      description: 'Combines benefits of MSE and MAE'
    }
  };

  const drawLossFunction = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = 50;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Draw axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Prediction (ŷ)', width / 2, height - 15);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Loss', 0, 0);
    ctx.restore();

    // Draw loss function
    const lossFunc = lossFunctions[selectedLoss];
    const points = [];
    const minPred = 0;
    const maxPred = 1;
    const step = 0.01;
    
    let maxLoss = 0;
    for (let pred = minPred; pred <= maxPred; pred += step) {
      const loss = lossFunc.func(target, pred);
      if (isFinite(loss)) {
        maxLoss = Math.max(maxLoss, loss);
        points.push({ pred, loss });
      }
    }

    // Draw curve
    ctx.strokeStyle = lossFunc.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    points.forEach((point, index) => {
      const x = padding + (point.pred / (maxPred - minPred)) * graphWidth;
      const y = height - padding - (point.loss / maxLoss) * graphHeight;
      
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw current point
    const currentLoss = lossFunc.func(target, prediction);
    if (isFinite(currentLoss)) {
      const x = padding + (prediction / (maxPred - minPred)) * graphWidth;
      const y = height - padding - (currentLoss / maxLoss) * graphHeight;
      
      ctx.fillStyle = lossFunc.color;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw target line
    const targetX = padding + (target / (maxPred - minPred)) * graphWidth;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(targetX, padding);
    ctx.lineTo(targetX, height - padding);
    ctx.stroke();
    ctx.setLineDash([]);

    // Grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const x = padding + (i / 5) * graphWidth;
      const y = height - padding - (i / 5) * graphHeight;
      
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawLossFunction();
  }, [selectedLoss, prediction, target]);

  const currentLoss = lossFunctions[selectedLoss].func(target, prediction);
  const currentGradient = lossFunctions[selectedLoss].derivative(target, prediction);

  return (
    <div className="section">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Loss Functions
      </motion.h2>
      
      <motion.p 
        className="section-subtitle"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        How neural networks measure and minimize prediction errors
      </motion.p>

      <div className="demo-container">
        <div className="demo-controls">
          <div className="control-group">
            <label>Loss Function:</label>
            <div className="button-group">
              {Object.entries(lossFunctions).map(([key, func]) => (
                <button
                  key={key}
                  className={`control-btn ${selectedLoss === key ? 'active' : ''}`}
                  onClick={() => setSelectedLoss(key)}
                  style={{
                    borderColor: selectedLoss === key ? func.color : 'var(--border)',
                    backgroundColor: selectedLoss === key ? func.color : 'var(--surface-light)'
                  }}
                >
                  {func.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Target: {target.toFixed(2)}</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={target}
              onChange={(e) => setTarget(parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>Prediction: {prediction.toFixed(2)}</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={prediction}
              onChange={(e) => setPrediction(parseFloat(e.target.value))}
              className="slider"
            />
          </div>
        </div>

        <div className="grid grid-2">
          <div className="visualization-container">
            <canvas 
              ref={canvasRef}
              width={400}
              height={300}
              className="loss-canvas"
            />
          </div>

          <div className="loss-info">
            <motion.div
              key={selectedLoss}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ color: lossFunctions[selectedLoss].color, marginBottom: '1rem' }}>
                {lossFunctions[selectedLoss].name}
              </h3>
              
              <div className="formula-box mb-4">
                <strong style={{ color: 'var(--accent)' }}>Formula:</strong>
                <div style={{ 
                  fontFamily: 'monospace', 
                  background: 'var(--surface-light)', 
                  padding: '0.75rem', 
                  borderRadius: '6px',
                  margin: '0.5rem 0'
                }}>
                  {lossFunctions[selectedLoss].formula}
                </div>
              </div>

              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                {lossFunctions[selectedLoss].description}
              </p>

              <div className="loss-stats">
                <div className="stat-row">
                  <span className="stat-label">Use Case:</span>
                  <span style={{ color: lossFunctions[selectedLoss].color, fontWeight: 'bold' }}>
                    {lossFunctions[selectedLoss].useCase}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Current Loss:</span>
                  <span className="stat-value">{currentLoss.toFixed(4)}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Gradient:</span>
                  <span className="stat-value">{currentGradient.toFixed(4)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Loss Function Comparison */}
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
          When to Use Each Loss Function
        </h3>
        
        <div className="grid grid-2">
          <div className="info-card">
            <h4 style={{ color: '#2563eb', marginBottom: '1rem' }}>
              Regression Tasks
            </h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
              <li><strong>MSE:</strong> When you want to penalize large errors heavily</li>
              <li><strong>MAE:</strong> When you have outliers in your data</li>
              <li><strong>Huber:</strong> Best of both worlds - robust yet smooth</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h4 style={{ color: '#ef4444', marginBottom: '1rem' }}>
              Classification Tasks
            </h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
              <li><strong>Cross-Entropy:</strong> For binary and multi-class classification</li>
              <li><strong>Focal Loss:</strong> When dealing with class imbalance</li>
              <li><strong>Hinge Loss:</strong> For support vector machines</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LossFunctions;