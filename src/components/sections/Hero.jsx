import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// 3D Neural Network Component
function NeuralNetwork3D() {
  const groupRef = useRef();
  
  // Create network nodes and connections
  const { nodes, connections } = useMemo(() => {
    const layers = [
      { count: 4, z: -2 },
      { count: 6, z: 0 },
      { count: 4, z: 2 },
      { count: 2, z: 4 }
    ];
    
    const nodes = [];
    const connections = [];
    
    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        const y = (i - (layer.count - 1) / 2) * 1.5;
        nodes.push({
          position: [0, y, layer.z],
          layerIndex,
          nodeIndex: i
        });
        
        // Create connections to next layer
        if (layerIndex < layers.length - 1) {
          const nextLayer = layers[layerIndex + 1];
          for (let j = 0; j < nextLayer.count; j++) {
            const nextY = (j - (nextLayer.count - 1) / 2) * 1.5;
            connections.push({
              start: [0, y, layer.z],
              end: [0, nextY, nextLayer.z]
            });
          }
        }
      }
    });
    
    return { nodes, connections };
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Render connections */}
      {connections.map((connection, index) => (
        <Line
          key={index}
          points={[connection.start, connection.end]}
          color="#2563eb"
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}
      
      {/* Render nodes */}
      {nodes.map((node, index) => (
        <Sphere
          key={index}
          position={node.position}
          args={[0.15, 16, 16]}
        >
          <meshStandardMaterial 
            color={node.layerIndex === 0 ? "#f59e0b" : 
                   node.layerIndex === nodes.length - 1 ? "#10b981" : "#2563eb"}
            emissive={node.layerIndex === 0 ? "#f59e0b" : 
                     node.layerIndex === nodes.length - 1 ? "#10b981" : "#2563eb"}
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Floating particles background
function Particles() {
  const count = 100;
  const mesh = useRef();
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp.set([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ], i * 3);
    }
    return temp;
  }, [count]);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Hero() {
  const scrollToNext = () => {
    document.getElementById('neurons').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hero">
      <div className="hero-bg">
        <Canvas camera={{ position: [8, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7c3aed" />
          
          <Particles />
          <NeuralNetwork3D />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
      
      <div className="hero-content">
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Master Deep Learning
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Explore neural networks through interactive 3D visualizations and hands-on demos
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <button onClick={scrollToNext} className="hero-cta">
            Start Your Journey
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;