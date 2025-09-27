import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function ActivationFunctions() {
  const [activeFunction, setActiveFunction] = useState('sigmoid');
  const [inputValue, setInputValue] = useState(0);
  const canvasRef = useRef(null);

  const activationFunctions = {
    sigmoid: {
      name: 'Sigmoid',
      formula: 'σ(x) = 1 / (1 + e^(-x))',
      description: 'Maps any real value to a range between 0 and 1, making it perfect for binary classification problems.',
      func: (x) => 1 / (1 + Math.exp(-x)),
      derivative: (x) => {
        const s = 1 / (1 + Math.exp(-x));
        return s * (1 - s);
      },
      range: [0, 1],
      color: '#2563eb'
    },
    relu: {
      name: 'ReLU',
      formula: 'f(x) = max(0, x)',
      description: 'Returns the input if positive, otherwise zero. Simple and computationally efficient.',
      func: (x) => Math.max(0, x),
      derivative: (x) => x > 0 ? 1 : 0,
      range: [0, 6],
      color: '#10b981'
    },
    tanh: {
      name: 'Tanh',
      formula: 'tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))',
      description: 'Similar to sigmoid but outputs between -1 and 1, often converges faster than sigmoid.',
      func: (x) => Math.tanh(x),
      derivative: (x) => 1 - Math.pow(Math.tanh(x), 2),
      range: [-1, 1],
      color: '#7c3aed'
    },
    leakyRelu: {
      name: 'Leaky ReLU',
      formula: 'f(x) = x if x > 0, else αx (α = 0.01)',
      description: 'Like ReLU but allows small negative values, preventing "dying neurons" problem.',
      func: (x) => x > 0 ? x : 0.01 * x,
      derivative: (x) => x > 0 ? 1 : 0.01,
      range: [-0.3, 6],
      color: '#f59e0b'
    },
    elu: {
      name: 'ELU',
      formula: 'f(x) = x if x > 0, else α(e^x - 1)',
      description: 'Exponential Linear Unit, smooth function that can produce negative outputs.',
      func: (x) => x > 0 ? x : 1 * (Math.exp(x) - 1),
      derivative: (x) => x > 0 ? 1 : 1 * Math.exp(x),
      range: [-1, 6],
      color: '#ef4444'
    }
  };

  // Draw the activation function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Set up coordinate system
    const padding = 50;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    const xMin = -6;
    const xMax = 6;
    const func = activationFunctions[activeFunction];
    const yMin = func.range[0] - 0.5;
    const yMax = func.range[1] + 0.5;

    // Helper functions for coordinate transformation
    const xToCanvas = (x) => padding + ((x - xMin) / (xMax - xMin)) * graphWidth;
    const yToCanvas = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * graphHeight;

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    
    // Vertical grid lines
    for (let x = -6; x <= 6; x += 2) {
      ctx.beginPath();
      ctx.moveTo(xToCanvas(x), padding);
      ctx.lineTo(xToCanvas(x), height - padding);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      ctx.beginPath();
      ctx.moveTo(padding, yToCanvas(y));
      ctx.lineTo(width - padding, yToCanvas(y));
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, yToCanvas(0));
    ctx.lineTo(width - padding, yToCanvas(0));
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(xToCanvas(0), padding);
    ctx.lineTo(xToCanvas(0), height - padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let x = -6; x <= 6; x += 2) {
      if (x !== 0) {
        ctx.fillText(x.toString(), xToCanvas(x), yToCanvas(0) + 20);
      }
    }
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      if (y !== 0) {
        ctx.fillText(y.toString(), xToCanvas(0) - 10, yToCanvas(y) + 5);
      }
    }

    // Draw the function
    ctx.strokeStyle = func.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = xMin; x <= xMax; x += 0.1) {
      const y = func.func(x);
      const canvasX = xToCanvas(x);
      const canvasY = yToCanvas(y);
      
      if (x === xMin) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

    // Draw input point
    if (inputValue >= xMin && inputValue <= xMax) {
      const outputValue = func.func(inputValue);
      const pointX = xToCanvas(inputValue);
      const pointY = yToCanvas(outputValue);
      
      // Draw vertical line from x-axis to point
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pointX, yToCanvas(0));
      ctx.lineTo(pointX, pointY);
      ctx.stroke();
      
      // Draw horizontal line from y-axis to point
      ctx.beginPath();
      ctx.moveTo(xToCanvas(0), pointY);
      ctx.lineTo(pointX, pointY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw the point
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(pointX, pointY, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw point outline
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw axis origin labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('0', xToCanvas(0) - 15, yToCanvas(0) + 20);

  }, [activeFunction, inputValue]);

  const handleFunctionChange = (functionName) => {
    setActiveFunction(functionName);
  };

  const handleInputChange = (delta) => {
    setInputValue(prev => Math.max(-6, Math.min(6, prev + delta)));
  };

  const currentFunc = activationFunctions[activeFunction];
  const currentOutput = currentFunc.func(inputValue);
  const currentDerivative = currentFunc.derivative(inputValue);

  return (
    <div className="section">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Activation Functions
      </motion.h2>
      
      <motion.p 
        className="section-subtitle"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Discover how different activation functions shape neural network behavior and learning
      </motion.p>

      <div className="demo-container">
        <div className="demo-controls">
          <div className="control-group">
            <label>Select Activation Function:</label>
            <div className="button-group">
              {Object.entries(activationFunctions).map(([key, func]) => (
                <button
                  key={key}
                  className={`control-btn ${activeFunction === key ? 'active' : ''}`}
                  onClick={() => handleFunctionChange(key)}
                  style={{
                    borderColor: activeFunction === key ? func.color : 'var(--border)',
                    backgroundColor: activeFunction === key ? func.color : 'var(--surface-light)'
                  }}
                >
                  {func.name}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Input Value: {inputValue.toFixed(2)}</label>
            <div className="button-group">
              <button 
                className="control-btn" 
                onClick={() => handleInputChange(-0.5)}
              >
                - 0.5
              </button>
              <button 
                className="control-btn" 
                onClick={() => handleInputChange(-0.1)}
              >
                - 0.1
              </button>
              <button 
                className="control-btn" 
                onClick={() => setInputValue(0)}
              >
                Reset
              </button>
              <button 
                className="control-btn" 
                onClick={() => handleInputChange(0.1)}
              >
                + 0.1
              </button>
              <button 
                className="control-btn" 
                onClick={() => handleInputChange(0.5)}
              >
                + 0.5
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
              className="activation-canvas"
            />
          </div>

          <div className="function-info">
            <motion.div
              key={activeFunction}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ color: currentFunc.color, marginBottom: '1rem' }}>
                {currentFunc.name} Function
              </h3>
              
              <div className="function-formula">
                <strong>Formula:</strong>
                <div style={{ 
                  fontFamily: 'monospace', 
                  background: 'var(--surface-light)', 
                  padding: '0.75rem', 
                  borderRadius: '6px',
                  margin: '0.5rem 0'
                }}>
                  {currentFunc.formula}
                </div>
              </div>

              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                {currentFunc.description}
              </p>

              <div className="function-values">
                <div className="value-row">
                  <span className="value-label">Input (x):</span>
                  <span className="value-number">{inputValue.toFixed(3)}</span>
                </div>
                <div className="value-row">
                  <span className="value-label">Output f(x):</span>
                  <span className="value-number" style={{ color: currentFunc.color }}>
                    {currentOutput.toFixed(3)}
                  </span>
                </div>
                <div className="value-row">
                  <span className="value-label">Derivative f'(x):</span>
                  <span className="value-number">{currentDerivative.toFixed(3)}</span>
                </div>
              </div>

              <div className="function-properties">
                <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>
                  Key Properties:
                </h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                  {activeFunction === 'sigmoid' && (
                    <>
                      <li>Output range: (0, 1)</li>
                      <li>S-shaped curve</li>
                      <li>Differentiable everywhere</li>
                      <li>Can suffer from vanishing gradients</li>
                    </>
                  )}
                  {activeFunction === 'relu' && (
                    <>
                      <li>Output range: [0, +∞)</li>
                      <li>Computationally efficient</li>
                      <li>Can suffer from "dying neurons"</li>
                      <li>Most popular in deep networks</li>
                    </>
                  )}
                  {activeFunction === 'tanh' && (
                    <>
                      <li>Output range: (-1, 1)</li>
                      <li>Zero-centered output</li>
                      <li>Stronger gradients than sigmoid</li>
                      <li>Still can have vanishing gradients</li>
                    </>
                  )}
                  {activeFunction === 'leakyRelu' && (
                    <>
                      <li>Output range: (-∞, +∞)</li>
                      <li>Solves dying ReLU problem</li>
                      <li>Small negative slope (α = 0.01)</li>
                      <li>Computationally efficient</li>
                    </>
                  )}
                  {activeFunction === 'elu' && (
                    <>
                      <li>Output range: (-α, +∞)</li>
                      <li>Smooth everywhere</li>
                      <li>Negative saturation</li>
                      <li>Robust to noise</li>
                    </>
                  )}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivationFunctions;