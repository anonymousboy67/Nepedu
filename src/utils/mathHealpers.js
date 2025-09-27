// ===== ACTIVATION FUNCTIONS =====

/**
 * Sigmoid activation function
 * @param {number} x - Input value
 * @returns {number} - Output between 0 and 1
 */
export const sigmoid = (x) => {
  return 1 / (1 + Math.exp(-Math.max(-250, Math.min(250, x))));
};

/**
 * Sigmoid derivative
 * @param {number} x - Input value
 * @returns {number} - Derivative of sigmoid
 */
export const sigmoidDerivative = (x) => {
  const s = sigmoid(x);
  return s * (1 - s);
};

/**
 * ReLU activation function
 * @param {number} x - Input value
 * @returns {number} - Output (0 if x < 0, x if x >= 0)
 */
export const relu = (x) => {
  return Math.max(0, x);
};

/**
 * ReLU derivative
 * @param {number} x - Input value
 * @returns {number} - Derivative of ReLU
 */
export const reluDerivative = (x) => {
  return x > 0 ? 1 : 0;
};

/**
 * Leaky ReLU activation function
 * @param {number} x - Input value
 * @param {number} alpha - Negative slope coefficient (default: 0.01)
 * @returns {number} - Output
 */
export const leakyRelu = (x, alpha = 0.01) => {
  return x > 0 ? x : alpha * x;
};

/**
 * Leaky ReLU derivative
 * @param {number} x - Input value
 * @param {number} alpha - Negative slope coefficient (default: 0.01)
 * @returns {number} - Derivative of Leaky ReLU
 */
export const leakyReluDerivative = (x, alpha = 0.01) => {
  return x > 0 ? 1 : alpha;
};

/**
 * Tanh activation function
 * @param {number} x - Input value
 * @returns {number} - Output between -1 and 1
 */
export const tanh = (x) => {
  return Math.tanh(x);
};

/**
 * Tanh derivative
 * @param {number} x - Input value
 * @returns {number} - Derivative of tanh
 */
export const tanhDerivative = (x) => {
  return 1 - Math.pow(Math.tanh(x), 2);
};

/**
 * ELU activation function
 * @param {number} x - Input value
 * @param {number} alpha - Alpha parameter (default: 1.0)
 * @returns {number} - Output
 */
export const elu = (x, alpha = 1.0) => {
  return x > 0 ? x : alpha * (Math.exp(x) - 1);
};

/**
 * ELU derivative
 * @param {number} x - Input value
 * @param {number} alpha - Alpha parameter (default: 1.0)
 * @returns {number} - Derivative of ELU
 */
export const eluDerivative = (x, alpha = 1.0) => {
  return x > 0 ? 1 : alpha * Math.exp(x);
};

/**
 * Softmax activation function for arrays
 * @param {Array<number>} x - Input array
 * @returns {Array<number>} - Probability distribution
 */
export const softmax = (x) => {
  const maxVal = Math.max(...x);
  const shifted = x.map(val => val - maxVal);
  const exps = shifted.map(val => Math.exp(val));
  const sumExps = exps.reduce((sum, exp) => sum + exp, 0);
  return exps.map(exp => exp / sumExps);
};

// ===== LOSS FUNCTIONS =====

/**
 * Mean Squared Error loss
 * @param {number|Array} predicted - Predicted values
 * @param {number|Array} actual - Actual values
 * @returns {number} - MSE loss
 */
export const meanSquaredError = (predicted, actual) => {
  if (Array.isArray(predicted)) {
    const errors = predicted.map((p, i) => Math.pow(p - actual[i], 2));
    return errors.reduce((sum, err) => sum + err, 0) / errors.length;
  }
  return Math.pow(predicted - actual, 2) / 2;
};

/**
 * Mean Absolute Error loss
 * @param {number|Array} predicted - Predicted values
 * @param {number|Array} actual - Actual values
 * @returns {number} - MAE loss
 */
export const meanAbsoluteError = (predicted, actual) => {
  if (Array.isArray(predicted)) {
    const errors = predicted.map((p, i) => Math.abs(p - actual[i]));
    return errors.reduce((sum, err) => sum + err, 0) / errors.length;
  }
  return Math.abs(predicted - actual);
};

/**
 * Binary Cross-Entropy loss
 * @param {number} predicted - Predicted probability (0-1)
 * @param {number} actual - Actual label (0 or 1)
 * @returns {number} - Cross-entropy loss
 */
