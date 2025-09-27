import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Header({ currentSection }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'neurons', label: 'Neurons' },
    { id: 'networks', label: 'Networks' },
    { id: 'training', label: 'Training' },
    { id: 'applications', label: 'Applications' }
  ];

  return (
    <motion.header 
      className={`header ${isScrolled ? 'scrolled' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="nav">
        <div className="logo" onClick={() => scrollToSection('home')}>
          DeepLearn Interactive
        </div>
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`}
                className={`nav-link ${currentSection === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}

export default Header;