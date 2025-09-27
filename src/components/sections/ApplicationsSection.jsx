import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function ApplicationsSection() {
  const [selectedDomain, setSelectedDomain] = useState('computer-vision');
  const [hoveredApp, setHoveredApp] = useState(null);
  const canvasRef = useRef(null);

  const domains = {
    'computer-vision': {
      name: 'Computer Vision',
      description: 'Teaching machines to see and understand visual content',
      color: '#2563eb',
      icon: '👁️',
      applications: [
        {
          name: 'Image Classification',
          description: 'Identifying objects, animals, or scenes in images',
          examples: ['Medical diagnosis from X-rays', 'Quality control in manufacturing', 'Content moderation'],
          accuracy: '95%+',
          difficulty: 'Beginner',
          datasets: ['ImageNet', 'CIFAR-10', 'Fashion-MNIST'],
          architectures: ['CNN', 'ResNet', 'EfficientNet']
        },
        {
          name: 'Object Detection',
          description: 'Finding and localizing multiple objects within images',
          examples: ['Autonomous vehicles', 'Security surveillance', 'Retail analytics'],
          accuracy: '90%+',
          difficulty: 'Intermediate',
          datasets: ['COCO', 'Pascal VOC', 'Open Images'],
          architectures: ['YOLO', 'R-CNN', 'SSD']
        },
        {
          name: 'Facial Recognition',
          description: 'Identifying and verifying individuals from facial features',
          examples: ['Phone unlocking', 'Airport security', 'Photo tagging'],
          accuracy: '99%+',
          difficulty: 'Advanced',
          datasets: ['LFW', 'CelebA', 'MS-Celeb-1M'],
          architectures: ['FaceNet', 'DeepFace', 'ArcFace']
        }
      ]
    },
    'nlp': {
      name: 'Natural Language Processing',
      description: 'Understanding and generating human language',
      color: '#10b981',
      icon: '💬',
      applications: [
        {
          name: 'Sentiment Analysis',
          description: 'Determining emotional tone and opinion from text',
          examples: ['Social media monitoring', 'Customer feedback analysis', 'Market research'],
          accuracy: '85%+',
          difficulty: 'Beginner',
          datasets: ['IMDB Reviews', 'Stanford Sentiment', 'Twitter Sentiment'],
          architectures: ['LSTM', 'BERT', 'RoBERTa']
        },
        {
          name: 'Machine Translation',
          description: 'Converting text from one language to another',
          examples: ['Google Translate', 'Document translation', 'Real-time conversation'],
          accuracy: '90%+',
          difficulty: 'Advanced',
          datasets: ['WMT', 'OPUS', 'UN Parallel Corpus'],
          architectures: ['Transformer', 'T5', 'mBART']
        },
        {
          name: 'Question Answering',
          description: 'Providing accurate answers to natural language questions',
          examples: ['Virtual assistants', 'Search engines', 'Customer support bots'],
          accuracy: '88%+',
          difficulty: 'Advanced',
          datasets: ['SQuAD', 'Natural Questions', 'MS MARCO'],
          architectures: ['BERT', 'RoBERTa', 'DeBERTa']
        }
      ]
    },
    'healthcare': {
      name: 'Healthcare & Medicine',
      description: 'AI-powered solutions for medical diagnosis and treatment',
      color: '#ef4444',
      icon: '🏥',
      applications: [
        {
          name: 'Medical Imaging',
          description: 'Analyzing medical scans for diagnosis and treatment planning',
          examples: ['Cancer detection in mammograms', 'Brain tumor identification', 'Bone fracture detection'],
          accuracy: '94%+',
          difficulty: 'Advanced',
          datasets: ['MIMIC-CXR', 'ChestX-ray14', 'ISIC Skin Cancer'],
          architectures: ['U-Net', 'ResNet', 'DenseNet']
        },
        {
          name: 'Drug Discovery',
          description: 'Accelerating the development of new pharmaceutical compounds',
          examples: ['Molecular property prediction', 'Protein folding', 'Drug-target interaction'],
          accuracy: '85%+',
          difficulty: 'Expert',
          datasets: ['ChEMBL', 'PubChem', 'Protein Data Bank'],
          architectures: ['Graph Neural Networks', 'Transformer', 'CNN']
        },
        {
          name: 'Personalized Medicine',
          description: 'Tailoring treatment plans based on individual patient data',
          examples: ['Genomic analysis', 'Treatment response prediction', 'Risk assessment'],
          accuracy: '80%+',
          difficulty: 'Expert',
          datasets: ['UK Biobank', 'TCGA', 'All of Us'],
          architectures: ['Multi-modal Networks', 'Ensemble Methods', 'Deep Learning']
        }
      ]
    },
    'autonomous': {
      name: 'Autonomous Systems',
      description: 'Self-driving vehicles and robotic automation',
      color: '#7c3aed',
      icon: '🚗',
      applications: [
        {
          name: 'Self-Driving Cars',
          description: 'Fully autonomous vehicles that can navigate without human input',
          examples: ['Tesla Autopilot', 'Waymo', 'Cruise autonomous taxis'],
          accuracy: '99.9%+',
          difficulty: 'Expert',
          datasets: ['KITTI', 'Cityscapes', 'nuScenes'],
          architectures: ['Multi-sensor Fusion', 'LIDAR CNN', 'Transformer']
        },
        {
          name: 'Drone Navigation',
          description: 'Autonomous flight control and obstacle avoidance for UAVs',
          examples: ['Package delivery', 'Search and rescue', 'Agricultural monitoring'],
          accuracy: '95%+',
          difficulty: 'Advanced',
          datasets: ['AirSim', 'Mid-Air', 'Forest Trail'],
          architectures: ['LSTM', 'CNN', 'Reinforcement Learning']
        },
        {
          name: 'Robotic Control',
          description: 'Intelligent control systems for industrial and service robots',
          examples: ['Manufacturing automation', 'Surgical robots', 'Household assistants'],
          accuracy: '92%+',
          difficulty: 'Advanced',
          datasets: ['RoboNet', 'MT-Opt', 'Something-Something'],
          architectures: ['Policy Networks', 'Actor-Critic', 'Imitation Learning']
        }
      ]
    },
    'finance': {
      name: 'Finance & Trading',
      description: 'AI applications in financial markets and risk management',
      color: '#f59e0b',
      icon: '💰',
      applications: [
        {
          name: 'Algorithmic Trading',
          description: 'Automated trading strategies based on market data analysis',
          examples: ['High-frequency trading', 'Portfolio optimization', 'Risk management'],
          accuracy: '75%+',
          difficulty: 'Expert',
          datasets: ['NYSE TAQ', 'NASDAQ', 'Alternative Data'],
          architectures: ['LSTM', 'Transformer', 'Reinforcement Learning']
        },
        {
          name: 'Fraud Detection',
          description: 'Identifying suspicious transactions and preventing financial fraud',
          examples: ['Credit card fraud', 'Money laundering detection', 'Insurance claims'],
          accuracy: '97%+',
          difficulty: 'Intermediate',
          datasets: ['Credit Card Fraud', 'PaySim', 'IEEE Fraud Detection'],
          architectures: ['Random Forest', 'XGBoost', 'Neural Networks']
        },
        {
          name: 'Credit Scoring',
          description: 'Assessing creditworthiness and default risk for loan applications',
          examples: ['Personal loans', 'Mortgage approval', 'Business credit'],
          accuracy: '85%+',
          difficulty: 'Intermediate',
          datasets: ['Home Credit', 'LendingClub', 'German Credit'],
          architectures: ['Gradient Boosting', 'Neural Networks', 'Ensemble Methods']
        }
      ]
    }
  };

  const industryStats = [
    { domain: 'Healthcare', investment: '$29.1B', growth: '+48%', jobs: '2.3M' },
    { domain: 'Finance', investment: '$22.6B', growth: '+35%', jobs: '1.8M' },
    { domain: 'Automotive', investment: '$16.8B', growth: '+52%', jobs: '1.5M' },
    { domain: 'Technology', investment: '$45.2B', growth: '+41%', jobs: '3.7M' }
  ];

  const successStories = [
    {
      company: 'DeepMind',
      achievement: 'AlphaFold protein structure prediction',
      impact: 'Accelerated drug discovery by decades',
      domain: 'Healthcare',
      year: '2020'
    },
    {
      company: 'Tesla',
      achievement: 'Full Self-Driving (FSD) capability',
      impact: 'Over 3 billion miles driven autonomously',
      domain: 'Autonomous',
      year: '2023'
    },
    {
      company: 'OpenAI',
      achievement: 'GPT models for language understanding',
      impact: 'Revolutionized natural language processing',
      domain: 'NLP',
      year: '2022'
    },
    {
      company: 'Google',
      achievement: 'Computer vision for medical imaging',
      impact: '94% accuracy in diabetic retinopathy detection',
      domain: 'Healthcare',
      year: '2019'
    }
  ];

  // Draw application complexity vs impact chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Increased padding for better label positioning
    const padding = 80;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Draw grid first (behind everything)
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 4; i++) {
      // Vertical grid lines
      const x = padding + (i / 5) * graphWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      
      // Horizontal grid lines
      const y = height - padding - (i / 5) * graphHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    
    // X-axis (Complexity)
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Y-axis (Impact)
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw axis labels with better positioning
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    
    // X-axis label (moved further down)
    ctx.fillText('Implementation Complexity →', width / 2, height - 25);
    
    // Y-axis label (moved further left and improved rotation)
    ctx.save();
    ctx.translate(25, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Business Impact →', 0, 0);
    ctx.restore();

    // Draw axis tick labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    
    // X-axis tick labels
    const complexityLabels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
    for (let i = 1; i <= 4; i++) {
      const x = padding + (i / 5) * graphWidth;
      ctx.textAlign = 'center';
      ctx.fillText(complexityLabels[i], x, height - padding + 20);
    }
    
    // Y-axis tick labels
    ctx.textAlign = 'right';
    for (let i = 1; i <= 4; i++) {
      const y = height - padding - (i / 5) * graphHeight;
      ctx.fillText(`${i * 25}%`, padding - 10, y + 4);
    }

    // Plot applications from current domain
    const currentDomain = domains[selectedDomain];
    if (currentDomain) {
      currentDomain.applications.forEach((app, index) => {
        const complexity = ['Beginner', 'Intermediate', 'Advanced', 'Expert'].indexOf(app.difficulty) + 1;
        const impact = parseFloat(app.accuracy) / 20; // Scale accuracy to impact
        
        const x = padding + (complexity / 5) * graphWidth;
        const y = height - padding - (impact / 5) * graphHeight;
        
        // Draw point with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillStyle = currentDomain.color;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw white border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw label with better positioning
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'left';
        
        // Position label to avoid overlap
        let labelX = x + 15;
        let labelY = y + 4;
        
        // Adjust label position if it would go off screen
        if (labelX + ctx.measureText(app.name).width > width - 10) {
          labelX = x - 15;
          ctx.textAlign = 'right';
        }
        
        if (labelY < 20) {
          labelY = y + 20;
        }
        
        // Draw label background
        const textMetrics = ctx.measureText(app.name);
        const textWidth = textMetrics.width;
        const textHeight = 16;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(
          ctx.textAlign === 'right' ? labelX - textWidth - 4 : labelX - 2,
          labelY - textHeight + 2,
          textWidth + 4,
          textHeight
        );
        
        // Draw label text
        ctx.fillStyle = '#1f2937';
        ctx.fillText(app.name, labelX, labelY);
      });
    }

  }, [selectedDomain]);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#10b981',
      'Intermediate': '#f59e0b',
      'Advanced': '#ef4444',
      'Expert': '#7c3aed'
    };
    return colors[difficulty] || '#64748b';
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
        Real-World Applications
      </motion.h2>
      
      <motion.p 
        className="section-subtitle"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Explore how neural networks are transforming industries and solving complex problems
      </motion.p>

      {/* Domain Selection */}
      <motion.div
        className="demo-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="demo-controls">
          <div className="control-group">
            <label>Explore Domain:</label>
            <div className="button-group">
              {Object.entries(domains).map(([key, domain]) => (
                <button
                  key={key}
                  className={`control-btn ${selectedDomain === key ? 'active' : ''}`}
                  onClick={() => setSelectedDomain(key)}
                  style={{
                    borderColor: selectedDomain === key ? domain.color : 'var(--border)',
                    backgroundColor: selectedDomain === key ? domain.color : 'var(--surface-light)'
                  }}
                >
                  <span style={{ marginRight: '0.5rem' }}>{domain.icon}</span>
                  {domain.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          <div>
            <motion.div
              key={selectedDomain}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="domain-overview"
            >
              <h3 style={{ 
                color: domains[selectedDomain].color, 
                fontSize: '1.8rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '0.75rem', fontSize: '2rem' }}>
                  {domains[selectedDomain].icon}
                </span>
                {domains[selectedDomain].name}
              </h3>
              
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                {domains[selectedDomain].description}
              </p>

              <div className="applications-grid">
                {domains[selectedDomain].applications.map((app, index) => (
                  <motion.div
                    key={app.name}
                    className="application-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredApp(app.name)}
                    onMouseLeave={() => setHoveredApp(null)}
                    style={{
                      border: hoveredApp === app.name ? `2px solid ${domains[selectedDomain].color}` : '2px solid var(--border)',
                      transform: hoveredApp === app.name ? 'translateY(-4px)' : 'translateY(0)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 style={{ 
                        color: 'var(--primary)', 
                        fontSize: '1.2rem',
                        margin: 0
                      }}>
                        {app.name}
                      </h4>
                      <span 
                        style={{
                          background: getDifficultyColor(app.difficulty),
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {app.difficulty}
                      </span>
                    </div>
                    
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      marginBottom: '1rem',
                      lineHeight: '1.5'
                    }}>
                      {app.description}
                    </p>
                    
                    <div className="mb-3">
                      <strong style={{ color: 'var(--accent)' }}>Examples:</strong>
                      <ul style={{ 
                        color: 'var(--text-secondary)', 
                        marginTop: '0.5rem',
                        paddingLeft: '1.5rem'
                      }}>
                        {app.examples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-2 gap-2">
                      <div>
                        <strong style={{ color: 'var(--accent)' }}>Accuracy:</strong>
                        <span style={{ 
                          color: domains[selectedDomain].color, 
                          marginLeft: '0.5rem',
                          fontWeight: 'bold'
                        }}>
                          {app.accuracy}
                        </span>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--accent)' }}>Architectures:</strong>
                        <div style={{ 
                          color: 'var(--text-secondary)', 
                          fontSize: '0.9rem',
                          marginTop: '0.25rem'
                        }}>
                          {app.architectures.join(', ')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="visualization-container">
            <h4 style={{ 
              color: 'var(--accent)', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Complexity vs Impact
            </h4>
            <canvas 
              ref={canvasRef}
              width={400}
              height={300}
              className="applications-canvas"
            />
          </div>
        </div>
      </motion.div>

      {/* Industry Statistics */}
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
          Industry Impact & Growth
        </h3>
        
        <div className="grid grid-4">
          {industryStats.map((stat, index) => (
            <motion.div
              key={stat.domain}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 style={{ 
                color: 'var(--primary)', 
                fontSize: '1.2rem',
                marginBottom: '1rem'
              }}>
                {stat.domain}
              </h4>
              
              <div className="stat-item">
                <span className="stat-label">Investment:</span>
                <span className="stat-value" style={{ color: '#10b981' }}>{stat.investment}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Growth:</span>
                <span className="stat-value" style={{ color: '#f59e0b' }}>{stat.growth}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Jobs:</span>
                <span className="stat-value" style={{ color: '#2563eb' }}>{stat.jobs}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Success Stories */}
      <motion.div
        className="demo-container mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="demo-title">
          Notable Success Stories
        </h3>
        <p className="demo-description">
          Breakthrough applications that have transformed their respective industries.
        </p>
        
        <div className="grid grid-2">
          {successStories.map((story, index) => (
            <motion.div
              key={story.company}
              className="success-story-card"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 style={{ 
                  color: 'var(--primary)', 
                  fontSize: '1.3rem',
                  margin: 0
                }}>
                  {story.company}
                </h4>
                <span style={{
                  background: 'var(--surface-light)',
                  color: 'var(--accent)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  {story.year}
                </span>
              </div>
              
              <div className="mb-3">
                <strong style={{ color: 'var(--accent)' }}>Achievement:</strong>
                <p style={{ 
                  color: 'var(--text-primary)', 
                  marginTop: '0.5rem',
                  lineHeight: '1.5'
                }}>
                  {story.achievement}
                </p>
              </div>
              
              <div className="mb-3">
                <strong style={{ color: 'var(--accent)' }}>Impact:</strong>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  marginTop: '0.5rem',
                  lineHeight: '1.5'
                }}>
                  {story.impact}
                </p>
              </div>
              
              <div className="domain-tag">
                <span style={{
                  background: domains[selectedDomain].color,
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {story.domain}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Getting Started Guide */}
      <motion.div
        className="demo-container mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="demo-title">
          How to Get Started in AI
        </h3>
        
        <div className="grid grid-3">
          <div className="getting-started-step">
            <div className="step-number">1</div>
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
              Learn the Fundamentals
            </h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
              <li>Mathematics: Linear algebra, calculus, statistics</li>
              <li>Programming: Python, libraries (NumPy, pandas, scikit-learn)</li>
              <li>Machine Learning basics and neural networks</li>
              <li>Data preprocessing and visualization</li>
            </ul>
          </div>
          
          <div className="getting-started-step">
            <div className="step-number">2</div>
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
              Practice with Projects
            </h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
              <li>Start with simple classification problems</li>
              <li>Work with public datasets (Kaggle, UCI ML Repository)</li>
              <li>Build end-to-end projects with real data</li>
              <li>Contribute to open-source AI projects</li>
            </ul>
          </div>
          
          <div className="getting-started-step">
            <div className="step-number">3</div>
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
              Specialize & Deploy
            </h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
              <li>Choose a domain that interests you</li>
              <li>Learn domain-specific techniques and tools</li>
              <li>Deploy models to production environments</li>
              <li>Stay updated with latest research and trends</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ApplicationsSection;