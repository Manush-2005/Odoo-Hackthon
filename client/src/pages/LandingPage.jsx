import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/landing.css';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Chip,
  Rating,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  Paper,
  Stack,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  PlayArrow,
  CheckCircle,
  TrendingUp,
  Speed,
  Security,
  Groups,
  Hub as Integration,
  Analytics,
  CloudUpload,
  Star,
  ArrowForward,
  GetApp,
  Rocket,
  AutoAwesome,
  Verified,
  Business,
  AccountBalance,
  Assessment,
  Timeline,
  WorkspacePremium,
  ExpandMore,
  Language,
  Phone,
  Email,
  Home,
  FolderOpen,
  Forum,
  Mail,
  ChevronRight
} from '@mui/icons-material';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);
  const [activeSection, setActiveSection] = useState('hero');
  
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Check if currently on home page
  const isHomePage = location.pathname === '/' || location.pathname === '';

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Only detect active sections on home page
    const handleScrollForActiveSection = () => {
      if (!isHomePage) return;
      
      const sections = ['hero', 'apps', 'industries', 'testimonials', 'contact'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offset = 100;
          
          if (rect.top <= offset && rect.bottom >= offset) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScrollForActiveSection);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollForActiveSection);
    };
  }, [isHomePage]);

  // Enhanced body scroll lock for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Navigation items matching Odoo structure
  const navItems = [
    { name: 'Apps', path: 'apps', id: 'apps', icon: FolderOpen, hasDropdown: true },
    { name: 'Industries', path: 'industries', id: 'industries', icon: Business, hasDropdown: true },
    { name: 'Services', path: 'services', id: 'services', icon: Forum, hasDropdown: true },
    { name: 'Community', path: 'community', id: 'community', icon: Groups, hasDropdown: true }
  ];

  // Handle navigation for both home and non-home pages
  const handleNavigation = (e, path) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const sectionId = path.replace('#', '');
    
    if (isHomePage) {
      // If already on home page, just scroll to the section
      if (sectionId === 'hero' || sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        scrollToSection(sectionId);
      }
    } else {
      // If on another page, navigate to home page then scroll to section
      navigate('/');
      // Store the section to scroll to after navigation
      sessionStorage.setItem('scrollToSection', sectionId);
    }
  };

  useEffect(() => {
    if (isHomePage) {
      // Check if we need to scroll to a section after navigation
      const scrollTarget = sessionStorage.getItem('scrollToSection');
      if (scrollTarget) {
        sessionStorage.removeItem('scrollToSection');
        if (scrollTarget === 'hero' || scrollTarget === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          scrollToSection(scrollTarget);
        }
      } else if (location.hash) {
        // Handle direct URL with hash
        const hashTarget = location.hash.replace('#', '');
        if (hashTarget === 'hero' || hashTarget === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          scrollToSection(hashTarget);
        }
      }
    }
  }, [isHomePage, location]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  // Helper function for scrolling to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Hero stats from screenshots
  const heroStats = [
    { value: '12M+', label: 'Users Worldwide', color: '#714B67' },
    { value: '40+', label: 'Integrated Apps', color: '#2563eb' },
    { value: '150+', label: 'Countries', color: '#059669' },
    { value: '99.9%', label: 'Uptime SLA', color: '#dc2626' }
  ];

  // Industry solutions
  const industries = [
    {
      name: 'Manufacturing',
      description: 'End-to-end manufacturing solutions',
      image: '/images/speed_1.webp',
      apps: ['MRP', 'Quality', 'Maintenance', 'PLM']
    },
    {
      name: 'Retail & E-commerce',
      description: 'Omnichannel retail management',
      image: '/images/speed_3.webp',
      apps: ['POS', 'Inventory', 'Website', 'Accounting']
    },
    {
      name: 'Professional Services',
      description: 'Project-based business management',
      image: '/images/speed_4.webp',
      apps: ['Project', 'Timesheet', 'Helpdesk', 'Expenses']
    }
  ];

  // Customer testimonials
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO',
      company: 'TechFlow Inc.',
      rating: 5,
      text: 'ExpenseHub transformed our financial operations. The automation saved us 40+ hours per week and improved accuracy by 95%.',
      avatar: '/images/users_01.webp',
      logo: '/images/kpmg_logo.svg'
    },
    {
      name: 'Michael Chen',
      role: 'Operations Director',
      company: 'Global Dynamics',
      rating: 5,
      text: 'The integration capabilities are outstanding. All our systems work seamlessly together now.',
      avatar: '/images/users_02.webp',
      logo: '/images/kpmg_logo.svg'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Finance Manager', 
      company: 'InnovateCorp',
      rating: 5,
      text: 'Best investment we made this year. ROI was evident within the first month of implementation.',
      avatar: '/images/users_01.webp',
      logo: '/images/kpmg_logo.svg'
    }
  ];

  // Company logos for carousel
  const trustedCompanies = [
    {
      name: 'KPMG',
      logo: '/images/kpmg_logo.svg',
      industry: 'Professional Services',
      description: 'Global consulting and audit firm'
    },
    {
      name: 'TechFlow Inc.',
      logo: '/images/odoo_logo.svg',
      industry: 'Technology',
      description: 'Leading software solutions provider'
    },
    {
      name: 'Global Dynamics',
      logo: '/images/kpmg_logo.svg',
      industry: 'Manufacturing',
      description: 'International manufacturing corporation'
    },
    {
      name: 'InnovateCorp',
      logo: '/images/odoo_logo.svg',
      industry: 'Innovation',
      description: 'Cutting-edge technology innovator'
    },
    {
      name: 'Enterprise Solutions',
      logo: '/images/kpmg_logo.svg',
      industry: 'Enterprise Software',
      description: 'Business automation specialists'
    },
    {
      name: 'Future Systems',
      logo: '/images/odoo_logo.svg',
      industry: 'AI & Automation',
      description: 'Next-generation business solutions'
    },
    {
      name: 'Digital Dynamics',
      logo: '/images/kpmg_logo.svg',
      industry: 'Digital Transformation',
      description: 'Digital transformation leaders'
    },
    {
      name: 'Smart Solutions',
      logo: '/images/odoo_logo.svg',
      industry: 'Smart Technology',
      description: 'Intelligent business solutions'
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const scaleOnHover = {
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Box sx={{ overflow: 'hidden', background: 'var(--odoo-gradient-surface)' }}>
      {/* Modern Animated Navigation Header */}
      <Box 
        component="header" 
        sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1300,
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <motion.nav
          ref={navbarRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            marginTop: scrolled ? (isMobile ? '8px' : '16px') : '0px',
            padding: scrolled 
              ? (isMobile ? '6px 12px' : isTablet ? '8px 16px' : '8px 16px')
              : (isMobile ? '12px 16px' : isTablet ? '16px 20px' : '20px 24px'),
            width: scrolled 
              ? (isMobile ? '95%' : isTablet ? '92%' : '90%') 
              : '100%',
            maxWidth: scrolled 
              ? (isMobile ? '600px' : isTablet ? '900px' : '1300px') 
              : (isMobile ? '100%' : isTablet ? '100%' : '1520px'),
            backgroundColor: scrolled 
              ? 'rgba(255, 255, 255, 0.95)' 
              : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            boxShadow: scrolled 
              ? '0 10px 40px rgba(113, 75, 103, 0.15)' 
              : 'none',
            border: scrolled 
              ? '1px solid rgba(113, 75, 103, 0.1)' 
              : 'none',
            borderRadius: scrolled ? (isMobile ? '16px' : isTablet ? '18px' : '22px') : '0px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Enhanced Logo Section */}
            <motion.div
              onClick={() => navigate('/')}
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                position: 'relative' 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glowing background effect */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: '-8px',
                  borderRadius: '50%',
                  opacity: 0.2
                }}
                animate={{
                  background: [
                    "radial-gradient(circle, #714B67 0%, transparent 70%)",
                    "radial-gradient(circle, #8B5A7A 0%, transparent 70%)",
                    "radial-gradient(circle, #9A6B8C 0%, transparent 70%)",
                    "radial-gradient(circle, #714B67 0%, transparent 70%)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Animated logo container */}
              <motion.div
                style={{
                  position: 'relative',
                  borderRadius: '50%',
                  backgroundColor: scrolled ? 'rgba(113, 75, 103, 0.3)' : 'transparent',
                  padding: scrolled ? '6px' : '0px',
                  transition: 'all 0.5s ease'
                }}
                animate={{
                  boxShadow: [
                    "0 0 0px 0px rgba(113,75,103,0)",
                    "0 0 15px 3px rgba(113,75,103,0.3)",
                    "0 0 20px 5px rgba(139,92,122,0.2)",
                    "0 0 15px 3px rgba(113,75,103,0.3)",
                    "0 0 0px 0px rgba(113,75,103,0)"
                  ]
                }}
                transition={{
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Rotating ring effect */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px solid rgba(113, 75, 103, 0.3)'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                <Box
                  component="img"
                  src="/logo.png"
                  alt="ExpenseHub Logo"
                  sx={{ 
                    height: scrolled 
                      ? (isMobile ? 24 : isTablet ? 26 : 28)
                      : (isMobile ? 30 : isTablet ? 34 : 36),
                    width: scrolled 
                      ? (isMobile ? 24 : isTablet ? 26 : 28)
                      : (isMobile ? 30 : isTablet ? 34 : 36),
                    transition: 'all 0.5s ease',
                    position: 'relative',
                    zIndex: 10,
                    filter: 'drop-shadow(0 4px 12px rgba(113, 75, 103, 0.25))'
                  }}
                />
                
                {/* Pulse particles */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#714B67',
                    borderRadius: '50%'
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '4px',
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#8B5A7A',
                    borderRadius: '50%'
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 1
                  }}
                />
              </motion.div>

              {/* Animated text */}
              <Box sx={{ 
                ml: 2, 
                display: isSmallMobile ? 'none' : 'flex', 
                alignItems: 'center', 
                position: 'relative' 
              }}>
                {/* Text shadow effect */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, #714B67, #8B5A7A)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'blur(1px)',
                    opacity: 0.5
                  }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: 'Caveat, cursive',
                      fontWeight: 700,
                      fontSize: scrolled 
                        ? (isMobile ? '1.2rem' : isTablet ? '1.3rem' : '1.5rem')
                        : (isMobile ? '1.4rem' : isTablet ? '1.6rem' : '1.75rem'),
                      lineHeight: 1.4,
                      transition: 'all 0.5s ease'
                    }}
                  >
                    ExpenseHub
                  </Typography>
                </motion.div>
                
                {/* Main text with floating letters */}
                <Box sx={{ position: 'relative', zIndex: 10 }}>
                  {"ExpenseHub".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      style={{
                        display: "inline-block",
                        background: scrolled ? 'unset' : '#fff',
                        backgroundClip: scrolled ? 'unset' : '#fff',
                        WebkitBackgroundClip: scrolled ? 'unset' : 'text',
                        WebkitTextFillColor: scrolled ? 'unset' : '#fff',
                        color: scrolled ? '#714B67' : '#fff',
                        fontFamily: 'Caveat, cursive',
                        fontWeight: 700,
                        fontSize: scrolled 
                          ? (isMobile ? '1.2rem' : isTablet ? '1.3rem' : '1.5rem')
                          : (isMobile ? '1.4rem' : isTablet ? '1.6rem' : '1.75rem'),
                        lineHeight: 1.4,
                        transition: 'all 0.5s ease'
                      }}
                      animate={{ 
                        y: [0, -3, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.1
                      }}
                      whileHover={{
                        scale: 1.2,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </Box>
                
                {/* Sparkle effects */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    color: scrolled ? '#714B67' : '#fff',
                    fontSize: '12px'
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 1.5
                  }}
                >
                  ✨
                </motion.div>
              </Box>
            </motion.div>

            {/* Desktop Menu */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={(e) => handleNavigation(e, item.path)}
                        endIcon={item.hasDropdown ? <ExpandMore sx={{ fontSize: 16 }} /> : null}
                        startIcon={<IconComponent sx={{ fontSize: 16 }} />}
                        sx={{
                          color: activeSection === item.id 
                            ? '#714B67' 
                            : (scrolled ? '#2D3748' : '#e5e7eb'),
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          textTransform: 'none',
                          px: 3,
                          py: 1.5,
                          borderRadius: '50px',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                          backgroundColor: activeSection === item.id 
                            ? 'rgba(113, 75, 103, 0.1)' 
                            : 'transparent',
                          border: activeSection === item.id 
                            ? '1px solid rgba(113, 75, 103, 0.3)' 
                            : '1px solid transparent',
                          '&:hover': {
                            color: '#714B67',
                            backgroundColor: 'rgba(113, 75, 103, 0.15)',
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        {item.name}
                      </Button>
                    </motion.div>
                  );
                })}
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.98 }}
                  style={{ marginLeft: '8px' }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/signin')}
                    sx={{
                      borderColor: scrolled ? '#714B67' : 'rgba(229, 231, 235, 0.8)',
                      color: scrolled ? '#714B67' : '#e5e7eb',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      textTransform: 'none',
                      letterSpacing: '0.02em',
                      px: 3,
                      py: 1,
                      borderRadius: '50px',
                      borderWidth: 1.5,
                      '&:hover': {
                        borderColor: '#714B67',
                        backgroundColor: 'rgba(113, 75, 103, 0.1)',
                        borderWidth: 1.5,
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Sign In
                  </Button>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.98 }}
                  style={{ marginLeft: '8px' }}
                >
                  <Button
                    variant="contained"
                    onClick={() => navigate('/signup')}
                    sx={{
                      background: 'linear-gradient(90deg, #714B67, #8B5A7A)',
                      color: 'white',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      textTransform: 'none',
                      letterSpacing: '0.02em',
                      px: 4,
                      py: 1.2,
                      borderRadius: '50px',
                      boxShadow: '0 4px 20px rgba(113, 75, 103, 0.2)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #5A3A52, #714B67)',
                        boxShadow: '0 8px 25px rgba(113, 75, 103, 0.3)'
                      }
                    }}
                  >
                    Start Free Trial
                  </Button>
                </motion.div>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={toggleMobileMenu}
                sx={{ 
                  color: scrolled ? '#2D3748' : '#e5e7eb',
                  p: 1.5,
                  borderRadius: '50%',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: scrolled 
                      ? 'rgba(113, 75, 103, 0.1)' 
                      : 'rgba(75, 85, 99, 0.5)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}
          </Box>
        </motion.nav>
      </Box>

      {/* Mobile Menu - Redesigned with modern styling */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <Box 
              sx={{
                position: 'fixed',
                inset: 0,
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 1299
              }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                top: '80px',
                left: '16px',
                right: '16px',
                zIndex: 1300
              }}
            >
              <Box sx={{
                bgcolor: 'rgba(17, 25, 40, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                border: '1px solid rgba(75, 85, 99, 0.5)'
              }}>
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(75, 85, 99, 0.5)' }}>
                  <Typography sx={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    background: 'linear-gradient(90deg, #714B67, #8B5A7A)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Navigation
                  </Typography>
                </Box>

                <Box sx={{ p: 2 }}>
                  {navItems.map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Button
                          fullWidth
                          onClick={(e) => handleNavigation(e, item.path)}
                          startIcon={<IconComponent sx={{ fontSize: 18 }} />}
                          endIcon={activeSection === item.id ? <ChevronRight sx={{ fontSize: 18 }} /> : null}
                          sx={{
                            justifyContent: 'flex-start',
                            color: activeSection === item.id ? '#714B67' : '#e5e7eb',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '16px',
                            textTransform: 'none',
                            py: 1.5,
                            px: 2,
                            mb: 1,
                            borderRadius: '8px',
                            backgroundColor: activeSection === item.id 
                              ? 'rgba(113, 75, 103, 0.3)' 
                              : 'transparent',
                            border: activeSection === item.id 
                              ? '1px solid rgba(113, 75, 103, 0.3)' 
                              : '1px solid transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(75, 85, 99, 0.5)'
                            }
                          }}
                        >
                          {item.name}
                        </Button>
                      </motion.div>
                    );
                  })}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(75, 85, 99, 0.5)' }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/signup');
                      }}
                      sx={{
                        background: 'linear-gradient(90deg, #714B67, #8B5A7A)',
                        color: 'white',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px',
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(113, 75, 103, 0.2)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #5A3A52, #714B67)',
                          boxShadow: '0 8px 25px rgba(113, 75, 103, 0.3)'
                        }
                      }}
                    >
                      Start Free Trial
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section - Based on landing1.png */}
      <Box
        component={motion.section}
        style={{ y: heroY, opacity: heroOpacity }}
        id="hero"
        sx={{
          minHeight: '100vh',
          background: 'var(--odoo-gradient-primary)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/images/bg_yellow.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.05,
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: 12 }}>
          <Grid container spacing={8} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} lg={6}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                    <Chip
                      icon={<AutoAwesome sx={{ color: '#fbbf24' }} />}
                      label="✨ New: AI-Powered Analytics"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        color: '#fff',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        fontSize: '14px'
                      }}
                    />
                    <Chip
                      label="Free 14-Day Trial"
                      sx={{
                        backgroundColor: '#10b981',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '14px'
                      }}
                    />
                  </Stack>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontFamily: 'Caveat, cursive',
                      fontWeight: 700,
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                      color: '#fff',
                      mb: 3,
                      textShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                  >
                    Grow Your Business
                    <Box component="span" sx={{ 
                      display: 'block',
                      background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mt: 1
                    }}>
                      With Integrated Apps
                    </Box>
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      lineHeight: 1.6,
                      color: 'rgba(255, 255, 255, 0.95)',
                      mb: 5,
                      maxWidth: '580px'
                    }}
                  >
                    The only platform you'll ever need to help run your business: 
                    integrated apps, kept simple, and loved by millions of happy users.
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={3} 
                    sx={{ mb: 6 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Rocket />}
                        onClick={() => navigate('/signup')}
                        sx={{
                          backgroundColor: '#fff',
                          color: '#714B67',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textTransform: 'none',
                          letterSpacing: '0.02em',
                          px: 6,
                          py: 2.5,
                          borderRadius: 3,
                          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                          '&:hover': {
                            backgroundColor: '#f8f9fa',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 18px 40px rgba(0, 0, 0, 0.25)'
                          }
                        }}
                      >
                        Start Now - It's Free
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<PlayArrow />}
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.8)',
                          color: '#fff',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textTransform: 'none',
                          letterSpacing: '0.02em',
                          px: 6,
                          py: 2.5,
                          borderRadius: 3,
                          borderWidth: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderColor: '#fff',
                            borderWidth: 2,
                            transform: 'translateY(-3px)'
                          }
                        }}
                      >
                        Schedule Demo
                      </Button>
                    </motion.div>
                  </Stack>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div variants={fadeInUp}>
                  <Stack direction="row" spacing={4} flexWrap="wrap" sx={{ mb: 6 }}>
                    {[
                      { icon: <CheckCircle />, text: 'No setup fees' },
                      { icon: <Verified />, text: 'No credit card required' },
                      { icon: <Star />, text: 'Cancel anytime' }
                    ].map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: '#4ade80', fontSize: 18 }}>
                          {item.icon}
                        </Box>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: 500 }}>
                          {item.text}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </motion.div>

                {/* Hero Stats */}
                <motion.div variants={fadeInUp}>
                  <Grid container spacing={3}>
                    {heroStats.map((stat, index) => (
                      <Grid item xs={6} md={3} key={index}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography
                              variant="h4"
                              sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: { xs: '1.25rem', md: '1.5rem' },
                                lineHeight: 1.4,
                                color: '#fbbf24',
                                textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                              }}
                            >
                              {stat.value}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontWeight: 500,
                                fontSize: '13px'
                              }}
                            >
                              {stat.label}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </motion.div>
            </Grid>

            {/* Right Image */}
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 400, md: 600 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Main Dashboard Image */}
                  <motion.div
                    variants={floatingAnimation}
                    animate="animate"
                  >
                    <Box
                      component="img"
                      src="/images/landing/landing1.png"
                      alt="ExpenseHub Dashboard"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: 800,
                        filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))',
                        borderRadius: 3
                      }}
                    />
                  </motion.div>
                  
                  {/* Floating Stats Cards */}
                  <motion.div
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 3, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    style={{
                      position: 'absolute',
                      top: '10%',
                      right: '-8%'
                    }}
                  >
                    <Paper
                      elevation={20}
                      sx={{
                        p: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        minWidth: 180
                      }}
                    >
                      <Stack spacing={1} alignItems="center">
                        <TrendingUp sx={{ color: '#10b981', fontSize: 36 }} />
                        <Typography variant="h4" sx={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 900,
                          fontSize: '1.5rem',
                          lineHeight: 1.4,
                          color: '#714B67'
                        }}>
                          +47%
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                          color: '#6b7280', 
                          textAlign: 'center' 
                        }}>
                          Efficiency Boost
                        </Typography>
                      </Stack>
                    </Paper>
                  </motion.div>

                  <motion.div
                    animate={{ 
                      y: [0, 25, 0],
                      x: [0, 10, 0]
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 2
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '10%',
                      left: '-12%'
                    }}
                  >
                    <Paper
                      elevation={20}
                      sx={{
                        p: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        minWidth: 200
                      }}
                    >
                      <Stack spacing={1} alignItems="center">
                        <Assessment sx={{ color: '#714B67', fontSize: 36 }} />
                        <Typography variant="h4" sx={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: '1.5rem',
                          lineHeight: 1.4,
                          color: '#714B67'
                        }}>
                          $24,750
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                          color: '#6b7280', 
                          textAlign: 'center' 
                        }}>
                          Monthly Savings
                        </Typography>
                      </Stack>
                    </Paper>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Decorative Elements */}
        {[
          { src: '/images/arrow_doodle_1.svg', style: { top: '20%', left: '5%', width: 60, opacity: 0.3 } },
          { src: '/images/fireworks_01a.svg', style: { top: '30%', right: '8%', width: 80, opacity: 0.4 } },
          { src: '/images/circle.svg', style: { bottom: '25%', left: '3%', width: 40, opacity: 0.2 } }
        ].map((item, index) => (
          <motion.div
            key={index}
            animate={{ 
              y: [0, -15, 0], 
              rotate: [0, 360, 0] 
            }}
            transition={{ 
              duration: 20 + index * 3, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ position: 'absolute', ...item.style, zIndex: 1 }}
          >
            <Box
              component="img"
              src={item.src}
              sx={{ width: '100%', height: 'auto' }}
            />
          </motion.div>
        ))}
      </Box>

      {/* Business Apps Section - Based on landing2.png */}
      <Box
        component="section"
        id="apps"
        sx={{
          py: 12,
          backgroundColor: '#fff',
          position: 'relative'
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Box sx={{ textAlign: 'center', mb: 12 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: 'Caveat, cursive',
                    fontWeight: 700,
                    fontSize: { xs: '3rem', md: '4.5rem' },
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    color: 'black',
                    mb: 2,
                    position: 'relative',
                    display: 'inline-block',
                    transform: 'rotate(-1deg)'
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      position: 'relative',
                      display: 'inline-block',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) scale(1.3)',
                        width: 200,
                        height: 46,
                        backgroundImage: 'url("/images/blue_highlight_bold_03.svg")',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        zIndex: -1,
                        opacity: 0.9
                      }
                    }}
                  >
                    All technology
                  </Box>
                  {' '}in one platform
                </Typography>
              </Box>
            </motion.div>

            {/* 7-Item Platform Grid - Exact Reference Implementation */}
            <motion.div variants={fadeInUp}>
              <Box 
                sx={{ 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                  borderRadius: 6,
                  p: { xs: 4, md: 8 },
                  position: 'relative',
                  maxWidth: 1200,
                  mx: 'auto'
                }}
              >
                {/* Top Row - 4 items */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                    gap: { xs: 4, md: 6 },
                    mb: { xs: 4, md: 6 },
                    justifyItems: 'center'
                  }}
                >
                  {/* Workshop */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: { xs: 100, md: 140 },
                          height: { xs: 100, md: 140 },
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: '2px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          mx: 'auto',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          component="img"
                          src="/images/device_shopfloor.webp"
                          alt="Workshop"
                          sx={{
                            width: '90%',
                            height: '90%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          color: '#1f2937'
                        }}
                      >
                        Workshop
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* Expense report */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: { xs: 100, md: 140 },
                          height: { xs: 100, md: 140 },
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: '2px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          mx: 'auto',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          component="img"
                          src="/images/device_expenses.webp"
                          alt="Expense report"
                          sx={{
                            width: '90%',
                            height: '90%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          color: '#1f2937'
                        }}
                      >
                        Expense report
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* POS system */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: { xs: 100, md: 140 },
                          height: { xs: 100, md: 140 },
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: '2px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          mx: 'auto',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          component="img"
                          src="/images/device_pos.webp"
                          alt="POS system"
                          sx={{
                            width: '90%',
                            height: '90%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          color: '#1f2937'
                        }}
                      >
                        POS system
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* IoT */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: { xs: 100, md: 140 },
                          height: { xs: 100, md: 140 },
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: '2px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          mx: 'auto',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          component="img"
                          src="/images/device_iot.webp"
                          alt="IoT"
                          sx={{
                            width: '90%',
                            height: '90%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          color: '#1f2937'
                        }}
                      >
                        IoT
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>

                {/* Bottom Row - 3 items centered */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                    gap: { xs: 4, md: 6 },
                    justifyItems: 'center',
                    maxWidth: { xs: '100%', md: 600 },
                    mx: 'auto'
                  }}
                >
                  {/* Reception */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: { xs: 100, md: 140 },
                          height: { xs: 100, md: 140 },
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: '2px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          mx: 'auto',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          component="img"
                          src="/images/device_frontdesk.webp"
                          alt="Reception"
                          sx={{
                            width: '90%',
                            height: '90%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          color: '#1f2937'
                        }}
                      >
                        Reception
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* Warehouse */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: { xs: 100, md: 140 },
                          height: { xs: 100, md: 140 },
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: '2px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          mx: 'auto',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          component="img"
                          src="/images/device_inventory.webp"
                          alt="Warehouse"
                          sx={{
                            width: '90%',
                            height: '90%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          color: '#1f2937'
                        }}
                      >
                        Warehouse
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* Kiosk */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    sx={{ gridColumn: { xs: 'span 2', md: 'span 1' } }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: { xs: 100, md: 140 },
                          height: { xs: 100, md: 140 },
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: '2px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          mx: 'auto',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          component="img"
                          src="/images/device_kiosk.webp"
                          alt="Kiosk"
                          sx={{
                            width: '90%',
                            height: '90%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          color: '#1f2937'
                        }}
                      >
                        Kiosk
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Industries Section - Based on landing3.png */}
      <Box
        component="section"
        id="industries"
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative'
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Box sx={{ textAlign: 'center', mb: 10 }}>
                <Chip
                  label="🏭 Industry Solutions"
                  sx={{
                    backgroundColor: 'rgba(113, 75, 103, 0.1)',
                    color: '#714B67',
                    fontWeight: 600,
                    mb: 3,
                    fontSize: '15px',
                    px: 3,
                    py: 1
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: 'Caveat, cursive',
                    fontWeight: 700,
                    fontSize: { xs: '2rem', md: '3rem' },
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    color: '#141A29',
                    mb: 3,
                    position: 'relative',
                    // display: 'inline-block'
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      position: 'relative',
                      display: 'inline-block',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) scale(0.8)',
                        width: 1449,
                        height: 313,
                        backgroundImage: 'url("/images/02.svg")',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        zIndex: -1,
                        opacity: 0.7
                      }
                    }}
                  >
                    Built for Every Industry
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    lineHeight: 1.4,
                    color: '#6b7280',
                    maxWidth: '700px',
                    mx: 'auto'
                  }}
                >
                  Tailored solutions that understand the unique challenges 
                  of your specific industry.
                </Typography>
              </Box>
            </motion.div>

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {industries.map((industry, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={fadeInUp} whileHover="hover">
                    <Card
                      component={motion.div}
                      variants={scaleOnHover}
                      sx={{
                        height: '100%',
                        borderRadius: 4,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          borderColor: '#714B67',
                          boxShadow: '0 25px 50px rgba(113, 75, 103, 0.15)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          height: { xs: 180, sm: 200, md: 240 },
                          backgroundImage: `url(${industry.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.3))'
                          }
                        }}
                      />
                      
                      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Stack spacing={3}>
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                                lineHeight: 1.4,
                                color: '#141A29',
                                mb: 2
                              }}
                            >
                              {industry.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#6b7280',
                                lineHeight: 1.6,
                                mb: 3,
                                fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' }
                              }}
                            >
                              {industry.description}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: '#374151', fontWeight: 600, mb: 2 }}>
                              Key Applications:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {industry.apps.map((app, idx) => (
                                <Chip
                                  key={idx}
                                  label={app}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(113, 75, 103, 0.1)',
                                    color: '#714B67',
                                    fontWeight: 500,
                                    mb: 1
                                  }}
                                />
                              ))}
                            </Stack>
                          </Box>
                          
                          <Button
                            endIcon={<ArrowForward />}
                            sx={{
                              color: '#714B67',
                              fontWeight: 600,
                              textTransform: 'none',
                              justifyContent: 'flex-start',
                              px: 0,
                              '&:hover': {
                                backgroundColor: 'transparent',
                                '& .MuiSvgIcon-root': {
                                  transform: 'translateX(8px)'
                                }
                              },
                              '& .MuiSvgIcon-root': {
                                transition: 'transform 0.3s ease'
                              }
                            }}
                          >
                            Explore Solutions
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Customer Success Section - Based on landing4.png */}
      <Box
        component="section"
        id="testimonials"
        sx={{
          py: 12,
          backgroundColor: '#fff',
          position: 'relative'
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Box sx={{ textAlign: 'center', mb: 10 }}>
                <Chip
                  label="💬 Customer Success"
                  sx={{
                    backgroundColor: 'rgba(113, 75, 103, 0.1)',
                    color: '#714B67',
                    fontWeight: 600,
                    mb: 3,
                    fontSize: '15px',
                    px: 3,
                    py: 1
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: 'Caveat, cursive',
                    fontWeight: 700,
                    fontSize: { xs: '2rem', md: '3rem' },
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    color: '#141A29',
                    mb: 3
                  }}
                >
                  Trusted by Industry Leaders
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    lineHeight: 1.4,
                    color: '#6b7280',
                    maxWidth: '700px',
                    mx: 'auto'
                  }}
                >
                  Join thousands of companies that have transformed their operations 
                  and achieved remarkable growth.
                </Typography>
              </Box>
            </motion.div>

            {/* Company Logos Carousel */}
            <motion.div variants={fadeInUp}>
              <Box sx={{ mb: 8, position: 'relative' }}>
                {/* Decorative Quote SVGs */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    left: -20,
                    opacity: 0.1,
                    transform: 'rotate(-15deg) scale(0.8)',
                    zIndex: 0,
                    '& img': {
                      width: '68px',
                      height: '54px'
                    }
                  }}
                >
                  <img src="/images/quote.svg" alt="Quote decoration" />
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -20,
                    opacity: 0.1,
                    transform: 'rotate(15deg) scale(0.8) scaleX(-1)',
                    zIndex: 0,
                    '& img': {
                      width: '68px',
                      height: '54px'
                    }
                  }}
                >
                  <img src="/images/quote.svg" alt="Quote decoration" />
                </Box>
                
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    color: '#714B67',
                    mb: 4,
                    fontSize: '1rem',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  Trusted by Leading Companies Worldwide
                </Typography>
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={6}
                    loop={true}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    speed={1000}
                    breakpoints={{
                      320: { slidesPerView: 2, spaceBetween: 20 },
                      480: { slidesPerView: 3, spaceBetween: 25 },
                      768: { slidesPerView: 4, spaceBetween: 30 },
                      1024: { slidesPerView: 5, spaceBetween: 30 },
                      1200: { slidesPerView: 6, spaceBetween: 30 }
                    }}
                    style={{
                      paddingTop: '20px',
                      paddingBottom: '20px'
                    }}
                  >
                    {trustedCompanies.map((company, index) => (
                      <SwiperSlide key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 3,
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              '& .company-logo': {
                                filter: 'grayscale(0%)',
                                transform: 'scale(1.1)'
                              },
                              '& .company-name': {
                                color: '#714B67'
                              }
                            }
                          }}
                        >
                          <Box
                            className="company-logo"
                            sx={{
                              width: 80,
                              height: 80,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 2,
                              filter: 'grayscale(100%)',
                              transition: 'all 0.3s ease',
                              '& img': {
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                              }
                            }}
                          >
                            <img 
                              src={company.logo} 
                              alt={company.name}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </Box>
                          <Typography
                            className="company-name"
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: '#6b7280',
                              transition: 'color 0.3s ease',
                              textAlign: 'center',
                              fontSize: '0.875rem'
                            }}
                          >
                            {company.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#9ca3af',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              mt: 0.5
                            }}
                          >
                            {company.industry}
                          </Typography>
                        </Box>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </Box>
            </motion.div>

            {/* Testimonials Carousel */}
            <motion.div variants={fadeInUp}>
              <Box sx={{ position: 'relative' }}>
                {/* Large Decorative Quote SVGs for Testimonials Section */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    left: -60,
                    opacity: 0.08,
                    transform: 'rotate(-10deg) scale(2)',
                    zIndex: 0,
                    '& img': {
                      width: '68px',
                      height: '54px'
                    }
                  }}
                >
                  <img src="/images/quote.svg" alt="Large quote decoration" />
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -40,
                    right: -60,
                    opacity: 0.08,
                    transform: 'rotate(10deg) scale(2) scaleX(-1)',
                    zIndex: 0,
                    '& img': {
                      width: '68px',
                      height: '54px'
                    }
                  }}
                >
                  <img src="/images/quote.svg" alt="Large quote decoration" />
                </Box>
                
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={30}
                  slidesPerView={3}
                  loop={true}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                  }}
                  pagination={{
                    el: '.swiper-pagination-custom',
                    clickable: true,
                    renderBullet: (index, className) => {
                      return `<span class="${className}" style="background-color: #714B67; opacity: 0.3; width: 12px; height: 12px; margin: 0 6px; transition: all 0.3s ease;"></span>`;
                    }
                  }}
                  speed={800}
                  breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 20 },
                    768: { slidesPerView: 2, spaceBetween: 25 },
                    1024: { slidesPerView: 3, spaceBetween: 30 }
                  }}
                  style={{
                    paddingTop: '20px',
                    paddingBottom: '60px'
                  }}
                >
                  {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={index}>
                      <Card
                        sx={{
                          p: 4,
                          height: 'auto',
                          borderRadius: 4,
                          border: '1px solid #e5e7eb',
                          background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          overflow: 'visible',
                          '&:hover': {
                            borderColor: '#714B67',
                            boxShadow: '0 25px 50px rgba(113, 75, 103, 0.15)',
                            transform: 'translateY(-5px)'
                          }
                        }}
                      >
                        {/* Quote SVG as card decoration */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -10,
                            left: -10,
                            opacity: 0.2,
                            transform: 'scale(0.6)',
                            zIndex: 1,
                            '& img': {
                              width: '68px',
                              height: '54px'
                            }
                          }}
                        >
                          <img src="/images/quote.svg" alt="Quote" />
                        </Box>
                        <CardContent sx={{ p: 0 }}>
                          <Stack spacing={3}>
                            <Rating 
                              value={testimonial.rating} 
                              readOnly 
                              sx={{ 
                                '& .MuiRating-iconFilled': {
                                  color: '#fbbf24'
                                }
                              }} 
                            />
                            
                            <Typography
                              variant="body1"
                              sx={{
                                color: '#374151',
                                lineHeight: 1.7,
                                fontSize: '16px',
                                fontStyle: 'italic',
                                position: 'relative',
                                zIndex: 2
                              }}
                            >
                              "{testimonial.text}"
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar 
                                src={testimonial.avatar}
                                sx={{ 
                                  width: 56, 
                                  height: 56,
                                  border: '3px solid #714B67'
                                }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 800,
                                    color: '#1f2937'
                                  }}
                                >
                                  {testimonial.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#6b7280',
                                    fontWeight: 500
                                  }}
                                >
                                  {testimonial.role}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#714B67',
                                    fontWeight: 600
                                  }}
                                >
                                  {testimonial.company}
                                </Typography>
                              </Box>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Arrows */}
                <Box
                  className="swiper-button-prev-custom"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: -20,
                    transform: 'translateY(-50%)',
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: '#714B67',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#5a3a54',
                      transform: 'translateY(-50%) scale(1.1)'
                    }
                  }}
                >
                  <ChevronRight sx={{ color: 'white', transform: 'rotate(180deg)' }} />
                </Box>
                <Box
                  className="swiper-button-next-custom"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: -20,
                    transform: 'translateY(-50%)',
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: '#714B67',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#5a3a54',
                      transform: 'translateY(-50%) scale(1.1)'
                    }
                  }}
                >
                  <ChevronRight sx={{ color: 'white' }} />
                </Box>

                {/* Custom Pagination */}
                <Box
                  className="swiper-pagination-custom"
                  sx={{
                    textAlign: 'center',
                    mt: 3,
                    '& .swiper-pagination-bullet-active': {
                      opacity: '1 !important',
                      transform: 'scale(1.2)'
                    }
                  }}
                />
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        component="section"
        id="cta"
        sx={{
          py: 12,
          background: 'var(--odoo-gradient-primary)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Rocket sx={{ fontSize: 80, color: '#fbbf24', mb: 3 }} />
              </motion.div>
              
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Caveat, cursive',
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '3rem' },
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                  color: '#fff',
                  mb: 3
                }}
              >
                Ready to Transform Your Business?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  lineHeight: 1.4,
                  color: 'rgba(255, 255, 255, 0.95)',
                  maxWidth: '700px',
                  mx: 'auto',
                  mb: 6
                }}
              >
                Join thousands of companies that have revolutionized their operations 
                with our platform. Start your transformation today.
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                justifyContent="center"
                sx={{ mb: 6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<GetApp />}
                    onClick={() => navigate('/signup')}
                    sx={{
                      backgroundColor: '#fff',
                      color: '#714B67',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      letterSpacing: '0.02em',
                      px: 8,
                      py: 3,
                      borderRadius: 4,
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        backgroundColor: '#f8f9fa',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.3)'
                      }
                    }}
                  >
                    Start Your Free Trial
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Phone />}
                    sx={{
                      borderColor: '#fff',
                      color: '#fff',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      letterSpacing: '0.02em',
                      px: 8,
                      py: 3,
                      borderRadius: 4,
                      borderWidth: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: '#fff',
                        borderWidth: 2,
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    Contact Sales
                  </Button>
                </motion.div>
              </Stack>

              <Stack direction="row" spacing={6} justifyContent="center" flexWrap="wrap">
                {[
                  { icon: <WorkspacePremium />, text: 'Enterprise Ready' },
                  { icon: <Security />, text: 'Bank-Level Security' },
                  { icon: <Groups />, text: '24/7 Support' }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: '#fbbf24', fontSize: 24 }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </motion.div>
        </Container>

        {/* Floating Background Elements */}
        {[
          { src: '/images/fireworks_01b.svg', style: { top: '10%', left: '5%', width: 120, opacity: 0.3 } },
          { src: '/images/arrow_doodle_3.svg', style: { bottom: '20%', right: '10%', width: 100, opacity: 0.3 } },
          { src: '/images/yellow_highlight_03.svg', style: { top: '50%', left: '15%', width: 80, opacity: 0.2 } }
        ].map((item, index) => (
          <motion.div
            key={index}
            animate={{ 
              y: [0, -30, 0], 
              rotate: [0, 10, 0] 
            }}
            transition={{ 
              duration: 8 + index * 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ position: 'absolute', ...item.style }}
          >
            <Box
              component="img"
              src={item.src}
              sx={{ width: '100%', height: 'auto' }}
            />
          </motion.div>
        ))}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 10,
          backgroundColor: '#1f2937',
          color: '#fff'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="ExpenseHub Logo"
                    sx={{ height: 40, mr: 2 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: 'Caveat, cursive',
                      fontWeight: 700,
                      fontSize: '1.75rem',
                      lineHeight: 1.4,
                      color: '#fff'
                    }}
                  >
                    ExpenseHub
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#9ca3af',
                    lineHeight: 1.7,
                    maxWidth: 300
                  }}
                >
                  Empowering businesses worldwide with integrated solutions that 
                  drive growth, efficiency, and success in the digital age.
                </Typography>
                <Stack direction="row" spacing={2}>
                  {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                    <Button
                      key={social}
                      variant="outlined"
                      sx={{
                        borderColor: '#374151',
                        color: '#9ca3af',
                        minWidth: 'auto',
                        p: 1,
                        fontSize: '12px',
                        '&:hover': {
                          borderColor: '#714B67',
                          color: '#714B67'
                        }
                      }}
                    >
                      {social}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                {[
                  {
                    title: 'Product',
                    links: ['Features', 'Pricing', 'Integrations', 'Updates', 'Beta Program']
                  },
                  {
                    title: 'Company',
                    links: ['About Us', 'Careers', 'Press Kit', 'Contact', 'Partners']
                  },
                  {
                    title: 'Resources',
                    links: ['Documentation', 'Help Center', 'Community', 'Blog', 'Status']
                  },
                  {
                    title: 'Legal',
                    links: ['Privacy Policy', 'Terms of Service', 'Security', 'GDPR', 'Cookies']
                  }
                ].map((section, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Stack spacing={2}>
                      <Typography variant="h6" sx={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '1.125rem',
                        lineHeight: 1.4,
                        color: '#fff' 
                      }}>
                        {section.title}
                      </Typography>
                      <Stack spacing={1}>
                        {section.links.map((link) => (
                          <Typography
                            key={link}
                            component="a"
                            href="#"
                            sx={{
                              color: '#9ca3af',
                              textDecoration: 'none',
                              fontSize: '15px',
                              transition: 'color 0.3s ease',
                              '&:hover': { 
                                color: '#714B67',
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            {link}
                          </Typography>
                        ))}
                      </Stack>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 6, borderColor: '#374151' }} />
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 3
            }}
          >
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              © 2025 ExpenseHub. All rights reserved. Built with ❤️ for modern businesses.
            </Typography>
            <Stack direction="row" spacing={4}>
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <Typography
                  key={item}
                  component="a"
                  href="#"
                  sx={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': { 
                      color: '#714B67',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
