import React, { useState } from 'react';
import DynamicImageHighlight from './DynamicImageHighlight';
import { getAssetUrl } from './assetUtils';
import data from './data.json';
import './Gallery.css';

const Gallery = ({ project, onLogoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e) => {
    const newIndex = Math.round(e.target.scrollTop / window.innerHeight);
    setCurrentIndex(newIndex);
  };

  if (!project) return null;

  // Update this part to use getAssetUrl for constructing image paths
  const projectWithCorrectImagePaths = {
    ...project,
    images: project.images.map(image => ({
      ...image,
      src: getAssetUrl(`${image.src}`)
    }))
  };

  return (
    <div className="gallery" onScroll={handleScroll}>
      <div className="gallery-header">
        <div onClick={onLogoClick} className="gallery-logo">ELODIE CARSTENSEN</div>
        <div>{project.name}</div>
      </div>
      {projectWithCorrectImagePaths.images.map((image, index) => (
        <div key={image.id} className="gallery-image-container">
          <DynamicImageHighlight
            image={image.src}
            highlightData={image.highlight}
            nodeData={image.nodes}
          />
        </div>
      ))}
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
