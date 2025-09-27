import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { courseModules } from '../../data/courseContent';

function Navigation({ currentSection, onSectionChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState({});
  const [expandedModule, setExpandedModule] = useState(null);

  // Calculate progress for each module
  useEffect(() => {
    const newProgress = {};
    courseModules.forEach(module => {
      const completedSections = module.sections.filter(section => 
        localStorage.getItem(`completed-${section.id}`) === 'true'
      ).length;
      newProgress[module.id] = (completedSections / module.sections.length) * 100;
    });
    setProgress(newProgress);
  }, [currentSection]);

  const toggleNavigation = () => {
    setIsOpen(!isOpen);
  };

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);
    setIsOpen(false);
    
    // Scroll to section
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const markSectionComplete = (sectionId) => {
    localStorage.setItem(`completed-${sectionId}`, 'true');
    // Trigger progress recalculation
    const event = new CustomEvent('sectionCompleted', { detail: { sectionId } });
    window.dispatchEvent(event);
  };

  const isSectionCompleted = (sectionId) => {
    return localStorage.getItem(`completed-${sectionId}`) === 'true';
  };

  return (
    <>
      {/* Navigation Toggle Button */}
      <motion.button
        className="nav-toggle"
        onClick={toggleNavigation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1001,
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        {isOpen ? '✕' : '☰'}
      </motion.button>

      {/* Navigation Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 999
              }}
            />

            {/* Sidebar */}
            <motion.nav
              className="navigation-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '350px',
                height: '100vh',
                background: 'var(--surface)',
                borderRight: '1px solid var(--border)',
                zIndex: 1000,
                overflowY: 'auto',
                padding: '80px 0 20px 0',
                boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ padding: '0 20px' }}>
                <h2 style={{ 
                  color: 'var(--primary)', 
                  marginBottom: '2rem',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  Course Navigation
                </h2>

                {/* Module List */}
                <div className="module-list">
                  {courseModules.map((module, moduleIndex) => (
                    <motion.div
                      key={module.id}
                      className="module-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: moduleIndex * 0.1 }}
                      style={{ marginBottom: '1rem' }}
                    >
                      {/* Module Header */}
                      <div
                        className="module-header"
                        onClick={() => toggleModule(module.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem',
                          background: 'var(--surface-light)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: `2px solid ${module.color}20`,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
                            {module.icon}
                          </span>
                          <div>
                            <h3 style={{ 
                              color: module.color, 
                              margin: 0,
                              fontSize: '1.1rem',
                              fontWeight: '600'
                            }}>
                              {module.title}
                            </h3>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '1rem',
                              marginTop: '0.25rem'
                            }}>
                              <span style={{ 
                                color: 'var(--text-secondary)', 
                                fontSize: '0.8rem'
                              }}>
                                {module.duration} • {module.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ 
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            marginBottom: '0.25rem'
                          }}>
                            {Math.round(progress[module.id] || 0)}%
                          </span>
                          <div style={{
                            width: '60px',
                            height: '4px',
                            background: 'var(--surface)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${progress[module.id] || 0}%`,
                              height: '100%',
                              background: module.color,
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                        </div>
                      </div>

                      {/* Section List */}
                      <AnimatePresence>
                        {expandedModule === module.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ paddingTop: '0.5rem' }}>
                              {module.sections.map((section, sectionIndex) => (
                                <motion.div
                                  key={section.id}
                                  className="section-item"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: sectionIndex * 0.05 }}
                                  onClick={() => handleSectionClick(section.id)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    marginLeft: '1rem',
                                    marginBottom: '0.5rem',
                                    background: currentSection === section.id ? 
                                      `${module.color}20` : 'transparent',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    border: currentSection === section.id ? 
                                      `2px solid ${module.color}` : '2px solid transparent',
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  <div>
                                    <h4 style={{ 
                                      color: currentSection === section.id ? 
                                        module.color : 'var(--text-primary)',
                                      margin: 0,
                                      fontSize: '0.9rem',
                                      fontWeight: '500'
                                    }}>
                                      {section.title}
                                    </h4>
                                    <p style={{ 
                                      color: 'var(--text-secondary)', 
                                      margin: '0.25rem 0 0 0',
                                      fontSize: '0.8rem',
                                      lineHeight: '1.3'
                                    }}>
                                      {section.description}
                                    </p>
                                  </div>
                                  
                                  {isSectionCompleted(section.id) && (
                                    <span style={{ 
                                      color: '#10b981',
                                      fontSize: '1.2rem'
                                    }}>
                                      ✓
                                    </span>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div style={{ 
                  marginTop: '2rem',
                  padding: '1rem',
                  background: 'var(--surface-light)',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ 
                    color: 'var(--accent)', 
                    marginBottom: '1rem',
                    fontSize: '1rem'
                  }}>
                    Quick Actions
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Reset Progress
                    </button>
                    
                    <button
                      onClick={() => {
                        const totalSections = courseModules.reduce((acc, module) => 
                          acc + module.sections.length, 0
                        );
                        const completedSections = courseModules.reduce((acc, module) => 
                          acc + module.sections.filter(section => 
                            isSectionCompleted(section.id)
                          ).length, 0
                        );
                        alert(`Progress: ${completedSections}/${totalSections} sections completed`);
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      View Progress
                    </button>
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;