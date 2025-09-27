import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

function GradientDescentVisualizer() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPoint, setCurrentPoint] = useState({ x: -2, y: 0 });
  const [learningRate, setLearningRate] = useState(0.1);
  const [selectedFunction, setSelectedFunction] = useState('quadratic');
  const [optimizerType, setOptimizerType] = useState('sgd');
  const [iteration, setIteration] = useState(0);
  const [pathHistory, setPathHistory] = useState([]);
  const [convergenceValue, setConvergenceValue] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Different loss functions to visualize
  const lossFunctions = {
    quadratic: {
      name: 'Quadratic Bowl',
      func: (x, y) => x * x + y * y,
      gradientX: (x, y) => 2 * x,
      gradientY: (x, y) => 2 * y,
      minimum: { x: 0, y: 0, value: 0 },
      description: 'Simple convex function with global minimum at origin'
    },
    rosenbrock: {
      name: 'Rosenbrock Function',
      func: (x, y) => 100 * Math.pow(y - x * x, 2) + Math.pow(1 - x, 2),
      gradientX: (x, y) => -400 * x * (y - x * x) - 2 * (1 - x),
      gradientY: (x, y) => 200 * (y - x * x),
      minimum: { x: 1, y: 1, value: 0 },
      description: 'Challenging banana-shaped valley, tests optimizer robustness'
    },
    himmelblau: {
      name: 'Himmelblau Function',
      func: (x, y) => Math.pow(x * x + y - 11, 2) + Math.pow(x + y * y - 7, 2),
      gradientX: (x, y) => 4 * x * (x * x + y - 11) + 2 * (x + y * y - 7),
      gradientY: (x, y) => 2 * (x * x + y - 11) + 4 * y * (x + y * y - 7),
      minimum: { x: 3, y: 2, value: 0 },
      description: 'Multi-modal function with four global minima'
    },
    beale: {
      name: 'Beale Function',
      func: (x, y) => Math.pow(1.5 - x + x * y, 2) + Math.pow(2.25 - x + x * y * y, 2) + Math.pow(2.625 - x + x * y * y * y, 2),
      gradientX: (x, y) => {
        const term1 = 2 * (1.5 - x + x * y) * (-1 + y);
        const term2 = 2 * (2.25 - x + x * y * y) * (-1 + y * y);
        const term3 = 2 * (2.625 - x + x * y * y * y) * (-1 + y * y * y);
        return term1 + term2 + term3;
      },
      gradientY: (x, y) => {
        const term1 = 2 * (1.5 - x + x * y) * x;
        const term2 = 2 * (2.25 - x + x * y * y) * 2 * x * y;
        const term3 = 2 * (2.625 - x + x * y * y * y) * 3 * x * y * y;
        return term1 + term2 + term3;
      },
      minimum: { x: 3, y: 0.5, value: 0 },
      description: 'Narrow valley leading to global minimum'
    }
  };

  // Optimizer algorithms
  const optimizers = {
    sgd: {
      name: 'SGD',
      description: 'Standard Gradient Descent',
      color: '#2563eb',
      state: {},
      update: (point, gradient, lr, state) => ({
        x: point.x - lr * gradient.x,
        y: point.y - lr * gradient.y
      })
    },
    momentum: {
      name: 'Momentum',
      description: 'SGD with Momentum (β=0.9)',
      color: '#10b981',
      state: { vx: 0, vy: 0 },
      update: (point, gradient, lr, state) => {
        const beta = 0.9;
        state.vx = beta * (state.vx || 0) + lr * gradient.x;
        state.vy = beta * (state.vy || 0) + lr * gradient.y;
        return {
          x: point.x - state.vx,
          y: point.y - state.vy
        };
      }
    },
    rmsprop: {
      name: 'RMSprop',
      description: 'RMSprop (α=0.9, ε=1e-8)',
      color: '#7c3aed',
      state: { sx: 0, sy: 0 },
      update: (point, gradient, lr, state) => {
        const alpha = 0.9;
        const epsilon = 1e-8;
        state.sx = alpha * (state.sx || 0) + (1 - alpha) * gradient.x * gradient.x;
        state.sy = alpha * (state.sy || 0) + (1 - alpha) * gradient.y * gradient.y;
        return {
          x: point.x - lr * gradient.x / (Math.sqrt(state.sx) + epsilon),
          y: point.y - lr * gradient.y / (Math.sqrt(state.sy) + epsilon)
        };
      }
    },
    adam: {
      name: 'Adam',
      description: 'Adam Optimizer (β1=0.9, β2=0.999)',
      color: '#ef4444',
      state: { mx: 0, my: 0, vx: 0, vy: 0, t: 0 },
      update: (point, gradient, lr, state) => {
        const beta1 = 0.9;
        const beta2 = 0.999;
        const epsilon = 1e-8;
        
        state.t = (state.t || 0) + 1;
        state.mx = beta1 * (state.mx || 0) + (1 - beta1) * gradient.x;
        state.my = beta1 * (state.my || 0) + (1 - beta1) * gradient.y;
        state.vx = beta2 * (state.vx || 0) + (1 - beta2) * gradient.x * gradient.x;
        state.vy = beta2 * (state.vy || 0) + (1 - beta2) * gradient.y * gradient.y;
        
        const mxHat = state.mx / (1 - Math.pow(beta1, state.t));
        const myHat = state.my / (1 - Math.pow(beta1, state.t));
        const vxHat = state.vx / (1 - Math.pow(beta2, state.t));
        const vyHat = state.vy / (1 - Math.pow(beta2, state.t));
        
        return {
          x: point.x - lr * mxHat / (Math.sqrt(vxHat) + epsilon),
          y: point.y - lr * myHat / (Math.sqrt(vyHat) + epsilon)
        };
      }
    }
  };

  // Draw the loss function landscape and optimization path
  const drawVisualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Set up coordinate system
    const xMin = -3, xMax = 3;
    const yMin = -3, yMax = 3;
    const resolution = 0.1;

    const xToCanvas = (x) => ((x - xMin) / (xMax - xMin)) * width;
    const yToCanvas = (y) => height - ((y - yMin) / (yMax - yMin)) * height;

    const func = lossFunctions[selectedFunction];

    // Draw contour lines
    const contourLevels = [0.1, 0.5, 1, 2, 5, 10, 20, 50, 100];
    
    contourLevels.forEach((level, index) => {
      ctx.strokeStyle = `rgba(100, 116, 139, ${0.3 - index * 0.02})`;
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let x = xMin; x < xMax; x += resolution) {
        for (let y = yMin; y < yMax; y += resolution) {
          const z = func.func(x, y);
          if (Math.abs(z - level) < 0.5) {
            ctx.moveTo(xToCanvas(x), yToCanvas(y));
            ctx.arc(xToCanvas(x), yToCanvas(y), 1, 0, 2 * Math.PI);
          }
        }
      }
      ctx.stroke();
    });

    // Draw global minimum
    const min = func.minimum;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(xToCanvas(min.x), yToCanvas(min.y), 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw optimization path
    if (pathHistory.length > 1) {
      ctx.strokeStyle = optimizers[optimizerType].color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      pathHistory.forEach((point, index) => {
        const canvasX = xToCanvas(point.x);
        const canvasY = yToCanvas(point.y);
        
        if (index === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      });
      ctx.stroke();

      // Draw path points
      pathHistory.forEach((point, index) => {
        const canvasX = xToCanvas(point.x);
        const canvasY = yToCanvas(point.y);
        
        ctx.fillStyle = index === pathHistory.length - 1 ? optimizers[optimizerType].color : 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, index === pathHistory.length - 1 ? 6 : 3, 0, 2 * Math.PI);
        ctx.fill();
        
        if (index === pathHistory.length - 1) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }

    // Draw current point
    const canvasX = xToCanvas(currentPoint.x);
    const canvasY = yToCanvas(currentPoint.y);
    
    ctx.fillStyle = optimizers[optimizerType].color;
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw gradient vector
    const func_current = lossFunctions[selectedFunction];
    const gradX = func_current.gradientX(currentPoint.x, currentPoint.y);
    const gradY = func_current.gradientY(currentPoint.x, currentPoint.y);
    
    const gradientScale = 0.1;
    const endX = xToCanvas(currentPoint.x - gradX * gradientScale);
    const endY = yToCanvas(currentPoint.y - gradY * gradientScale);
    
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvasX, canvasY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Arrow head
    const angle = Math.atan2(endY - canvasY, endX - canvasX);
    const arrowLength = 10;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle - Math.PI / 6),
      endY - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle + Math.PI / 6),
      endY - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Draw axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xToCanvas(0), 0);
    ctx.lineTo(xToCanvas(0), height);
    ctx.moveTo(0, yToCanvas(0));
    ctx.lineTo(width, yToCanvas(0));
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('X', width - 20, yToCanvas(0) + 20);
    ctx.fillText('Y', xToCanvas(0) + 20, 20);

  }, [currentPoint, pathHistory, selectedFunction, optimizerType]);

  // Animation loop
  const animateStep = useCallback(() => {
    if (!isAnimating) return;

    const func = lossFunctions[selectedFunction];
    const optimizer = optimizers[optimizerType];
    
    // Calculate gradient
    const gradX = func.gradientX(currentPoint.x, currentPoint.y);
    const gradY = func.gradientY(currentPoint.x, currentPoint.y);
    
    // Update point using selected optimizer
    const newPoint = optimizer.update(
      currentPoint, 
      { x: gradX, y: gradY }, 
      learningRate,
      optimizer.state
    );
    
    // Check for convergence
    const currentLoss = func.func(currentPoint.x, currentPoint.y);
    if (currentLoss < 0.001 || iteration > 1000) {
      setIsAnimating(false);
      setConvergenceValue(currentLoss);
      return;
    }
    
    setCurrentPoint(newPoint);
    setPathHistory(prev => [...prev, newPoint]);
    setIteration(prev => prev + 1);
    
    animationRef.current = setTimeout(animateStep, 100);
  }, [isAnimating, currentPoint, selectedFunction, optimizerType, learningRate, iteration]);

  useEffect(() => {
    if (isAnimating) {
      animateStep();
    }
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating, animateStep]);

  useEffect(() => {
    drawVisualization();
  }, [drawVisualization]);

  const startOptimization = () => {
    // Reset optimizer state
    Object.values(optimizers).forEach(opt => {
      opt.state = JSON.parse(JSON.stringify(opt.state));
    });
    
    setIsAnimating(true);
    setIteration(0);
    setPathHistory([currentPoint]);
    setConvergenceValue(null);
  };

  const resetVisualization = () => {
    setIsAnimating(false);
    setCurrentPoint({ x: -2, y: 0 });
    setIteration(0);
    setPathHistory([]);
    setConvergenceValue(null);
    
    // Reset optimizer states
    Object.values(optimizers).forEach(opt => {
      if (opt.name === 'SGD') opt.state = {};
      else if (opt.name === 'Momentum') opt.state = { vx: 0, vy: 0 };
      else if (opt.name === 'RMSprop') opt.state = { sx: 0, sy: 0 };
      else if (opt.name === 'Adam') opt.state = { mx: 0, my: 0, vx: 0, vy: 0, t: 0 };
    });
  };

  const handleCanvasClick = (event) => {
    if (isAnimating) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert canvas coordinates to function coordinates
    const xMin = -3, xMax = 3;
    const yMin = -3, yMax = 3;
    
    const funcX = xMin + (x / canvas.width) * (xMax - xMin);
    const funcY = yMax - (y / canvas.height) * (yMax - yMin);
    
    setCurrentPoint({ x: funcX, y: funcY });
    setPathHistory([]);
    setIteration(0);
    setConvergenceValue(null);
  };

  const currentLoss = lossFunctions[selectedFunction].func(currentPoint.x, currentPoint.y);
  const currentGradient = {
    x: lossFunctions[selectedFunction].gradientX(currentPoint.x, currentPoint.y),
    y: lossFunctions[selectedFunction].gradientY(currentPoint.x, currentPoint.y)
  };
  const gradientMagnitude = Math.sqrt(currentGradient.x ** 2 + currentGradient.y ** 2);

  return (
    <div className="demo-container">
      <motion.h3 
        className="demo-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Interactive Gradient Descent Visualizer
      </motion.h3>
      
      <motion.p 
        className="demo-description"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Watch different optimizers navigate loss landscapes in real-time. Click to set starting position.
      </motion.p>

      <div className="demo-controls">
        <div className="control-group">
          <label>Loss Function:</label>
          <div className="button-group">
            {Object.entries(lossFunctions).map(([key, func]) => (
              <button
                key={key}
                className={`control-btn ${selectedFunction === key ? 'active' : ''}`}
                onClick={() => {
                  setSelectedFunction(key);
                  resetVisualization();
                }}
                disabled={isAnimating}
              >
                {func.name}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Optimizer:</label>
          <div className="button-group">
            {Object.entries(optimizers).map(([key, opt]) => (
              <button
                key={key}
                className={`control-btn ${optimizerType === key ? 'active' : ''}`}
                onClick={() => setOptimizerType(key)}
                disabled={isAnimating}
                style={{
                  borderColor: optimizerType === key ? opt.color : 'var(--border)',
                  backgroundColor: optimizerType === key ? opt.color : 'var(--surface-light)'
                }}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Learning Rate: {learningRate}</label>
          <div className="button-group">
            <button 
              className="control-btn" 
              onClick={() => setLearningRate(0.01)}
              disabled={isAnimating}
            >
              0.01
            </button>
            <button 
              className="control-btn" 
              onClick={() => setLearningRate(0.1)}
              disabled={isAnimating}
            >
              0.1
            </button>
            <button 
              className="control-btn" 
              onClick={() => setLearningRate(0.3)}
              disabled={isAnimating}
            >
              0.3
            </button>
          </div>
        </div>

        <div className="control-group">
          <div className="button-group">
            <button 
              className="control-btn primary" 
              onClick={startOptimization}
              disabled={isAnimating}
            >
              {isAnimating ? 'Optimizing...' : 'Start Optimization'}
            </button>
            <button 
              className="control-btn" 
              onClick={resetVisualization}
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
            height={500}
            className="gradient-canvas"
            onClick={handleCanvasClick}
            style={{ cursor: isAnimating ? 'default' : 'pointer' }}
          />
          <div className="canvas-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
              <span>Global Minimum</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: optimizers[optimizerType].color }}></div>
              <span>Current Position</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
              <span>Gradient Vector</span>
            </div>
          </div>
        </div>

        <div className="info-panel">
          <div className="optimizer-info">
            <h4 style={{ color: optimizers[optimizerType].color }}>
              {optimizers[optimizerType].name}
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              {optimizers[optimizerType].description}
            </p>
          </div>

          <div className="function-info">
            <h4 style={{ color: 'var(--primary)' }}>
              {lossFunctions[selectedFunction].name}
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              {lossFunctions[selectedFunction].description}
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Iteration:</span>
              <span className="stat-value">{iteration}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Position:</span>
              <span className="stat-value">
                ({currentPoint.x.toFixed(3)}, {currentPoint.y.toFixed(3)})
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Loss:</span>
              <span className="stat-value">{currentLoss.toFixed(6)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Gradient Magnitude:</span>
              <span className="stat-value">{gradientMagnitude.toFixed(6)}</span>
            </div>
          </div>

          {convergenceValue !== null && (
            <div className="convergence-info">
              <h4 style={{ color: '#10b981' }}>Converged!</h4>
              <p>Final loss: {convergenceValue.toFixed(6)}</p>
              <p>Iterations: {iteration}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GradientDescentVisualizer;