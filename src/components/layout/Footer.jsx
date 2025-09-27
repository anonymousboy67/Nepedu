import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { resources, courseModules } from '../../data/courseContent';

function Footer() {
  const [totalProgress, setTotalProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState(0);
  const [totalSections, setTotalSections] = useState(0);

  useEffect(() => {
    // Calculate overall progress
    const allSections = courseModules.reduce((acc, module) => 
      [...acc, ...module.sections], []
    );
    
    const completed = allSections.filter(section => 
      localStorage.getItem(`completed-${section.id}`) === 'true'
    ).length;
    
    setCompletedSections(completed);
    setTotalSections(allSections.length);
    setTotalProgress((completed / allSections.length) * 100);
  }, []);

  const quickLinks = [
    { 
      title: 'Course Modules',
      links: courseModules.map(module => ({
        name: module.title,
        href: `#${module.sections[0]?.id}`,
        icon: module.icon
      }))
    },
    {
      title: 'Learning Resources',
      links: [
        { name: 'TensorFlow', href: 'https://tensorflow.org', icon: '🔧' },
        { name: 'PyTorch', href: 'https://pytorch.org', icon: '🔥' },
        { name: 'Kaggle', href: 'https://kaggle.com', icon: '📊' },
        { name: 'Papers With Code', href: 'https://paperswithcode.com', icon: '📄' }
      ]
    },
    {
      title: 'Practice',
      links: [
        { name: 'Interactive Demos', href: '#demos', icon: '🎮' },
        { name: 'Code Examples', href: '#code', icon: '💻' },
        { name: 'Quiz Questions', href: '#quiz', icon: '❓' },
        { name: 'Exercises', href: '#exercises', icon: '✏️' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: '📚' },
    { name: 'Twitter', href: 'https://twitter.com', icon: '🐦' },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: '💼' },
    { name: 'Discord', href: 'https://discord.com', icon: '💬' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer 
      className="footer"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        marginTop: '4rem'
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Progress Summary */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
        color: 'white',
        padding: '2rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          textAlign: 'center'
        }}>
          <motion.h3
            style={{ marginBottom: '1rem', fontSize: '1.5rem' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Your Learning Progress
          </motion.h3>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {Math.round(totalProgress)}%
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Complete
              </div>
            </div>
            
            <div style={{
              width: '200px',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'white',
                  borderRadius: '4px'
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${totalProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {completedSections}/{totalSections}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Sections
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 style={{ 
              color: 'var(--primary)', 
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              🧠 DeepLearn Interactive
            </h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Master neural networks through interactive visualizations and hands-on learning. 
              From basic neurons to advanced architectures, build your deep learning expertise step by step.
            </p>
            
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    background: 'var(--surface-light)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'var(--primary)',
                    color: 'white'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Sections */}
          {quickLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 style={{ 
                color: 'var(--accent)', 
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                {section.title}
              </h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                margin: 0
              }}>
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    style={{ marginBottom: '0.75rem' }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
                      style={{
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'color 0.3s ease',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                    >
                      <span>{link.icon}</span>
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          style={{
            background: 'var(--surface-light)',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem'
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ 
                color: 'var(--primary)', 
                marginBottom: '0.5rem',
                fontSize: '1.2rem'
              }}>
                Stay Updated
              </h4>
              <p style={{ 
                color: 'var(--text-secondary)', 
                margin: 0,
                lineHeight: '1.5'
              }}>
                Get notified about new interactive lessons, advanced tutorials, and deep learning breakthroughs.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
              <motion.button
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
                whileHover={{ backgroundColor: 'var(--primary-dark)' }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.9rem' 
          }}>
            © 2024 DeepLearn Interactive. Made with ❤️ for AI learners worldwide.
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a
              href="#privacy"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Terms of Use
            </a>
            
            <motion.button
              onClick={scrollToTop}
              style={{
                background: 'var(--surface-light)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}
              whileHover={{ backgroundColor: 'var(--primary)', color: 'white' }}
              whileTap={{ scale: 0.95 }}
              title="Back to top"
            >
              ↑
            </motion.button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;