import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../hooks/useAnimation';
import Button, { ButtonGroup, IconButton } from './Button';
import Card, { CardHeader, CardBody, CardFooter } from './Card';

function InteractiveDemo({
  title,
  description,
  children,
  controls,
  visualization,
  explanations = [],
  currentStep = 0,
  onStepChange,
  showSteps = true,
  autoPlay = false,
  playSpeed = 2000,
  className = '',
  style = {}
}) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [localStep, setLocalStep] = useState(currentStep);
  const [showExplanation, setShowExplanation] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const playIntervalRef = useRef(null);

  const { progress, startAnimation, stopAnimation, resetAnimation } = useAnimation({
    duration: playSpeed,
    autoStart: autoPlay
  });

  // Handle step changes
  const handleStepChange = (newStep) => {
    const step = Math.max(0, Math.min(explanations.length - 1, newStep));
    setLocalStep(step);
    onStepChange?.(step);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && explanations.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setLocalStep(prev => {
          const nextStep = (prev + 1) % explanations.length;
          onStepChange?.(nextStep);
          return nextStep;
        });
      }, playSpeed);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, explanations.length, playSpeed, onStepChange]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    handleStepChange(0);
    resetAnimation();
  };

  const nextStep = () => {
    handleStepChange(localStep + 1);
  };

  const prevStep = () => {
    handleStepChange(localStep - 1);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const currentExplanation = explanations[localStep];

  return (
    <motion.div
      ref={containerRef}
      className={`interactive-demo ${className}`}
      style={{
        background: 'var(--surface)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid var(--border)',
        position: 'relative',
        ...style
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'var(--primary)'
          }}>
            {title}
          </h3>
          {description && (
            <p style={{
              margin: '0.5rem 0 0 0',
              color: 'var(--text-secondary)',
              lineHeight: '1.5'
            }}>
              {description}
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <IconButton
            icon={showExplanation ? '👁️' : '👁️‍🗨️'}
            tooltip="Toggle explanation"
            onClick={() => setShowExplanation(!showExplanation)}
            size="small"
          />
          <IconButton
            icon={isFullscreen ? '🗗' : '🗖'}
            tooltip="Toggle fullscreen"
            onClick={toggleFullscreen}
            size="small"
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showExplanation ? '1fr 300px' : '1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Visualization Area */}
        <Card 
          variant="outlined" 
          padding="medium"
          style={{ minHeight: '400px' }}
        >
          <div style={{ position: 'relative', height: '100%' }}>
            {/* Custom visualization content */}
            {visualization}
            
            {/* Default children content */}
            {children}
            
            {/* Step Indicator */}
            {showSteps && explanations.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--primary)',
                backdropFilter: 'blur(4px)'
              }}>
                Step {localStep + 1} of {explanations.length}
              </div>
            )}
          </div>
        </Card>

        {/* Explanation Panel */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="filled" padding="medium">
                <CardHeader
                  title="Explanation"
                  icon="💡"
                />
                <CardBody>
                  <AnimatePresence mode="wait">
                    {currentExplanation && (
                      <motion.div
                        key={localStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 style={{
                          margin: '0 0 1rem 0',
                          color: 'var(--primary)',
                          fontSize: '1.1rem'
                        }}>
                          {currentExplanation.title}
                        </h4>
                        <p style={{
                          color: 'var(--text-secondary)',
                          lineHeight: '1.6',
                          margin: '0 0 1rem 0'
                        }}>
                          {currentExplanation.description}
                        </p>
                        
                        {currentExplanation.formula && (
                          <div style={{
                            background: 'var(--surface)',
                            padding: '1rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            color: 'var(--primary)',
                            marginBottom: '1rem'
                          }}>
                            {currentExplanation.formula}
                          </div>
                        )}
                        
                        {currentExplanation.keyPoints && (
                          <div>
                            <strong style={{ color: 'var(--accent)' }}>Key Points:</strong>
                            <ul style={{
                              marginTop: '0.5rem',
                              paddingLeft: '1.5rem',
                              color: 'var(--text-secondary)'
                            }}>
                              {currentExplanation.keyPoints.map((point, index) => (
                                <li key={index} style={{ marginBottom: '0.25rem' }}>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div style={{
        marginTop: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Custom Controls */}
        {controls && (
          <div style={{ flex: 1 }}>
            {controls}
          </div>
        )}

        {/* Step Navigation */}
        {explanations.length > 0 && (
          <ButtonGroup>
            <Button
              variant="ghost"
              size="small"
              onClick={prevStep}
              disabled={localStep === 0}
              icon="←"
            >
              Previous
            </Button>
            
            <Button
              variant="primary"
              size="small"
              onClick={togglePlay}
              icon={isPlaying ? '⏸️' : '▶️'}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button
              variant="ghost"
              size="small"
              onClick={nextStep}
              disabled={localStep === explanations.length - 1}
              iconPosition="right"
              icon="→"
            >
              Next
            </Button>
            
            <Button
              variant="ghost"
              size="small"
              onClick={resetDemo}
              icon="🔄"
            >
              Reset
            </Button>
          </ButtonGroup>
        )}
      </div>

      {/* Progress Bar */}
      {explanations.length > 0 && (
        <div style={{
          marginTop: '1rem',
          height: '4px',
          background: 'var(--surface-light)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <motion.div
            style={{
              height: '100%',
              background: 'var(--primary)',
              borderRadius: '2px'
            }}
            initial={{ width: 0 }}
            animate={{ 
              width: `${((localStep + 1) / explanations.length) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </motion.div>
  );
}

// Simple Demo Wrapper for basic interactive content
export function SimpleDemo({
  title,
  children,
  controls,
  className = '',
  ...props
}) {
  return (
    <Card className={`simple-demo ${className}`} {...props}>
      <CardHeader title={title} />
      <CardBody>
        {children}
      </CardBody>
      {controls && (
        <CardFooter>
          {controls}
        </CardFooter>
      )}
    </Card>
  );
}

// Code Demo Component
export function CodeDemo({
  title,
  code,
  language = 'javascript',
  runnable = false,
  onRun,
  className = '',
  ...props
}) {
  const [showCode, setShowCode] = useState(true);
  const [output, setOutput] = useState('');

  const handleRun = () => {
    if (runnable && onRun) {
      try {
        const result = onRun(code);
        setOutput(result);
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
    }
  };

  return (
    <Card className={`code-demo ${className}`} {...props}>
      <CardHeader
        title={title}
        action={
          <ButtonGroup>
            <Button
              variant="ghost"
              size="small"
              onClick={() => setShowCode(!showCode)}
              icon={showCode ? '🔼' : '🔽'}
            >
              {showCode ? 'Hide' : 'Show'} Code
            </Button>
            {runnable && (
              <Button
                variant="primary"
                size="small"
                onClick={handleRun}
                icon="▶️"
              >
                Run
              </Button>
            )}
          </ButtonGroup>
        }
      />
      
      <CardBody>
        <AnimatePresence>
          {showCode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <pre style={{
                background: 'var(--surface-dark, #1a1a1a)',
                color: 'var(--text-light, #e5e5e5)',
                padding: '1rem',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: 0
              }}>
                <code>{code}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
        
        {output && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--surface-light)',
            borderRadius: '6px',
            border: '1px solid var(--border)'
          }}>
            <strong style={{ color: 'var(--accent)' }}>Output:</strong>
            <pre style={{
              marginTop: '0.5rem',
              margin: 0,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap'
            }}>
              {output}
            </pre>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// Interactive Quiz Component
export function QuizDemo({
  title,
  question,
  options = [],
  correctAnswer,
  explanation,
  onAnswer,
  className = '',
  ...props
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (answerIndex) => {
    if (answered) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);
    setShowResult(true);
    onAnswer?.(answerIndex, answerIndex === correctAnswer);
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswered(false);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <Card className={`quiz-demo ${className}`} {...props}>
      <CardHeader
        title={title}
        icon="❓"
        action={
          answered && (
            <Button
              variant="ghost"
              size="small"
              onClick={resetQuiz}
              icon="🔄"
            >
              Try Again
            </Button>
          )
        }
      />
      
      <CardBody>
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            lineHeight: '1.5'
          }}>
            {question}
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                style={{
                  padding: '1rem',
                  border: '2px solid var(--border)',
                  borderRadius: '8px',
                  background: answered 
                    ? (index === correctAnswer 
                        ? '#10b981' 
                        : (index === selectedAnswer && !isCorrect 
                            ? '#ef4444' 
                            : 'var(--surface)'))
                    : 'var(--surface)',
                  color: answered && (index === correctAnswer || (index === selectedAnswer && !isCorrect))
                    ? 'white'
                    : 'var(--text-primary)',
                  cursor: answered ? 'default' : 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                whileHover={!answered ? { scale: 1.02 } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
              >
                <span style={{ fontWeight: '600', marginRight: '0.5rem' }}>
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {answered && index === correctAnswer && (
                  <span style={{ float: 'right' }}>✓</span>
                )}
                {answered && index === selectedAnswer && !isCorrect && (
                  <span style={{ float: 'right' }}>✗</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
        
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                background: isCorrect ? '#10b98120' : '#ef444420',
                border: `1px solid ${isCorrect ? '#10b981' : '#ef4444'}`
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {isCorrect ? '🎉' : '💡'}
                </span>
                <strong style={{
                  color: isCorrect ? '#10b981' : '#ef4444',
                  fontSize: '1rem'
                }}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </strong>
              </div>
              
              {explanation && (
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {explanation}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardBody>
    </Card>
  );
}

// Slider Demo Component
export function SliderDemo({
  title,
  parameters = [],
  onParameterChange,
  visualization,
  className = '',
  ...props
}) {
  const [values, setValues] = useState(
    parameters.reduce((acc, param) => ({
      ...acc,
      [param.name]: param.defaultValue || param.min || 0
    }), {})
  );

  const handleChange = (paramName, value) => {
    const newValues = { ...values, [paramName]: value };
    setValues(newValues);
    onParameterChange?.(newValues);
  };

  return (
    <InteractiveDemo
      title={title}
      className={className}
      controls={
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {parameters.map((param) => (
            <div key={param.name}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                {param.label}: {values[param.name]?.toFixed?.(param.precision || 2) || values[param.name]}
              </label>
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step || 0.01}
                value={values[param.name]}
                onChange={(e) => handleChange(param.name, parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: 'var(--surface-light)',
                  outline: 'none',
                  appearance: 'none'
                }}
              />
              {param.description && (
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  margin: '0.25rem 0 0 0'
                }}>
                  {param.description}
                </p>
              )}
            </div>
          ))}
        </div>
      }
      visualization={visualization}
      {...props}
    />
  );
}

export default InteractiveDemo;