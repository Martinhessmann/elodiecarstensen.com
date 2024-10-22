import React, { useState, useRef, useEffect } from 'react';
import DynamicImageHighlight from './DynamicImageHighlight';
import { getAssetUrl } from './assetUtils';
import './Gallery.scss';

const Gallery = ({ project }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNodes, setShowNodes] = useState(true);
  const scrollContainerRef = useRef(null);
  const galleryContentRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const galleryContent = galleryContentRef.current;
    if (!scrollContainer || !galleryContent || !project) return;

    // Set the height of the gallery content
    galleryContent.style.height = `${project.images.length * 100}vh`;

    const handleScroll = () => {
      const newIndex = Math.round(scrollContainer.scrollTop / window.innerHeight);
      setCurrentIndex(newIndex);
      setShowNodes(false);
      setTimeout(() => setShowNodes(true), 500);
    };

    const smoothScrollTo = (target, duration) => {
      const start = scrollContainer.scrollTop;
      const distance = target - start;
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad
        scrollContainer.scrollTop = start + distance * ease(progress);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    };

    const handleScrollEnd = () => {
      const targetIndex = Math.round(scrollContainer.scrollTop / window.innerHeight);
      const targetScrollTop = targetIndex * window.innerHeight;
      if (Math.abs(scrollContainer.scrollTop - targetScrollTop) > 10) {
        smoothScrollTo(targetScrollTop, 300);
      }
    };

    let scrollTimeout;
    const handleScrollWithDebounce = () => {
      handleScroll();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
    };

    scrollContainer.addEventListener('scroll', handleScrollWithDebounce, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScrollWithDebounce);
      clearTimeout(scrollTimeout);
    };
  }, [project]);

  if (!project) return null;

  const projectWithCorrectImagePaths = {
    ...project,
    images: project.images.map(image => ({
      ...image,
      src: getAssetUrl(`${image.src}`)
    }))
  };

  return (
    <div className="gallery-container" ref={scrollContainerRef}>
      <div className="gallery-content" ref={galleryContentRef}>
        {projectWithCorrectImagePaths.images.map((image, index) => (
          <div key={image.id} className="gallery-image-container">
            <DynamicImageHighlight
              image={image.src}
              highlightData={image.highlight}
              nodeData={image.nodes}
              showNodes={showNodes}
            />
          </div>
        ))}
      </div>
      <div className="gallery-navigation">
        {projectWithCorrectImagePaths.images.map((_, index) => (
          <div
            key={index}
            className={`gallery-nav-dot ${index === currentIndex ? 'active' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