export const binaryCrossEntropy = (predicted, actual) => {
  const eps = 1e-15;
  const clipped = Math.max(eps, Math.min(1 - eps, predicted));
  return -(actual * Math.log(clipped) + (1 - actual) * Math.log(1 - clipped));
};

/**
 * Categorical Cross-Entropy loss
 * @param {Array<number>} predicted - Predicted probabilities
 * @param {Array<number>} actual - One-hot encoded actual labels
 * @returns {number} - Cross-entropy loss
 */
export const categoricalCrossEntropy = (predicted, actual) => {
  const eps = 1e-15;
  const clipped = predicted.map(p => Math.max(eps, Math.min(1 - eps, p)));
  return -actual.reduce((sum, a, i) => sum + a * Math.log(clipped[i]), 0);
};

/**
 * Huber loss
 * @param {number} predicted - Predicted value
 * @param {number} actual - Actual value
 * @param {number} delta - Threshold parameter (default: 1.0)
 * @returns {number} - Huber loss
 */
export const huberLoss = (predicted, actual, delta = 1.0) => {
  const error = Math.abs(predicted - actual);
  return error <= delta 
    ? 0.5 * Math.pow(error, 2)
    : delta * error - 0.5 * Math.pow(delta, 2);
};

// ===== MATRIX OPERATIONS =====

/**
 * Matrix multiplication
 * @param {Array<Array<number>>} a - First matrix
 * @param {Array<Array<number>>} b - Second matrix
 * @returns {Array<Array<number>>} - Result matrix
 */
export const matrixMultiply = (a, b) => {
  const rows = a.length;
  const cols = b[0].length;
  const inner = b.length;
  
  const result = Array(rows).fill().map(() => Array(cols).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < inner; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  
  return result;
};

/**
 * Matrix transpose
 * @param {Array<Array<number>>} matrix - Input matrix
 * @returns {Array<Array<number>>} - Transposed matrix
 */
export const matrixTranspose = (matrix) => {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
};

/**
 * Matrix addition
 * @param {Array<Array<number>>} a - First matrix
 * @param {Array<Array<number>>} b - Second matrix
 * @returns {Array<Array<number>>} - Sum matrix
 */
export const matrixAdd = (a, b) => {
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
};

/**
 * Matrix subtraction
 * @param {Array<Array<number>>} a - First matrix
 * @param {Array<Array<number>>} b - Second matrix
 * @returns {Array<Array<number>>} - Difference matrix
 */
export const matrixSubtract = (a, b) => {
  return a.map((row, i) => row.map((val, j) => val - b[i][j]));
};

/**
 * Scalar multiplication of matrix
 * @param {Array<Array<number>>} matrix - Input matrix
 * @param {number} scalar - Scalar value
 * @returns {Array<Array<number>>} - Scaled matrix
 */
export const matrixScale = (matrix, scalar) => {
  return matrix.map(row => row.map(val => val * scalar));
};

// ===== VECTOR OPERATIONS =====

/**
 * Dot product of two vectors
 * @param {Array<number>} a - First vector
 * @param {Array<number>} b - Second vector
 * @returns {number} - Dot product
 */
export const dotProduct = (a, b) => {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
};

/**
 * Vector magnitude (Euclidean norm)
 * @param {Array<number>} vector - Input vector
 * @returns {number} - Magnitude
 */
export const vectorMagnitude = (vector) => {
  return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
};

/**
 * Normalize vector to unit length
 * @param {Array<number>} vector - Input vector
 * @returns {Array<number>} - Normalized vector
 */
export const normalizeVector = (vector) => {
  const magnitude = vectorMagnitude(vector);
  return magnitude === 0 ? vector : vector.map(val => val / magnitude);
};

/**
 * Euclidean distance between two points
 * @param {Array<number>} a - First point
 * @param {Array<number>} b - Second point
 * @returns {number} - Distance
 */
export const euclideanDistance = (a, b) => {
  const diff = a.map((val, i) => val - b[i]);
  return vectorMagnitude(diff);
};

/**
 * Manhattan distance between two points
 * @param {Array<number>} a - First point
 * @param {Array<number>} b - Second point
 * @returns {number} - Distance
 */
export const manhattanDistance = (a, b) => {
  return a.reduce((sum, val, i) => sum + Math.abs(val - b[i]), 0);
};

// ===== STATISTICAL FUNCTIONS =====

/**
 * Calculate mean of array
 * @param {Array<number>} values - Input values
 * @returns {number} - Mean
 */
export const mean = (values) => {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Calculate standard deviation
 * @param {Array<number>} values - Input values
 * @returns {number} - Standard deviation
 */
export const standardDeviation = (values) => {
  const avg = mean(values);
  const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
  return Math.sqrt(mean(squaredDiffs));
};

/**
 * Calculate variance
 * @param {Array<number>} values - Input values
 * @returns {number} - Variance
 */
export const variance = (values) => {
  const avg = mean(values);
  const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
  return mean(squaredDiffs);
};

/**
 * Min-max normalization
 * @param {Array<number>} values - Input values
 * @param {number} newMin - New minimum value (default: 0)
 * @param {number} newMax - New maximum value (default: 1)
 * @returns {Array<number>} - Normalized values
 */
export const minMaxNormalize = (values, newMin = 0, newMax = 1) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  if (range === 0) return values.map(() => newMin);
  
  return values.map(val => 
    newMin + ((val - min) / range) * (newMax - newMin)
  );
};

/**
 * Z-score normalization (standardization)
 * @param {Array<number>} values - Input values
 * @returns {Array<number>} - Standardized values
 */
export const zScoreNormalize = (values) => {
  const avg = mean(values);
  const std = standardDeviation(values);
  
  if (std === 0) return values.map(() => 0);
  
  return values.map(val => (val - avg) / std);
};

// ===== RANDOM UTILITIES =====

/**
 * Generate random number in range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random number
 */
export const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Generate random integer in range
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number} - Random integer
 */
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Generate random normal distribution (Box-Muller transform)
 * @param {number} mean - Mean value (default: 0)
 * @param {number} std - Standard deviation (default: 1)
 * @returns {number} - Random normal value
 */
