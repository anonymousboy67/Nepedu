// Course content data for the deep learning interactive tutorial

export const courseModules = [
  {
    id: 'introduction',
    title: 'Introduction to Neural Networks',
    description: 'Start your journey into the world of artificial neural networks',
    icon: '🧠',
    color: '#2563eb',
    duration: '45 min',
    difficulty: 'Beginner',
    sections: [
      {
        id: 'hero',
        title: 'Welcome',
        component: 'Hero',
        description: 'Introduction to the course and what you\'ll learn'
      },
      {
        id: 'what-are-neural-networks',
        title: 'What Are Neural Networks?',
        component: 'WhatAreNeuralNetworks',
        description: 'Understanding the basics of neural networks and their inspiration from biology'
      }
    ]
  },
  {
    id: 'fundamentals',
    title: 'Neural Network Fundamentals',
    description: 'Build understanding of core concepts and components',
    icon: '⚡',
    color: '#10b981',
    duration: '60 min',
    difficulty: 'Beginner',
    sections: [
      {
        id: 'neuron-structure',
        title: 'Neuron Structure',
        component: 'NeuronStructure',
        description: 'Learn how individual neurons process information with weights, bias, and activation functions'
      },
      {
        id: 'activation-functions',
        title: 'Activation Functions',
        component: 'ActivationFunctions',
        description: 'Explore different activation functions and their properties'
      },
      {
        id: 'network-architecture',
        title: 'Network Architecture',
        component: 'NetworkArchitecture',
        description: 'Understand how neurons connect to form powerful networks'
      }
    ]
  },
  {
    id: 'training',
    title: 'Training Neural Networks',
    description: 'Discover how neural networks learn from data',
    icon: '📈',
    color: '#f59e0b',
    duration: '75 min',
    difficulty: 'Intermediate',
    sections: [
      {
        id: 'loss-functions',
        title: 'Loss Functions',
        component: 'LossFunctions',
        description: 'Learn how networks measure and minimize prediction errors'
      },
      {
        id: 'training-process',
        title: 'Training Process',
        component: 'TrainingProcess',
        description: 'Experience the complete training cycle with interactive simulations'
      },
      {
        id: 'backpropagation',
        title: 'Backpropagation',
        component: 'BackpropagationSection',
        description: 'Understand how errors propagate backward to update weights'
      },
      {
        id: 'gradient-descent',
        title: 'Gradient Descent',
        component: 'GradientDescentVisualizer',
        description: 'Visualize optimization algorithms navigating loss landscapes'
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Topics',
    description: 'Explore specialized networks and unsupervised learning',
    icon: '🔬',
    color: '#7c3aed',
    duration: '90 min',
    difficulty: 'Advanced',
    sections: [
      {
        id: 'unsupervised-learning',
        title: 'Unsupervised Learning',
        component: 'UnsupervisedLearning',
        description: 'Discover patterns in data without labeled examples'
      },
      {
        id: 'som-visualizer',
        title: 'Self-Organizing Maps',
        component: 'SOMVisualizer',
        description: 'Watch maps organize themselves to cluster similar data'
      }
    ]
  },
  {
    id: 'applications',
    title: 'Real-World Applications',
    description: 'See how neural networks solve real problems across industries',
    icon: '🌍',
    color: '#ef4444',
    duration: '45 min',
    difficulty: 'Intermediate',
    sections: [
      {
        id: 'applications',
        title: 'Applications Showcase',
        component: 'ApplicationsSection',
        description: 'Explore neural network applications across different domains'
      }
    ]
  }
];

export const learningPaths = [
  {
    id: 'beginner',
    title: 'Beginner Path',
    description: 'Perfect for those new to machine learning',
    color: '#10b981',
    estimatedTime: '3-4 hours',
    modules: ['introduction', 'fundamentals'],
    prerequisites: ['Basic mathematics', 'Programming fundamentals'],
    outcomes: [
      'Understand what neural networks are',
      'Know how neurons process information',
      'Recognize different activation functions',
      'Understand basic network architectures'
    ]
  },
  {
    id: 'intermediate',
    title: 'Complete Course',
    description: 'Full deep learning fundamentals',
    color: '#2563eb',
    estimatedTime: '5-6 hours',
    modules: ['introduction', 'fundamentals', 'training', 'applications'],
    prerequisites: ['Linear algebra', 'Calculus basics', 'Python programming'],
    outcomes: [
      'Build neural networks from scratch',
      'Understand training algorithms',
      'Implement backpropagation',
      'Apply networks to real problems'
    ]
  },
  {
    id: 'advanced',
    title: 'Expert Track',
    description: 'Advanced techniques and specialized networks',
    color: '#7c3aed',
    estimatedTime: '7-8 hours',
    modules: ['introduction', 'fundamentals', 'training', 'advanced', 'applications'],
    prerequisites: ['Machine learning experience', 'Advanced mathematics', 'Deep learning basics'],
    outcomes: [
      'Master optimization techniques',
      'Understand unsupervised learning',
      'Implement specialized architectures',
      'Design networks for specific domains'
    ]
  }
];

export const glossary = {
  'activation-function': {
    term: 'Activation Function',
    definition: 'A mathematical function that determines the output of a neural network node given an input or set of inputs.',
    examples: ['ReLU', 'Sigmoid', 'Tanh'],
    relatedTerms: ['neuron', 'backpropagation']
  },
  'backpropagation': {
    term: 'Backpropagation',
    definition: 'A method for training neural networks by propagating errors backward through the network to update weights.',
    examples: ['Gradient calculation', 'Weight updates'],
    relatedTerms: ['gradient-descent', 'chain-rule']
  },
  'gradient-descent': {
    term: 'Gradient Descent',
    definition: 'An optimization algorithm that minimizes the loss function by iteratively moving in the direction of steepest descent.',
    examples: ['SGD', 'Adam', 'RMSprop'],
    relatedTerms: ['learning-rate', 'optimization']
  },
  'loss-function': {
    term: 'Loss Function',
    definition: 'A function that measures the difference between predicted and actual values, guiding the learning process.',
    examples: ['Mean Squared Error', 'Cross-entropy', 'Huber Loss'],
    relatedTerms: ['training', 'optimization']
  },
  'neural-network': {
    term: 'Neural Network',
    definition: 'A computing system inspired by biological neural networks, consisting of interconnected nodes (neurons).',
    examples: ['Feedforward networks', 'CNNs', 'RNNs'],
    relatedTerms: ['deep-learning', 'artificial-intelligence']
  },
  'overfitting': {
    term: 'Overfitting',
    definition: 'When a model learns the training data too well, including noise, leading to poor generalization.',
    examples: ['High training accuracy, low validation accuracy'],
    relatedTerms: ['regularization', 'validation']
  },
  'weight': {
    term: 'Weight',
    definition: 'Parameters in a neural network that determine the strength of connections between neurons.',
    examples: ['Connection weights', 'Learned parameters'],
    relatedTerms: ['bias', 'parameter', 'training']
  }
};

export const quizQuestions = [
  {
    id: 'nn-basics-1',
    module: 'introduction',
    question: 'What is the main inspiration for artificial neural networks?',
    options: [
      'Computer processors',
      'Biological neural networks in the brain',
      'Mathematical equations',
      'Digital circuits'
    ],
    correct: 1,
    explanation: 'Neural networks are inspired by how biological neurons in the brain process and transmit information.'
  },
  {
    id: 'activation-1',
    module: 'fundamentals',
    question: 'Which activation function is most commonly used in hidden layers of deep networks?',
    options: ['Sigmoid', 'ReLU', 'Tanh', 'Linear'],
    correct: 1,
    explanation: 'ReLU is popular because it\'s computationally efficient and helps mitigate the vanishing gradient problem.'
  },
  {
    id: 'training-1',
    module: 'training',
    question: 'What is the primary goal of the training process?',
    options: [
      'Increase network complexity',
      'Minimize the loss function',
      'Add more layers',
      'Reduce training time'
    ],
    correct: 1,
    explanation: 'Training aims to minimize the loss function by adjusting weights and biases to improve predictions.'
  },
  {
    id: 'backprop-1',
    module: 'training',
    question: 'Backpropagation uses which mathematical concept to calculate gradients?',
    options: ['Integration', 'Chain rule', 'Fourier transform', 'Linear algebra'],
    correct: 1,
    explanation: 'Backpropagation uses the chain rule of calculus to compute gradients through the network layers.'
  },
  {
    id: 'unsupervised-1',
    module: 'advanced',
    question: 'What is the main characteristic of unsupervised learning?',
    options: [
      'Uses labeled training data',
      'Requires no training data',
      'Learns patterns without labeled examples',
      'Only works with images'
    ],
    correct: 2,
    explanation: 'Unsupervised learning finds patterns and structures in data without requiring labeled examples or target outputs.'
  }
];

export const practiceExercises = [
  {
    id: 'neuron-calculation',
    module: 'fundamentals',
    title: 'Calculate Neuron Output',
    description: 'Given inputs, weights, and bias, calculate the neuron\'s output',
    type: 'calculation',
    difficulty: 'easy',
    inputs: {
      values: [0.5, 0.8, 0.2],
      weights: [0.4, -0.3, 0.7],
      bias: 0.1,
      activation: 'sigmoid'
    },
    expectedOutput: 0.574,
    hints: [
      'First calculate the weighted sum: Σ(input × weight) + bias',
      'Then apply the sigmoid activation function: 1 / (1 + e^(-x))'
    ]
  },
  {
    id: 'loss-calculation',
    module: 'training',
    title: 'Calculate Loss Function',
    description: 'Calculate Mean Squared Error for given predictions and targets',
    type: 'calculation',
    difficulty: 'easy',
    inputs: {
      predictions: [0.8, 0.3, 0.9, 0.1],
      targets: [1.0, 0.0, 1.0, 0.0],
      lossType: 'mse'
    },
    expectedOutput: 0.055,
    hints: [
      'MSE = (1/n) × Σ(predicted - actual)²',
      'Calculate the squared difference for each prediction-target pair'
    ]
  },
  {
    id: 'gradient-direction',
    module: 'training',
    title: 'Gradient Descent Direction',
    description: 'Determine the direction to update weights based on gradient',
    type: 'multiple-choice',
    difficulty: 'medium',
    question: 'If the gradient of the loss with respect to a weight is +0.5, in which direction should the weight be updated?',
    options: [
      'Increase the weight',
      'Decrease the weight',
      'Keep the weight unchanged',
      'Set the weight to zero'
    ],
    correct: 1,
    explanation: 'In gradient descent, we move in the opposite direction of the gradient to minimize loss.'
  }
];

export const codeExamples = {
  'simple-neuron': {
    title: 'Simple Neuron Implementation',
    language: 'python',
    code: `import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

class SimpleNeuron:
    def __init__(self, num_inputs):
        # Initialize weights randomly
        self.weights = np.random.randn(num_inputs)
        self.bias = np.random.randn()
    
    def forward(self, inputs):
        # Calculate weighted sum
        weighted_sum = np.dot(inputs, self.weights) + self.bias
        # Apply activation function
        output = sigmoid(weighted_sum)
        return output

# Example usage
neuron = SimpleNeuron(3)
inputs = np.array([0.5, 0.8, 0.2])
output = neuron.forward(inputs)
print(f"Neuron output: {output}")`,
    explanation: 'This implements a basic neuron with weighted inputs, bias, and sigmoid activation.',
    module: 'fundamentals'
  },
  'gradient-descent': {
    title: 'Gradient Descent Implementation',
    language: 'python',
    code: `import numpy as np

def gradient_descent(X, y, learning_rate=0.01, epochs=1000):
    # Initialize parameters
    m, n = X.shape
    weights = np.zeros(n)
    bias = 0
    
    for epoch in range(epochs):
        # Forward pass
        predictions = X.dot(weights) + bias
        
        # Calculate loss (MSE)
        loss = np.mean((predictions - y) ** 2)
        
        # Calculate gradients
        dw = (2/m) * X.T.dot(predictions - y)
        db = (2/m) * np.sum(predictions - y)
        
        # Update parameters
        weights -= learning_rate * dw
        bias -= learning_rate * db
        
        if epoch % 100 == 0:
            print(f"Epoch {epoch}, Loss: {loss}")
    
    return weights, bias`,
    explanation: 'Basic gradient descent implementation for linear regression.',
    module: 'training'
  },
  'neural-network': {
    title: 'Simple Neural Network',
    language: 'python',
    code: `import numpy as np

class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        # Initialize weights
        self.W1 = np.random.randn(input_size, hidden_size) * 0.1
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.1
        self.b2 = np.zeros((1, output_size))
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-np.clip(x, -250, 250)))
    
    def forward(self, X):
        # Hidden layer
        self.z1 = X.dot(self.W1) + self.b1
        self.a1 = self.sigmoid(self.z1)
        
        # Output layer
        self.z2 = self.a1.dot(self.W2) + self.b2
        self.a2 = self.sigmoid(self.z2)
        
        return self.a2
    
    def backward(self, X, y, learning_rate):
        m = X.shape[0]
        
        # Output layer gradients
        dz2 = self.a2 - y
        dW2 = self.a1.T.dot(dz2) / m
        db2 = np.sum(dz2, axis=0, keepdims=True) / m
        
        # Hidden layer gradients
        dz1 = dz2.dot(self.W2.T) * self.a1 * (1 - self.a1)
        dW1 = X.T.dot(dz1) / m
        db1 = np.sum(dz1, axis=0, keepdims=True) / m
        
        # Update weights
        self.W2 -= learning_rate * dW2
        self.b2 -= learning_rate * db2
        self.W1 -= learning_rate * dW1
        self.b1 -= learning_rate * db1`,
    explanation: 'Complete neural network with forward and backward propagation.',
    module: 'training'
  }
};

export const resources = {
  books: [
    {
      title: 'Deep Learning',
      author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
      description: 'Comprehensive textbook covering deep learning fundamentals',
      url: 'https://www.deeplearningbook.org/',
      difficulty: 'Advanced'
    },
    {
      title: 'Neural Networks and Deep Learning',
      author: 'Michael Nielsen',
      description: 'Interactive online book with great visualizations',
      url: 'http://neuralnetworksanddeeplearning.com/',
      difficulty: 'Beginner'
    },
    {
      title: 'Pattern Recognition and Machine Learning',
      author: 'Christopher Bishop',
      description: 'Mathematical foundation of machine learning',
      url: 'https://www.microsoft.com/en-us/research/people/cmbishop/',
      difficulty: 'Advanced'
    }
  ],
  courses: [
    {
      title: 'CS231n: Convolutional Neural Networks',
      institution: 'Stanford University',
      description: 'Computer vision and CNNs',
      url: 'http://cs231n.stanford.edu/',
      difficulty: 'Intermediate'
    },
    {
      title: 'Deep Learning Specialization',
      institution: 'Coursera (Andrew Ng)',
      description: 'Comprehensive deep learning course series',
      url: 'https://www.coursera.org/specializations/deep-learning',
      difficulty: 'Beginner'
    },
    {
      title: 'Fast.ai Practical Deep Learning',
      institution: 'fast.ai',
      description: 'Practical approach to deep learning',
      url: 'https://course.fast.ai/',
      difficulty: 'Intermediate'
    }
  ],
  tools: [
    {
      name: 'TensorFlow',
      description: 'Google\'s open-source machine learning framework',
      url: 'https://www.tensorflow.org/',
      type: 'Framework'
    },
    {
      name: 'PyTorch',
      description: 'Facebook\'s dynamic neural network framework',
      url: 'https://pytorch.org/',
      type: 'Framework'
    },
    {
      name: 'Keras',
      description: 'High-level neural networks API',
      url: 'https://keras.io/',
      type: 'API'
    },
    {
      name: 'Jupyter Notebooks',
      description: 'Interactive development environment',
      url: 'https://jupyter.org/',
      type: 'Tool'
    }
  ],
  datasets: [
    {
      name: 'MNIST',
      description: 'Handwritten digits dataset',
      url: 'http://yann.lecun.com/exdb/mnist/',
      type: 'Computer Vision',
      size: '60K training, 10K test'
    },
    {
      name: 'CIFAR-10',
      description: '32x32 color images in 10 classes',
      url: 'https://www.cs.toronto.edu/~kriz/cifar.html',
      type: 'Computer Vision',
      size: '50K training, 10K test'
    },
    {
      name: 'ImageNet',
      description: 'Large-scale image recognition dataset',
      url: 'http://www.image-net.org/',
      type: 'Computer Vision',
      size: '14M images, 1000 classes'
    },
    {
      name: 'IMDB Movie Reviews',
      description: 'Sentiment analysis dataset',
      url: 'https://ai.stanford.edu/~amaas/data/sentiment/',
      type: 'Natural Language',
      size: '50K reviews'
    }
  ]
};

export const achievements = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete the introduction module',
    icon: '🚀',
    points: 50,
    requirement: 'complete-module-introduction'
  },
  {
    id: 'neuron-master',
    title: 'Neuron Master',
    description: 'Understand how neurons work',
    icon: '⚡',
    points: 100,
    requirement: 'complete-section-neuron-structure'
  },
  {
    id: 'architect',
    title: 'Network Architect',
    description: 'Design your first network architecture',
    icon: '🏗️',
    points: 150,
    requirement: 'complete-section-network-architecture'
  },
  {
    id: 'trainer',
    title: 'Neural Network Trainer',
    description: 'Master the training process',
    icon: '📈',
    points: 200,
    requirement: 'complete-module-training'
  },
  {
    id: 'optimizer',
    title: 'Optimization Expert',
    description: 'Understand gradient descent algorithms',
    icon: '🎯',
    points: 250,
    requirement: 'complete-section-gradient-descent'
  },
  {
    id: 'explorer',
    title: 'Pattern Explorer',
    description: 'Discover unsupervised learning',
    icon: '🔍',
    points: 300,
    requirement: 'complete-module-advanced'
  },
  {
    id: 'practitioner',
    title: 'AI Practitioner',
    description: 'Complete all modules',
    icon: '🎓',
    points: 500,
    requirement: 'complete-all-modules'
  }
];

export default {
  courseModules,
  learningPaths,
  glossary,
  quizQuestions,
  practiceExercises,
  codeExamples,
  resources,
  achievements
};