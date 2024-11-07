import React, { useState, useRef, useEffect } from 'react';
import DynamicImageHighlight from './DynamicImageHighlight';
import { getAssetUrl } from './assetUtils';
import './Gallery.scss';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Gallery = ({ projects, currentProject, setCurrentProject }) => {
  const { projectId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [showCredits, setShowCredits] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!currentProject || currentProject.id !== projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
        setShowCredits(false); // Reset showCredits when project changes
        setCurrentIndex(0); // Reset currentIndex when project changes
      }
    }
  }, [projectId, currentProject, projects, setCurrentProject]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !currentProject) return;

    scrollContainer.scrollTop = 0;
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

  const toggleCredits = () => {
    setShowCredits(!showCredits);
  };

  if (!currentProject) {
    return <div className="gallery-container">Loading...</div>;
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

  const projectTitle = currentProject ? `${currentProject.name} by Elodie Carstensen` : 'Elodie Carstensen - Fashion Designer & Artist';

  return (
    <>
      <Helmet>
        <title>{projectTitle}</title>
        <meta name="title" content={projectTitle} />
        <meta property="og:title" content={projectTitle} />
        <meta property="twitter:title" content={projectTitle} />
        <link rel="canonical" href={`https://www.elodiecarstensen.com/gallery/${projectId}`} />
        <link rel="alternate" href={`https://elodiecarstensen.com/gallery/${projectId}`} />
        {/* If there were old URLs, add them here */}
        <link rel="alternate" href={`https://www.elodiecarstensen.com/work/${projectId}`} />
      </Helmet>
      <article className="gallery-container" ref={scrollContainerRef}>
        {projectWithCorrectImagePaths.images.map((image, index) => (
          <section
            key={image.id}
            className={`gallery-slide ${image.id === 'about' ? 'about-slide' : ''} ${currentProject.id === 'alluvial' && image.id === 'about' ? 'alluvial-intro' : ''}`}
            data-index={index}
          >
            <div className="image-container">
              <img
                src={image.src}
                alt={`${currentProject.name} - ${image.highlight?.text || `Image ${index + 1}`}`}
                className="gallery-image"
              />
              {image.id === 'about' && (
                <div className="about-text">
                  <h1>{currentProject.name}</h1>
                  <p>{image.text}</p>
                  <div className="credits-button-wrapper">
                    <button className="credits-button" onClick={toggleCredits}>
                      {showCredits ? '// Hide Credits' : '// Show Credits'}
                    </button>
                  </div>
                  <div className={`credits-content ${showCredits ? 'visible' : ''}`}>
                    {currentProject.credits}
                  </div>
                </div>
              )}
              {image.highlight && (
                <figcaption className="image-caption">
                  {image.highlight.text}
                </figcaption>
              )}
              <DynamicImageHighlight
                image={image.src}
                highlightData={image.highlight}
                nodeData={image.nodes}
                showNodes={index === currentIndex}
                isScrolling={isScrolling}
                themeColor={currentProject.themeColor}
                shouldAnimate={shouldAnimate}
              />
              {/* Hidden content for SEO and accessibility */}
              <div className="hidden-content">
                <h2>Image Details</h2>
                <p>{image.highlight?.text}</p>
                <p>Status: {image.highlight?.status}</p>
                <h3>Image Features</h3>
                <ul>
                  {image.nodes?.map((node, nodeIndex) => (
                    <li key={nodeIndex}>{node.label}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
        <nav className="gallery-navigation">
          {projectWithCorrectImagePaths.images.map((image, index) => (
            <button
              key={index}
              className={`gallery-nav-item ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            >
              <span className="gallery-nav-label">{image.id === 'about' ? 'INTRO' : (image.navLabel || `Image ${index + 1}`)}</span>
              <span className="gallery-nav-dot"></span>
            </button>
          ))}
        </nav>
      </article>
    </>
  );
};

export default Gallery;
