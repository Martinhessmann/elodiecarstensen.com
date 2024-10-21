import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from './assetUtils';
import enterCursor from './assets/enter.svg';
import './SplashPage.scss';

const SplashPage = ({ onEnter }) => {
  const logoUrl = getAssetUrl('logo.svg');
  const splashUrl = getAssetUrl('splash.jpg');
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [isEntering, setIsEntering] = useState(false);

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
      navigate('/gallery');
    }, 500);
  };

  const handleContainerClick = (e) => {
    // Only trigger if the click is directly on the container
    if (e.target === e.currentTarget) {
      handleEnter();
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      console.error('Scroll container not found');
      return;
    }

    console.log('Scroll container width:', scrollContainer.scrollWidth);
    console.log('Viewport width:', scrollContainer.clientWidth);

    // Update these percentages to match the visual snap points
    const snapPoints = [19, 27, 36.5, 41, 50, 59, 64.5, 80].map(
      percentage => (percentage / 100) * scrollContainer.scrollWidth
    );

    console.log('Calculated snap points:', snapPoints);

    // Scroll to the first snap point on load
    const scrollToFirstSnapPoint = () => {
      const firstSnapPoint = snapPoints[0];
      const targetScrollLeft = Math.max(0, firstSnapPoint - 100); // Subtract a small offset to ensure visibility
      console.log('Attempting to scroll to:', targetScrollLeft);
      scrollContainer.scrollLeft = targetScrollLeft;
      console.log('Actual scroll position after attempt:', scrollContainer.scrollLeft);
    };

    // Call the function after a short delay to ensure the container is fully rendered
    setTimeout(() => {
      console.log('Executing scrollToFirstSnapPoint after delay');
      scrollToFirstSnapPoint();
    }, 100);

    let isScrolling = false;
    let scrollTimeout;
    let isDragging = false;
    let startX, startScrollLeft;
    let isSnapping = false;
    let lastScrollPosition = 0;
    let scrollCount = 0;

    const getClosestSnapPoint = (scrollPosition) => {
      const containerCenter = scrollPosition + scrollContainer.clientWidth / 2;
      return snapPoints.reduce((prev, curr) =>
        Math.abs(curr - containerCenter) < Math.abs(prev - containerCenter) ? curr : prev
      );
    };

    const smoothScrollTo = (target, duration) => {
      const start = scrollContainer.scrollLeft;
      const distance = target - start;
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad
        scrollContainer.scrollLeft = start + distance * ease(progress);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          isSnapping = false;
        }
      };

      requestAnimationFrame(animation);
    };

    const handleScroll = () => {
      const currentPosition = scrollContainer.scrollLeft;
      console.log(`Scroll event ${scrollCount}: position ${currentPosition}, delta: ${currentPosition - lastScrollPosition}`);
      lastScrollPosition = currentPosition;
      scrollCount++;

      if (isScrolling) {
        clearTimeout(scrollTimeout);
      }
      isScrolling = true;

      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        console.log(`Scroll ended at position: ${scrollContainer.scrollLeft}`);
        if (!isDragging && !isSnapping) {
          const closestSnapPoint = getClosestSnapPoint(scrollContainer.scrollLeft);
          const currentPosition = scrollContainer.scrollLeft;
          const targetPosition = closestSnapPoint - scrollContainer.clientWidth / 2;
          const distance = targetPosition - currentPosition;

          if (Math.abs(distance) > 10) {
            isSnapping = true;
            console.log(`Snapping from ${currentPosition} to ${targetPosition}`);
            smoothScrollTo(targetPosition, 300); // 300ms duration for the snap
          }
        }
      }, 100);
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      startScrollLeft = scrollContainer.scrollLeft;
      console.log('Mouse down, drag started');
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = startScrollLeft - walk;
      console.log(`Mouse move, new scroll position: ${scrollContainer.scrollLeft}`);
    };

    const handleMouseUp = () => {
      isDragging = false;
      console.log('Mouse up, drag ended');
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mousemove', handleMouseMove);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mouseleave', handleMouseUp);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mouseleave', handleMouseUp);
      clearTimeout(scrollTimeout);
      console.log('Component unmounting, final scroll position:', scrollContainer.scrollLeft);
    };
  }, []);

  return (
    <div
      className="splash-container"
      style={{ '--enter-cursor': `url(${enterCursor})` }}
      onClick={handleContainerClick}
    >
      <div className="splash-glass-effect" />
      <div className="splash-content">
        <div className="splash-logo-name">
          <img src={logoUrl} alt="Logo" className="splash-logo" />
          <h1 className="splash-title">ELODIE CARSTENSEN</h1>
        </div>
        <p className="splash-intro-text">
          STEP INTO A WORLD WHERE VULNERABILITY BECOMES ARMOR AND FLUIDITY DEFIES SOCIETAL CONSTRUCTS. ELODIE CARSTENSEN INVITES YOU TO EXPLORE ABSENCE OF PROMISED SAFETY, A SPACE WHERE CREATURES, ARTIFACTS, AND DESIGNS COALESCE, EACH PIECE CHALLENGING THE CONVENTIONS OF IDENTITY AND STRENGTH.
        </p>
        <motion.button
          className="splash-enter-button"
          onClick={handleEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter
        </motion.button>
      </div>
      <div
        className="splash-scroll-container"
        ref={scrollContainerRef}
      >
        <div className="splash-background"
          style={{ backgroundImage: `url(${splashUrl})` }}
        >
          <div className="snap-points">
            <div className="snap-point" style={{ left: '19%' }}></div>
            <div className="snap-point" style={{ left: '27%' }}></div>
            <div className="snap-point" style={{ left: '36.5%' }}></div>
            <div className="snap-point" style={{ left: '41%' }}></div>
            <div className="snap-point" style={{ left: '50%' }}></div>
            <div className="snap-point" style={{ left: '59%' }}></div>
            <div className="snap-point" style={{ left: '64.5%' }}></div>
            <div className="snap-point" style={{ left: '80%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