export const randomNormal = (mean = 0, std = 1) => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * std + mean;
};

/**
 * Initialize weights using Xavier/Glorot initialization
 * @param {number} fanIn - Number of input neurons
 * @param {number} fanOut - Number of output neurons
 * @returns {number} - Random weight
 */
export const xavierInit = (fanIn, fanOut) => {
  const limit = Math.sqrt(6 / (fanIn + fanOut));
  return randomInRange(-limit, limit);
};

/**
 * Initialize weights using He initialization
 * @param {number} fanIn - Number of input neurons
 * @returns {number} - Random weight
 */
export const heInit = (fanIn) => {
  return randomNormal(0, Math.sqrt(2 / fanIn));
};

// ===== GRADIENT DESCENT FUNCTIONS =====

/**
 * Calculate gradient of MSE loss
 * @param {number} predicted - Predicted value
 * @param {number} actual - Actual value
 * @returns {number} - Gradient
 */
export const mseGradient = (predicted, actual) => {
  return predicted - actual;
};

/**
 * Calculate gradient of binary cross-entropy loss
 * @param {number} predicted - Predicted probability
 * @param {number} actual - Actual label
 * @returns {number} - Gradient
 */
export const binaryCrossEntropyGradient = (predicted, actual) => {
  const eps = 1e-15;
  const clipped = Math.max(eps, Math.min(1 - eps, predicted));
  return (clipped - actual) / (clipped * (1 - clipped));
};

// ===== OPTIMIZATION FUNCTIONS =====

/**
 * Adam optimizer state update
 * @param {Object} state - Optimizer state
 * @param {number} gradient - Current gradient
 * @param {number} beta1 - First moment decay rate (default: 0.9)
 * @param {number} beta2 - Second moment decay rate (default: 0.999)
 * @param {number} epsilon - Small constant for numerical stability (default: 1e-8)
 * @returns {Object} - Updated state and parameter update
 */
export const adamUpdate = (state, gradient, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8) => {
  state.t = (state.t || 0) + 1;
  state.m = (state.m || 0) * beta1 + (1 - beta1) * gradient;
  state.v = (state.v || 0) * beta2 + (1 - beta2) * gradient * gradient;
  
  const mHat = state.m / (1 - Math.pow(beta1, state.t));
  const vHat = state.v / (1 - Math.pow(beta2, state.t));
  
  const update = mHat / (Math.sqrt(vHat) + epsilon);
  
  return { state, update };
};

