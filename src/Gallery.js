import React, { useState, useRef, useEffect } from 'react';
import DynamicImageHighlight from './DynamicImageHighlight';
import { getAssetUrl } from './assetUtils';
import './Gallery.scss';

const Gallery = ({ project }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNodes, setShowNodes] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !project) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index, 10);
          setCurrentIndex(index);
          setShowNodes(false);
          setTimeout(() => setShowNodes(true), 500);
        }
      });
    }, { threshold: 0.5 });

    const slides = scrollContainer.querySelectorAll('.gallery-slide');
    slides.forEach(slide => observer.observe(slide));

    return () => {
      slides.forEach(slide => observer.unobserve(slide));
    };
  }, [project]);

  const handleDotClick = (index) => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

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
      {projectWithCorrectImagePaths.images.map((image, index) => (
        <div key={image.id} className="gallery-slide" data-index={index}>
          <div className="image-container">
            <img src={image.src} alt={`Gallery item ${index + 1}`} className="gallery-image" />
            <DynamicImageHighlight
              image={image.src}
              highlightData={image.highlight}
              nodeData={image.nodes}
              showNodes={showNodes && index === currentIndex}
            />
          </div>
        </div>
      ))}
      <div className="gallery-navigation">
        {projectWithCorrectImagePaths.images.map((image, index) => (
          <div
            key={index}
            className={`gallery-nav-item ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          >
            <div className="gallery-nav-label">{image.highlight.text}</div>
            <div className="gallery-nav-dot"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
