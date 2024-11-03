import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from './assetUtils';
import enterCursor from './assets/enter.svg';
import './SplashPage.scss';
import { Helmet } from 'react-helmet-async';

const SplashPage = () => {
  const logoUrl = getAssetUrl('logo.svg');
  const splashUrl = getAssetUrl('splash.jpg');
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const handleContainerClick = () => {
    console.log("Attempting to navigate to /gallery");
    navigate('/gallery');
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
    <>
      <Helmet>
        <link rel="canonical" href="https://www.elodiecarstensen.com" />
        {/* These are the alternate versions */}
        <link rel="alternate" href="https://elodiecarstensen.com" />
        <link rel="alternate" href="http://www.elodiecarstensen.com" />
        <link rel="alternate" href="http://elodiecarstensen.com" />
      </Helmet>
      <div
        className="splash-container"
        style={{ '--enter-cursor': `url(${enterCursor})` }}
      >
        {/* Hidden content for screen readers and search engines */}
        <div className="visually-hidden">
          <h1>Elodie Carstensen</h1>
          <p>
            Elodie Carstensen is a Berlin-based designer and artist, crafting immersive, story-driven fashion through collections like Alluvial, Des Nachtmahrs Schmetterlinge, and Absence of Promised Safety. Known for custom costume design and thematic depth, her work spans installations, performances, and collaborative projects.
          </p>
        </div>

        <div className="splash-glass-effect" aria-hidden="true" />
        <div className="splash-content" aria-hidden="true">
          <div className="splash-logo-name">
            <img
              src={logoUrl}
              alt="Elodie Carstensen"
              className="splash-logo"
              loading="eager"
              width="200"
              height="50" // adjust dimensions as needed
            />
            <h1 className="splash-title">ELODIE CARSTENSEN</h1>
          </div>
          <div className="splash-text-container">
            <p className="splash-intro-text">
              Elodie Carstensen is a Berlin-based artist and designer. She is creating worlds that are reveled in the webs of imagination and analysis, experimenting with fashion, immersive installations, custom costume designs, performances and collaborations. Her collections Alluvial, Des Nachtmahrs Schmetterlinge, and Absence of Promised Safety are the beginning of her ever expanding universe.</p>
            <button className="splash-enter-button" onClick={handleContainerClick}>
              ENTER <span className="slash-icon">/</span>
            </button>
          </div>
        </div>
        <div
          className="splash-scroll-container"
          ref={scrollContainerRef}
          onClick={handleContainerClick}
        >
          <div className="splash-background"
            style={{ backgroundImage: `url(${splashUrl})` }}
            aria-hidden="true"
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
    </>
  );
};

export default SplashPage;
