import React from 'react';
import { motion } from 'framer-motion';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  className = '',
  style = {},
  ...props 
}) {
  
  const variants = {
    primary: {
      background: 'var(--primary)',
      color: 'white',
      border: '2px solid var(--primary)',
      hover: {
        background: 'var(--primary-dark)',
        borderColor: 'var(--primary-dark)'
      }
    },
    secondary: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '2px solid var(--primary)',
      hover: {
        background: 'var(--primary)',
        color: 'white'
      }
    },
    accent: {
      background: 'var(--accent)',
      color: 'white',
      border: '2px solid var(--accent)',
      hover: {
        background: 'var(--accent-dark)',
        borderColor: 'var(--accent-dark)'
      }
    },
    success: {
      background: '#10b981',
      color: 'white',
      border: '2px solid #10b981',
      hover: {
        background: '#059669',
        borderColor: '#059669'
      }
    },
    danger: {
      background: '#ef4444',
      color: 'white',
      border: '2px solid #ef4444',
      hover: {
        background: '#dc2626',
        borderColor: '#dc2626'
      }
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '2px solid transparent',
      hover: {
        background: 'var(--surface-light)',
        borderColor: 'var(--border)'
      }
    }
  };

  const sizes = {
    small: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      borderRadius: '6px'
    },
    medium: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      borderRadius: '8px'
    },
    large: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      borderRadius: '10px'
    }
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.medium;

  const buttonStyle = {
    ...currentSize,
    background: disabled ? 'var(--surface-light)' : currentVariant.background,
    color: disabled ? 'var(--text-secondary)' : currentVariant.color,
    border: disabled ? '2px solid var(--border)' : currentVariant.border,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    ...style
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <motion.button
      className={`button ${className}`}
      style={buttonStyle}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={
        !disabled && !loading ? {
          ...currentVariant.hover,
          scale: 1.02
        } : {}
      }
      whileTap={
        !disabled && !loading ? {
          scale: 0.98
        } : {}
      }
      {...props}
    >
      {loading && (
        <motion.div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%'
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
      
      {!loading && children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
    </motion.button>
  );
}

// Button Group Component
export function ButtonGroup({ 
  children, 
  orientation = 'horizontal',
  spacing = '0.5rem',
  className = '',
  style = {}
}) {
  const groupStyle = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: spacing,
    ...style
  };

  return (
    <div className={`button-group ${className}`} style={groupStyle}>
      {children}
    </div>
  );
}

// Icon Button Component
export function IconButton({
  icon,
  size = 'medium',
  variant = 'ghost',
  tooltip,
  ...props
}) {
  const iconSizes = {
    small: { width: '32px', height: '32px', fontSize: '1rem' },
    medium: { width: '40px', height: '40px', fontSize: '1.25rem' },
    large: { width: '48px', height: '48px', fontSize: '1.5rem' }
  };

  const iconSize = iconSizes[size] || iconSizes.medium;

  return (
    <Button
      variant={variant}
      style={{
        ...iconSize,
        padding: 0,
        borderRadius: '50%'
      }}
      title={tooltip}
      {...props}
    >
      {icon}
    </Button>
  );
}

export default Button;