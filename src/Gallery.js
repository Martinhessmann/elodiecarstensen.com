import React, { useState } from 'react';
import DynamicImageHighlight from './DynamicImageHighlight';
import { getAssetUrl } from './assetUtils';
import './Gallery.scss';

const Gallery = ({ project }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e) => {
    const newIndex = Math.round(e.target.scrollTop / window.innerHeight);
    setCurrentIndex(newIndex);
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
    <div className="gallery" onScroll={handleScroll}>
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
