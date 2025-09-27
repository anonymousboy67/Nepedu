import React from 'react';
import { motion } from 'framer-motion';

function Card({
  children,
  variant = 'default',
  padding = 'medium',
  elevation = 'medium',
  interactive = false,
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  style = {},
  ...props
}) {
  
  const variants = {
    default: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      color: 'var(--text-primary)'
    },
    elevated: {
      background: 'var(--surface)',
      border: 'none',
      color: 'var(--text-primary)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    outlined: {
      background: 'transparent',
      border: '2px solid var(--border)',
      color: 'var(--text-primary)'
    },
    filled: {
      background: 'var(--surface-light)',
      border: '1px solid var(--border)',
      color: 'var(--text-primary)'
    },
    gradient: {
      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
      border: 'none',
      color: 'white'
    }
  };

  const paddings = {
    none: '0',
    small: '1rem',
    medium: '1.5rem',
    large: '2rem',
    xlarge: '2.5rem'
  };

  const elevations = {
    none: 'none',
    small: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.1)',
    large: '0 8px 24px rgba(0, 0, 0, 0.12)',
    xlarge: '0 16px 40px rgba(0, 0, 0, 0.15)'
  };

  const currentVariant = variants[variant] || variants.default;
  const currentPadding = paddings[padding] || paddings.medium;
  const currentElevation = elevations[elevation] || elevations.medium;

  const cardStyle = {
    ...currentVariant,
    padding: currentPadding,
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    cursor: clickable || onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  // Add elevation if not gradient variant
  if (variant !== 'gradient') {
    cardStyle.boxShadow = currentElevation;
  }

  const motionProps = {
    className: `card ${className}`,
    style: cardStyle,
    onClick: clickable || onClick ? onClick : undefined,
    ...props
  };

  // Add hover and tap animations if interactive
  if (interactive || hoverable || clickable) {
    motionProps.whileHover = {
      scale: 1.02,
      boxShadow: elevations.large,
      transition: { duration: 0.2 }
    };
  }

  if (interactive || clickable) {
    motionProps.whileTap = {
      scale: 0.98,
      transition: { duration: 0.1 }
    };
  }

  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  );
}

// Card Header Component
export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className = '',
  style = {}
}) {
  return (
    <div 
      className={`card-header ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {icon && (
          <div style={{ 
            fontSize: '1.5rem',
            color: 'var(--primary)'
          }}>
            {icon}
          </div>
        )}
        <div>
          {title && (
            <h3 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}

// Card Body Component
export function CardBody({
  children,
  className = '',
  style = {}
}) {
  return (
    <div 
      className={`card-body ${className}`}
      style={{
        flex: 1,
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Card Footer Component
export function CardFooter({
  children,
  align = 'right',
  className = '',
  style = {}
}) {
  const alignments = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    between: 'space-between',
    around: 'space-around'
  };

  return (
    <div 
      className={`card-footer ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: alignments[align] || alignments.right,
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)',
        gap: '0.75rem',
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Stat Card Component
export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  trend,
  className = '',
  ...props
}) {
  const changeColors = {
    positive: '#10b981',
    negative: '#ef4444',
    neutral: 'var(--text-secondary)'
  };

  return (
    <Card 
      className={`stat-card ${className}`}
      hoverable
      {...props}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          fontWeight: '500'
        }}>
          {title}
        </div>
        {icon && (
          <div style={{
            fontSize: '1.25rem',
            color: 'var(--primary)'
          }}>
            {icon}
          </div>
        )}
      </div>
      
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
        marginBottom: '0.5rem'
      }}>
        {value}
      </div>
      
      {change && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.875rem',
          color: changeColors[changeType]
        }}>
          <span>
            {changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→'}
          </span>
          {change}
        </div>
      )}
      
      {trend && (
        <div style={{ marginTop: '1rem' }}>
          {trend}
        </div>
      )}
    </Card>
  );
}

// Feature Card Component
export function FeatureCard({
  icon,
  title,
  description,
  features = [],
  action,
  className = '',
  ...props
}) {
  return (
    <Card 
      className={`feature-card ${className}`}
      hoverable
      padding="large"
      {...props}
    >
      {icon && (
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {icon}
        </div>
      )}
      
      <CardHeader
        title={title}
        style={{ textAlign: 'center', marginBottom: '1rem' }}
      />
      
      <CardBody>
        {description && (
          <p style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            {description}
          </p>
        )}
        
        {features.length > 0 && (
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {features.map((feature, index) => (
              <li key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem'
              }}>
                <span style={{ color: 'var(--success)' }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </CardBody>
      
      {action && (
        <CardFooter align="center">
          {action}
        </CardFooter>
      )}
    </Card>
  );
}

export default Card;