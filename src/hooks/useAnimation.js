import { useState, useEffect, useRef, useCallback } from 'react';

// Main animation hook with common animation patterns
export const useAnimation = (options = {}) => {
  const {
    duration = 1000,
    delay = 0,
    autoStart = false,
    loop = false,
    direction = 'forward'
  } = options;

  const [isAnimating, setIsAnimating] = useState(autoStart);
  const [progress, setProgress] = useState(0);
  const [currentDirection, setCurrentDirection] = useState(direction);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    startTimeRef.current = null;
  }, []);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const resetAnimation = useCallback(() => {
    setProgress(0);
    setCurrentDirection(direction);
    stopAnimation();
  }, [direction, stopAnimation]);

  const animate = useCallback((timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp + delay;
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const elapsed = timestamp - startTimeRef.current;
    const normalizedProgress = Math.min(elapsed / duration, 1);

    // Apply easing function
    const easedProgress = easeInOutCubic(normalizedProgress);
    
    if (currentDirection === 'reverse') {
      setProgress(1 - easedProgress);
    } else {
      setProgress(easedProgress);
    }

    if (normalizedProgress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Animation completed
      if (loop) {
        if (direction === 'alternate') {
          setCurrentDirection(prev => prev === 'forward' ? 'reverse' : 'forward');
        }
        startTimeRef.current = null;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    }
  }, [duration, delay, loop, direction, currentDirection]);

  useEffect(() => {
    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animate]);

  return {
    progress,
    isAnimating,
    startAnimation,
    stopAnimation,
    resetAnimation
  };
};

// Hook for spring animations
export const useSpringAnimation = (targetValue, config = {}) => {
  const {
    stiffness = 100,
    damping = 10,
    mass = 1,
    precision = 0.01
  } = config;

  const [currentValue, setCurrentValue] = useState(targetValue);
  const [velocity, setVelocity] = useState(0);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const displacement = currentValue - targetValue;
      const force = -stiffness * displacement - damping * velocity;
      const acceleration = force / mass;

      const newVelocity = velocity + acceleration * deltaTime;
      const newValue = currentValue + newVelocity * deltaTime;

      setVelocity(newVelocity);
      setCurrentValue(newValue);

      // Continue animation if not settled
      if (Math.abs(displacement) > precision || Math.abs(newVelocity) > precision) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (Math.abs(currentValue - targetValue) > precision) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, currentValue, velocity, stiffness, damping, mass, precision]);

  return currentValue;
};

// Hook for managing multiple sequential animations
export const useSequentialAnimation = (steps = [], options = {}) => {
  const { autoStart = false, onComplete } = options;
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [stepProgress, setStepProgress] = useState(0);

  const stepAnimation = useAnimation({
    duration: steps[currentStep]?.duration || 1000,
    autoStart: false
  });

  useEffect(() => {
    if (isRunning && currentStep < steps.length) {
      stepAnimation.startAnimation();
    }
  }, [isRunning, currentStep, stepAnimation]);

  useEffect(() => {
    setStepProgress(stepAnimation.progress);
    
    if (stepAnimation.progress >= 1 && !stepAnimation.isAnimating) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsRunning(false);
        onComplete?.();
      }
    }
  }, [stepAnimation.progress, stepAnimation.isAnimating, currentStep, steps.length, onComplete]);

  const startSequence = useCallback(() => {
    setCurrentStep(0);
    setIsRunning(true);
  }, []);

  const stopSequence = useCallback(() => {
    setIsRunning(false);
    stepAnimation.stopAnimation();
  }, [stepAnimation]);

  const resetSequence = useCallback(() => {
    setCurrentStep(0);
    setStepProgress(0);
    setIsRunning(false);
    stepAnimation.resetAnimation();
  }, [stepAnimation]);

  const totalProgress = (currentStep + stepProgress) / steps.length;

  return {
    currentStep,
    stepProgress,
    totalProgress,
    isRunning,
    startSequence,
    stopSequence,
    resetSequence,
    currentStepData: steps[currentStep]
  };
};

// Hook for particle animations
export const useParticleAnimation = (particleCount = 50, canvasRef) => {
  const [particles, setParticles] = useState([]);
  const animationRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);

  const initializeParticles = useCallback(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const newParticles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.5,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }));

    setParticles(newParticles);
  }, [particleCount, canvasRef]);

  const updateParticles = useCallback(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    setParticles(prevParticles => 
      prevParticles.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        let newVx = particle.vx;
        let newVy = particle.vy;

        // Bounce off walls
        if (newX <= 0 || newX >= canvas.width) {
          newVx = -newVx;
          newX = Math.max(0, Math.min(canvas.width, newX));
        }
        if (newY <= 0 || newY >= canvas.height) {
          newVy = -newVy;
          newY = Math.max(0, Math.min(canvas.height, newY));
        }

        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        };
      })
    );
  }, [canvasRef]);

  const animate = useCallback(() => {
    updateParticles();
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [updateParticles, isRunning]);

  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, animate]);

  const startParticles = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopParticles = useCallback(() => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  return {
    particles,
    isRunning,
    startParticles,
    stopParticles,
    initializeParticles
  };
};

// Hook for value interpolation animations
export const useInterpolation = (from, to, progress, easing = 'linear') => {
  const easingFunctions = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => (--t) * t * t + 1,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  };

  const easingFunction = easingFunctions[easing] || easingFunctions.linear;
  const easedProgress = easingFunction(Math.max(0, Math.min(1, progress)));

  if (typeof from === 'number' && typeof to === 'number') {
    return from + (to - from) * easedProgress;
  }

  if (Array.isArray(from) && Array.isArray(to)) {
    return from.map((fromVal, index) => 
      fromVal + (to[index] - fromVal) * easedProgress
    );
  }

  if (typeof from === 'object' && typeof to === 'object') {
    const result = {};
    Object.keys(from).forEach(key => {
      if (typeof from[key] === 'number' && typeof to[key] === 'number') {
        result[key] = from[key] + (to[key] - from[key]) * easedProgress;
      }
    });
    return result;
  }

  return from;
};

// Hook for scroll-based animations
export const useScrollAnimation = (threshold = 0.1) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    const handleScroll = () => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;

      // Calculate how much of the element is visible
      const visibleTop = Math.max(0, -rect.top);
      const visibleBottom = Math.min(elementHeight, windowHeight - rect.top);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      const progress = visibleHeight / elementHeight;
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return {
    elementRef,
    scrollProgress,
    isVisible
  };
};

// Utility easing functions
export const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

export const easeInOutQuad = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export const easeOutBounce = (t) => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

// Hook for managing animation queues
export const useAnimationQueue = () => {
  const [queue, setQueue] = useState([]);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const addToQueue = useCallback((animation) => {
    setQueue(prev => [...prev, animation]);
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0) return;

    setIsProcessing(true);
    const nextAnimation = queue[0];
    setCurrentAnimation(nextAnimation);
    setQueue(prev => prev.slice(1));

    try {
      await nextAnimation.execute();
    } catch (error) {
      console.error('Animation error:', error);
    }

    setCurrentAnimation(null);
    setIsProcessing(false);
  }, [queue, isProcessing]);

  useEffect(() => {
    processQueue();
  }, [queue, processQueue]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentAnimation(null);
    setIsProcessing(false);
  }, []);

  return {
    addToQueue,
    clearQueue,
    currentAnimation,
    queueLength: queue.length,
    isProcessing
  };
};

export default useAnimation;