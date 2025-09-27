import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function NeuronStructure() {
  const [inputs, setInputs] = useState([0.8, 0.4, 0.7]);
  const [weights, setWeights] = useState([0.5, -0.2, 0.9]);
  const [bias, setBias] = useState(0.1);
  const [selectedActivation, setSelectedActivation] = useState('sigmoid');
  const canvasRef = useRef(null);

  const activations = {
    sigmoid: {
      name: 'Sigmoid',
      func: (x) => 1 / (1 + Math.exp(-x)),
      color: '#2563eb'
    },
    relu: {
      name: 'ReLU',
      func: (x) => Math.max(0, x),
      color: '#10b981'
    },
    tanh: {
      name: 'Tanh',
      func: (x) => Math.tanh(x),
      color: '#7c3aed'
    }
  };

  const drawNeuron = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const neuronX = width * 0.6;
    const neuronY = height / 2;
    const neuronRadius = 40;
    const inputX = 100;

    // Calculate weighted sum and output
    const weightedSum = inputs.reduce((sum, input, i) => sum + input * weights[i], 0) + bias;
    const output = activations[selectedActivation].func(weightedSum);

    // Draw input connections
    inputs.forEach((input, i) => {
      const inputY = height / 2 + (i - 1) * 80;
      
      // Input node
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(inputX, inputY, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Input value
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(input.toFixed(1), inputX, inputY + 4);

      // Connection line
      const lineWidth = Math.abs(weights[i]) * 8 + 1;
      ctx.strokeStyle = weights[i] >= 0 ? '#10b981' : '#ef4444';
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(inputX + 20, inputY);
      ctx.lineTo(neuronX - neuronRadius, neuronY);
      ctx.stroke();

      // Weight label
      ctx.fillStyle = weights[i] >= 0 ? '#10b981' : '#ef4444';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      const midX = (inputX + neuronX) / 2;
      const midY = (inputY + neuronY) / 2;
      ctx.fillText(`w${i+1}=${weights[i].toFixed(1)}`, midX, midY - 10);

      // Input label
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`x${i+1}`, inputX - 35, inputY + 4);
    });

    // Draw neuron
    ctx.fillStyle = activations[selectedActivation].color;
    ctx.beginPath();
    ctx.arc(neuronX, neuronY, neuronRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Neuron content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Σ', neuronX, neuronY - 5);
    ctx.font = '10px Arial';
    ctx.fillText(selectedActivation.charAt(0).toUpperCase() + selectedActivation.slice(1), neuronX, neuronY + 15);

    // Bias
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(neuronX, neuronY - neuronRadius - 30, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('b', neuronX, neuronY - neuronRadius - 26);

    // Bias connection
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(neuronX, neuronY - neuronRadius - 15);
    ctx.lineTo(neuronX, neuronY - neuronRadius);
    ctx.stroke();

    // Bias value
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px Arial';
    ctx.fillText(`b=${bias.toFixed(1)}`, neuronX + 25, neuronY - neuronRadius - 25);

    // Output
    const outputX = neuronX + 100;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(outputX, neuronY, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Output value
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(output.toFixed(2), outputX, neuronY + 4);

    // Output connection
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(neuronX + neuronRadius, neuronY);
    ctx.lineTo(outputX - 20, neuronY);
    ctx.stroke();

    // Output label
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.fillText('Output', outputX, neuronY + 35);

    // Mathematical equation
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    const equationY = height - 40;
    ctx.fillText(`z = Σ(w × x) + b = ${weightedSum.toFixed(2)}`, 50, equationY);
    ctx.fillText(`y = ${selectedActivation}(z) = ${output.toFixed(2)}`, 50, equationY + 20);
  };

  useEffect(() => {
    drawNeuron();
  }, [inputs, weights, bias, selectedActivation]);

  const updateInput = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = parseFloat(value);
    setInputs(newInputs);
  };

  const updateWeight = (index, value) => {
    const newWeights = [...weights];
    newWeights[index] = parseFloat(value);
    setWeights(newWeights);
  };

  const weightedSum = inputs.reduce((sum, input, i) => sum + input * weights[i], 0) + bias;
  const output = activations[selectedActivation].func(weightedSum);

  return (
    <div className="section">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Neuron Structure
      </motion.h2>
      
      <motion.p 
        className="section-subtitle"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        The building block of neural networks: inputs, weights, bias, and activation
      </motion.p>

      <div className="demo-container">
        <div className="demo-controls">
          <div className="control-group">
            <label>Activation Function:</label>
            <div className="button-group">
              {Object.entries(activations).map(([key, activation]) => (
                <button
                  key={key}
                  className={`control-btn ${selectedActivation === key ? 'active' : ''}`}
                  onClick={() => setSelectedActivation(key)}
                  style={{
                    borderColor: selectedActivation === key ? activation.color : 'var(--border)',
                    backgroundColor: selectedActivation === key ? activation.color : 'var(--surface-light)'
                  }}
                >
                  {activation.name}
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
              height={400}
              className="neuron-canvas"
            />
          </div>

          <div className="controls-panel">
            <h4 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
              Interactive Controls
            </h4>
            
            <div className="input-controls">
              <h5 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Inputs</h5>
              {inputs.map((input, index) => (
                <div key={index} className="control-item">
                  <label>x{index + 1}: {input.toFixed(2)}</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={input}
                    onChange={(e) => updateInput(index, e.target.value)}
                    className="slider"
                  />
                </div>
              ))}
            </div>

            <div className="weight-controls">
              <h5 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Weights</h5>
              {weights.map((weight, index) => (
                <div key={index} className="control-item">
                  <label>w{index + 1}: {weight.toFixed(2)}</label>
                  <input 
                    type="range" 
                    min="-1" 
                    max="1" 
                    step="0.1" 
                    value={weight}
                    onChange={(e) => updateWeight(index, e.target.value)}
                    className="slider"
                  />
                </div>
              ))}
            </div>

            <div className="bias-control">
              <h5 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Bias</h5>
              <div className="control-item">
                <label>b: {bias.toFixed(2)}</label>
                <input 
                  type="range" 
                  min="-1" 
                  max="1" 
                  step="0.1" 
                  value={bias}
                  onChange={(e) => setBias(parseFloat(e.target.value))}
                  className="slider"
                />
              </div>
            </div>

            <div className="output-display">
              <h5 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Output</h5>
              <div className="output-stats">
                <div className="stat-row">
                  <span>Weighted Sum (z):</span>
                  <span className="stat-value">{weightedSum.toFixed(3)}</span>
                </div>
                <div className="stat-row">
                  <span>Final Output (y):</span>
                  <span className="stat-value" style={{ color: activations[selectedActivation].color }}>
                    {output.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Components Explanation */}
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
          Neuron Components
        </h3>
        
        <div className="grid grid-2">
          <div className="info-card">
            <h4 style={{ color: '#2563eb', marginBottom: '1rem' }}>
              🔢 Inputs & Weights
            </h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
              Each input is multiplied by its corresponding weight. Positive weights 
              strengthen the signal, negative weights inhibit it.
            </p>
            <div style={{ 
              background: 'var(--surface-light)', 
              padding: '0.75rem', 
              borderRadius: '6px',
              fontFamily: 'monospace'
            }}>
              Weighted Sum = x₁w₁ + x₂w₂ + x₃w₃
            </div>
          </div>
          
          <div className="info-card">
            <h4 style={{ color: '#f59e0b', marginBottom: '1rem' }}>
              ⚖️ Bias
            </h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
              The bias shifts the activation function, allowing the neuron to activate 
              even when all inputs are zero.
            </p>
            <div style={{ 
              background: 'var(--surface-light)', 
              padding: '0.75rem', 
              borderRadius: '6px',
              fontFamily: 'monospace'
            }}>
              z = Weighted Sum + bias
            </div>
          </div>
          
          <div className="info-card">
            <h4 style={{ color: '#10b981', marginBottom: '1rem' }}>
              📈 Activation Function
            </h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
              Applies non-linearity to the weighted sum, determining the final output 
              and enabling complex pattern learning.
            </p>
            <div style={{ 
              background: 'var(--surface-light)', 
              padding: '0.75rem', 
              borderRadius: '6px',
              fontFamily: 'monospace'
            }}>
              y = activation(z)
            </div>
          </div>
          
          <div className="info-card">
            <h4 style={{ color: '#7c3aed', marginBottom: '1rem' }}>
              🎯 Learning Process
            </h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
              During training, weights and bias are adjusted based on prediction errors 
              to improve the neuron's performance.
            </p>
            <div style={{ 
              background: 'var(--surface-light)', 
              padding: '0.75rem', 
              borderRadius: '6px',
              fontFamily: 'monospace'
            }}>
              w := w - α∇w
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default NeuronStructure;