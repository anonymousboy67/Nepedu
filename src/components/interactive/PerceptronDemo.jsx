import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function PerceptronDemo() {
  const [inputs, setInputs] = useState([0.5, 0.3]);
  const [weights, setWeights] = useState([0.7, 0.4]);
  const [bias, setBias] = useState(0.2);
  const [output, setOutput] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef(null);

  // Sigmoid activation function
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));

  // Calculate output whenever inputs, weights, or bias change
  useEffect(() => {
    const sum = inputs[0] * weights[0] + inputs[1] * weights[1] + bias;
    const newOutput = sigmoid(sum);
    setOutput(newOutput);
  }, [inputs, weights, bias]);

  // Draw the perceptron visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw connections with animated thickness based on weight strength
    const drawConnection = (startX, startY, endX, endY, weight, isActive) => {
      const thickness = Math.abs(weight) * 8 + 2;
      const opacity = isActive ? 1 : 0.6;
      
      ctx.strokeStyle = weight > 0 ? `rgba(37, 99, 235, ${opacity})` : `rgba(239, 68, 68, ${opacity})`;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw weight value
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2 - 20;
      ctx.fillStyle = weight > 0 ? '#2563eb' : '#ef4444';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(weight.toFixed(2), midX, midY);
    };

    // Input neurons
    const input1Pos = { x: 100, y: 80 };
    const input2Pos = { x: 100, y: 160 };
    const mainNeuronPos = { x: 250, y: 120 };
    const outputPos = { x: 400, y: 120 };

    // Draw connections
    drawConnection(input1Pos.x + 25, input1Pos.y, mainNeuronPos.x - 25, mainNeuronPos.y, weights[0], isAnimating);
    drawConnection(input2Pos.x + 25, input2Pos.y, mainNeuronPos.x - 25, mainNeuronPos.y, weights[1], isAnimating);
    drawConnection(mainNeuronPos.x + 25, mainNeuronPos.y, outputPos.x - 25, outputPos.y, 1, isAnimating);

    // Draw neurons
    const drawNeuron = (x, y, value, label, color = '#2563eb') => {
      const intensity = Math.abs(value);
      const glowSize = isAnimating ? 60 + intensity * 20 : 50;
      
      // Glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
      gradient.addColorStop(0, `${color}40`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - glowSize, y - glowSize, glowSize * 2, glowSize * 2);
      
      // Neuron circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, 2 * Math.PI);
      ctx.fill();
      
      // Neuron border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
      
      // Value below neuron
      ctx.fillStyle = color;
      ctx.font = '12px Arial';
      ctx.fillText(value.toFixed(3), x, y + 45);
    };

    // Draw all neurons
    drawNeuron(input1Pos.x, input1Pos.y, inputs[0], 'I₁', '#f59e0b');
    drawNeuron(input2Pos.x, input2Pos.y, inputs[1], 'I₂', '#f59e0b');
    drawNeuron(mainNeuronPos.x, mainNeuronPos.y, inputs[0] * weights[0] + inputs[1] * weights[1] + bias, 'Σ', '#7c3aed');
    drawNeuron(outputPos.x, outputPos.y, output, 'O', '#10b981');

    // Draw bias
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Bias: ${bias.toFixed(2)}`, mainNeuronPos.x, mainNeuronPos.y - 50);

  }, [inputs, weights, bias, output, isAnimating]);

  const updateValue = (setter, index, delta) => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    
    if (index !== undefined) {
      setter(prev => {
        const newArray = [...prev];
        newArray[index] = Math.max(-2, Math.min(2, newArray[index] + delta));
        return newArray;
      });
    } else {
      setter(prev => Math.max(-2, Math.min(2, prev + delta)));
    }
  };

  const randomizeValues = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    
    setInputs([
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ]);
    setWeights([
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ]);
    setBias(Math.random() * 2 - 1);
  };

  return (
    <div className="demo-container">
      <motion.h3 
        className="demo-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Interactive Perceptron
      </motion.h3>
      
      <motion.p 
        className="demo-description"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Experiment with a single neuron and see how it processes inputs to make decisions. 
        Adjust the inputs, weights, and bias to understand how they affect the output.
      </motion.p>

      <div className="demo-controls">
        <div className="control-group">
          <label>Inputs</label>
          <div className="button-group">
            <button onClick={() => updateValue(setInputs, 0, -0.1)} className="control-btn">I₁ -</button>
            <span className="value-display">{inputs[0].toFixed(2)}</span>
            <button onClick={() => updateValue(setInputs, 0, 0.1)} className="control-btn">I₁ +</button>
          </div>
          <div className="button-group">
            <button onClick={() => updateValue(setInputs, 1, -0.1)} className="control-btn">I₂ -</button>
            <span className="value-display">{inputs[1].toFixed(2)}</span>
            <button onClick={() => updateValue(setInputs, 1, 0.1)} className="control-btn">I₂ +</button>
          </div>
        </div>

        <div className="control-group">
          <label>Weights</label>
          <div className="button-group">
            <button onClick={() => updateValue(setWeights, 0, -0.1)} className="control-btn">W₁ -</button>
            <span className="value-display">{weights[0].toFixed(2)}</span>
            <button onClick={() => updateValue(setWeights, 0, 0.1)} className="control-btn">W₁ +</button>
          </div>
          <div className="button-group">
            <button onClick={() => updateValue(setWeights, 1, -0.1)} className="control-btn">W₂ -</button>
            <span className="value-display">{weights[1].toFixed(2)}</span>
            <button onClick={() => updateValue(setWeights, 1, 0.1)} className="control-btn">W₂ +</button>
          </div>
        </div>

        <div className="control-group">
          <label>Bias</label>
          <div className="button-group">
            <button onClick={() => updateValue(setBias, undefined, -0.1)} className="control-btn">B -</button>
            <span className="value-display">{bias.toFixed(2)}</span>
            <button onClick={() => updateValue(setBias, undefined, 0.1)} className="control-btn">B +</button>
          </div>
        </div>

        <button onClick={randomizeValues} className="demo-button randomize-btn">
          Randomize All Values
        </button>
      </div>

      <div className="visualization-container">
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={240}
          className="perceptron-canvas"
        />
      </div>

      <motion.div 
        className="output-display"
        animate={{ scale: isAnimating ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="output-value">
          <span className="output-label">Output:</span>
          <span className="output-number">{output.toFixed(4)}</span>
        </div>
        <div className="computation-formula">
          <span>σ({inputs[0].toFixed(2)} × {weights[0].toFixed(2)} + {inputs[1].toFixed(2)} × {weights[1].toFixed(2)} + {bias.toFixed(2)}) = {output.toFixed(4)}</span>
        </div>
      </motion.div>
    </div>
  );
}

export default PerceptronDemo;