import React, { useState } from 'react';
import DynamicImageHighlight from './DynamicImageHighlight';

const Gallery = ({ project, onLogoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e) => {
    const newIndex = Math.round(e.target.scrollTop / window.innerHeight);
    setCurrentIndex(newIndex);
  };

  if (!project) return null;

  return (
    <div className="h-screen overflow-y-scroll" onScroll={handleScroll}>
      <div className="sticky top-0 z-10 flex justify-between items-center p-5 bg-black bg-opacity-50 text-white">
        <div onClick={onLogoClick} className="cursor-pointer">ELODIE CARSTENSEN</div>
        <div>{project.name}</div>
      </div>
      {project.images.map((image, index) => (
        <div key={image.id} className="h-screen">
          <DynamicImageHighlight
            image={image.src}
            highlightData={image.highlight}
            nodeData={image.nodes}
          />
        </div>
      ))}
      <div className="fixed right-5 top-1/2 transform -translate-y-1/2">
        {project.images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 my-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-500'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;