/**
 * RMSprop optimizer state update
 * @param {Object} state - Optimizer state
 * @param {number} gradient - Current gradient
 * @param {number} alpha - Decay rate (default: 0.9)
 * @param {number} epsilon - Small constant for numerical stability (default: 1e-8)
 * @returns {Object} - Updated state and parameter update
 */
export const rmspropUpdate = (state, gradient, alpha = 0.9, epsilon = 1e-8) => {
  state.v = (state.v || 0) * alpha + (1 - alpha) * gradient * gradient;
  const update = gradient / (Math.sqrt(state.v) + epsilon);
  
  return { state, update };
};

// ===== COORDINATE TRANSFORMATIONS =====

/**
 * Convert screen coordinates to canvas coordinates
 * @param {number} x - Screen x coordinate
 * @param {number} y - Screen y coordinate
 * @param {Object} bounds - Canvas bounds
 * @param {Object} domain - Data domain
 * @returns {Object} - Canvas coordinates
 */
export const screenToCanvas = (x, y, bounds, domain) => {
  const canvasX = bounds.left + ((x - domain.xMin) / (domain.xMax - domain.xMin)) * bounds.width;
  const canvasY = bounds.top + bounds.height - ((y - domain.yMin) / (domain.yMax - domain.yMin)) * bounds.height;
  return { x: canvasX, y: canvasY };
};

/**
 * Convert canvas coordinates to screen coordinates
 * @param {number} canvasX - Canvas x coordinate
 * @param {number} canvasY - Canvas y coordinate
 * @param {Object} bounds - Canvas bounds
 * @param {Object} domain - Data domain
 * @returns {Object} - Screen coordinates
 */
export const canvasToScreen = (canvasX, canvasY, bounds, domain) => {
  const x = domain.xMin + ((canvasX - bounds.left) / bounds.width) * (domain.xMax - domain.xMin);
  const y = domain.yMin + ((bounds.top + bounds.height - canvasY) / bounds.height) * (domain.yMax - domain.yMin);
  return { x, y };
};

// ===== UTILITY FUNCTIONS =====

/**
 * Clamp value between min and max
 * @param {number} value - Input value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Linear interpolation between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} - Interpolated value
 */
export const lerp = (a, b, t) => {
  return a + (b - a) * clamp(t, 0, 1);
};

/**
 * Map value from one range to another
 * @param {number} value - Input value
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} - Mapped value
 */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
};

/**
 * Check if value is approximately equal (within epsilon)
 * @param {number} a - First value
 * @param {number} b - Second value
 * @param {number} epsilon - Tolerance (default: 1e-10)
 * @returns {boolean} - Whether values are approximately equal
 */
export const approximately = (a, b, epsilon = 1e-10) => {
  return Math.abs(a - b) < epsilon;
};

/**
 * Generate sequence of numbers
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} step - Step size
 * @returns {Array<number>} - Sequence array
 */
export const range = (start, end, step = 1) => {
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Generate linearly spaced array
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} count - Number of points
 * @returns {Array<number>} - Linearly spaced array
 */
export const linspace = (start, end, count) => {
  const step = (end - start) / (count - 1);
  return Array.from({ length: count }, (_, i) => start + i * step);
};

export default {
  // Activation functions
  sigmoid, sigmoidDerivative, relu, reluDerivative,
  leakyRelu, leakyReluDerivative, tanh, tanhDerivative,
  elu, eluDerivative, softmax,
  
  // Loss functions
  meanSquaredError, meanAbsoluteError, binaryCrossEntropy,
  categoricalCrossEntropy, huberLoss,
  
  // Matrix operations
  matrixMultiply, matrixTranspose, matrixAdd, matrixSubtract, matrixScale,
  
  // Vector operations
  dotProduct, vectorMagnitude, normalizeVector,
  euclideanDistance, manhattanDistance,
  
  // Statistical functions
  mean, standardDeviation, variance, minMaxNormalize, zScoreNormalize,
  
  // Random utilities
  randomInRange, randomInt, randomNormal, xavierInit, heInit,
  
  // Gradients
  mseGradient, binaryCrossEntropyGradient,
  
  // Optimizers
  adamUpdate, rmspropUpdate,
  
  // Coordinate transformations
  screenToCanvas, canvasToScreen,
  
  // Utilities
  clamp, lerp, mapRange, approximately, range, linspace
};