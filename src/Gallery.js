import React, { useState, useRef, useEffect } from 'react';
import DynamicImageHighlight from './DynamicImageHighlight';
import { getAssetUrl } from './assetUtils';
import './Gallery.scss';
import { useParams } from 'react-router-dom';
import ContactPage from './ContactPage';

const Gallery = ({ projects, currentProject, setCurrentProject }) => {
  const { projectId } = useParams();

  useEffect(() => {
    if (!currentProject || currentProject.id !== projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [projectId, currentProject, projects, setCurrentProject]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNodes, setShowNodes] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !currentProject) return;

    // Reset scroll position and trigger animation when project changes
    scrollContainer.scrollTop = 0;
    setCurrentIndex(0);
    setShouldAnimate(true);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index, 10);
          setCurrentIndex(index);
          setShouldAnimate(true);
        }
      });
    }, { threshold: 0.5 });

    const slides = scrollContainer.querySelectorAll('.gallery-slide');
    slides.forEach(slide => observer.observe(slide));

    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        setShouldAnimate(true);
      }, 150);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      slides.forEach(slide => observer.unobserve(slide));
      scrollContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentProject]);

  const handleDotClick = (index) => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  if (!currentProject) {
    return <div className="gallery-container">Loading...</div>;
  }

  if (currentProject.id === 'contact') {
    return <ContactPage data={currentProject} />;
  }

  if (!currentProject.images) {
    return <div className="gallery-container">No images available</div>;
  }

  const projectWithCorrectImagePaths = {
    ...currentProject,
    images: currentProject.images.map(image => ({
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
              isScrolling={isScrolling}
              themeColor={currentProject.themeColor}
              shouldAnimate={shouldAnimate}
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
            <div className="gallery-nav-label">{image.highlight?.text || `Image ${index + 1}`}</div>
            <div className="gallery-nav-dot"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
