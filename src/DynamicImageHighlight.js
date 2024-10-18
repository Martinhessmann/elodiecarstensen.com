import React, { useState, useEffect } from 'react';

const DynamicImageHighlight = ({ image, highlightData, nodeData }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateHighlightPosition = () => {
    if (!highlightData) return {};

    const { x = 0, y = 0, width = 0, height = 0 } = highlightData;
    return {
      left: `${x * windowSize.width}px`,
      top: `${y * windowSize.height}px`,
      width: `${width * windowSize.width}px`,
      height: `${height * windowSize.height}px`,
    };
  };

  return (
    <div className="relative w-full h-screen">
      <img src={image} alt="Gallery image" className="w-full h-full object-cover" />
      {highlightData && (
        <div
          className="absolute border-2 border-white"
          style={calculateHighlightPosition()}
        >
          <p className="text-white p-2">{highlightData.text || ''}</p>
        </div>
      )}
      {nodeData && nodeData.map((node, index) => (
        <div
          key={index}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            left: `${(node.x || 0) * windowSize.width}px`,
            top: `${(node.y || 0) * windowSize.height}px`,
          }}
        >
          <div className="absolute left-full ml-2 text-white">{node.label || ''}</div>
        </div>
      ))}
    </div>
  );
};

export default DynamicImageHighlight;