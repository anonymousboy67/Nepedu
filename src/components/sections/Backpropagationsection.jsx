import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function BackpropagationSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef(null);

  const steps = [
    {
      title: "Forward Pass",
      description: "Input flows through network computing predictions",
      color: "#2563eb",
      formula: "z = Wx + b, a = σ(z)"
    },
    {
      title: "Loss Calculation", 
      description: "Compare prediction with target using loss function",
      color: "#f59e0b",
      formula: "L = ½(y - ŷ)²"
    },
    {
      title: "Backward Pass",
      description: "Calculate gradients using chain rule",
      color: "#ef4444", 
      formula: "∂L/∂W = ∂L/∂a × ∂a/∂z × ∂z/∂W"
    },
    {
      title: "Weight Update",
      description: "Adjust weights to minimize loss",
      color: "#10b981",
      formula: "W := W - α∇W"
    }
  ];

  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Network structure
    const layers = [2, 3, 1];
    const layerX = [100, 250, 400];
    const nodeRadius = 20;

    // Draw connections
    ctx.strokeStyle = currentStep >= 2 ? steps[2].color : '#94a3b8';
    ctx.lineWidth = currentStep >= 2 ? 3 : 1;
    
    for (let l = 0; l < layers.length - 1; l++) {
      for (let i = 0; i < layers[l]; i++) {
        for (let j = 0; j < layers[l + 1]; j++) {
          const x1 = layerX[l] + nodeRadius;
          const y1 = height/2 + (i - (layers[l]-1)/2) * 60;
          const x2 = layerX[l + 1] - nodeRadius;
          const y2 = height/2 + (j - (layers[l+1]-1)/2) * 60;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    layers.forEach((nodeCount, layerIndex) => {
      for (let i = 0; i < nodeCount; i++) {
        const x = layerX[layerIndex];
        const y = height/2 + (i - (nodeCount-1)/2) * 60;
        
        // Node color based on current step
        let nodeColor = '#e2e8f0';
        if (currentStep === 0 && layerIndex === 0) nodeColor = steps[0].color;
        if (currentStep === 1 && layerIndex === layers.length - 1) nodeColor = steps[1].color;
        if (currentStep === 2) nodeColor = steps[2].color;
        if (currentStep === 3) nodeColor = steps[3].color;
        
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Input', layerX[0], height - 20);
    ctx.fillText('Hidden', layerX[1], height - 20);
    ctx.fillText('Output', layerX[2], height - 20);
  };

  useEffect(() => {
    drawNetwork();
  }, [currentStep]);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = (prev + 1) % steps.length;
          if (next === 0) {
            setIsAnimating(false);
          }
          return next;
        });
      }, 1500);
      
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  return (
    <div className="section">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Backpropagation
      </motion.h2>
      
      <motion.p 
        className="section-subtitle"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        The algorithm that teaches neural networks by propagating errors backward
      </motion.p>

      <div className="demo-container">
        <div className="demo-controls">
          <div className="control-group">
            <div className="button-group">
              <button 
                className="control-btn primary" 
                onClick={() => setIsAnimating(!isAnimating)}
              >
                {isAnimating ? 'Stop Animation' : 'Start Animation'}
              </button>
              {steps.map((step, index) => (
                <button
                  key={index}
                  className={`control-btn ${currentStep === index ? 'active' : ''}`}
                  onClick={() => setCurrentStep(index)}
                  style={{
                    borderColor: currentStep === index ? step.color : 'var(--border)',
                    backgroundColor: currentStep === index ? step.color : 'var(--surface-light)'
                  }}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="visualization-container">
            <canvas 
              ref={canvasRef}
              width={500}
              height={300}
              className="backprop-canvas"
            />
          </div>

          <div className="step-info">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 style={{ color: steps[currentStep].color, marginBottom: '1rem' }}>
                {steps[currentStep].title}
              </h3>
              
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                {steps[currentStep].description}
              </p>

              <div className="formula-box">
                <strong style={{ color: 'var(--accent)' }}>Formula:</strong>
                <div style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '1.1rem',
                  background: 'var(--surface-light)', 
                  padding: '1rem', 
                  borderRadius: '6px',
                  margin: '0.5rem 0',
                  border: `2px solid ${steps[currentStep].color}`
                }}>
                  {steps[currentStep].formula}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Key Concepts */}
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
          Key Concepts
        </h3>
        
        <div className="grid grid-3">
          <div className="card">
            <h4 style={{ color: '#2563eb', marginBottom: '1rem' }}>
              Chain Rule
            </h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Mathematical foundation allowing us to compute gradients by 
              breaking down complex derivatives into simpler parts.
            </p>
          </div>
          
          <div className="card">
            <h4 style={{ color: '#10b981', marginBottom: '1rem' }}>
              Gradient Descent
            </h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Optimization algorithm that uses computed gradients to 
              update weights in the direction that minimizes loss.
            </p>
          </div>
          
          <div className="card">
            <h4 style={{ color: '#ef4444', marginBottom: '1rem' }}>
              Error Propagation
            </h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Process of sending error information backwards through 
              the network to update all weights appropriately.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default BackpropagationSection;