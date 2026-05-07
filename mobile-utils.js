// mobile-utils.js — Mobile and touch-specific utilities
// Handles viewport, touch events, orientation, safe areas

export function initMobileOptimizations() {
  setViewportMeta();
  handleOrientationChange();
  disableDefaultTouchBehaviors();
  enhanceTouchFeedback();
}

function setViewportMeta() {
  // Ensure proper viewport configuration
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content',
      'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover'
    );
  }
}

function handleOrientationChange() {
  const handleChange = () => {
    const isLandscape = window.innerHeight < window.innerWidth;
    document.documentElement.setAttribute('data-orientation', isLandscape ? 'landscape' : 'portrait');

    // Adjust app height on mobile to avoid address bar issues
    const appHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    appHeight();
  };

  window.addEventListener('orientationchange', handleChange, false);
  window.addEventListener('resize', handleChange, false);
  handleChange(); // Initial call
}

function disableDefaultTouchBehaviors() {
  // Prevent double-tap zoom on buttons
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      // Double tap detected
      if (e.target.matches('button, [role="button"], .btn-choix, .carte-jeu')) {
        e.preventDefault();
      }
    }
    lastTouchEnd = now;
  }, false);

  // Prevent long-press context menu on interactive elements
  document.addEventListener('contextmenu', (e) => {
    if (e.target.matches('button, [role="button"], .btn-choix, .carte-jeu, .menu-home-card')) {
      e.preventDefault();
      return false;
    }
  });
}

function enhanceTouchFeedback() {
  // Add touch feedback (visual ripple/pulse effect) to buttons without built-in feedback
  const buttons = document.querySelectorAll('button, [role="button"], .btn-choix, .carte-jeu');

  buttons.forEach(btn => {
    btn.addEventListener('touchstart', () => {
      btn.style.opacity = '0.8';
    });
    btn.addEventListener('touchend', () => {
      btn.style.opacity = '1';
    });
    btn.addEventListener('touchcancel', () => {
      btn.style.opacity = '1';
    });
  });
}

export function isTouch() {
  return () => (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
  );
}

export function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

export function isLandscape() {
  return window.innerHeight < window.innerWidth;
}

export function getDevice() {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/Windows Phone/.test(ua)) return 'windows-phone';
  return 'other';
}

export function isTablet() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return (width >= 600 && width <= 1024) || (height >= 600 && height <= 1024);
}

export function isPhone() {
  return !isTablet() && window.innerWidth < 600;
}

// Detect if device is in safe area
export function getSafeAreaInsets() {
  const computedStyle = getComputedStyle(document.documentElement);
  return {
    top: parseFloat(computedStyle.getPropertyValue('env(safe-area-inset-top)')) || 0,
    right: parseFloat(computedStyle.getPropertyValue('env(safe-area-inset-right)')) || 0,
    bottom: parseFloat(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
    left: parseFloat(computedStyle.getPropertyValue('env(safe-area-inset-left)')) || 0,
  };
}

// Handle iOS-specific behaviors
export function iOSFixes() {
  if (getDevice() !== 'ios') return;

  // Fix 100vh on iOS (address bar issue)
  const setIOSHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setIOSHeight();
  window.addEventListener('orientationchange', setIOSHeight);
  window.addEventListener('resize', setIOSHeight);

  // Prevent rubber-band scrolling on body
  document.body.addEventListener('touchmove', (e) => {
    if (e.target === document.body) {
      e.preventDefault();
    }
  }, { passive: false });
}

// Auto-init on module load
initMobileOptimizations();
iOSFixes();
