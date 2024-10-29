import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import './DynamicImageHighlight.scss';

const generateLabelOffset = (node, highlightData, index, totalNodes) => {
  const gridCells = 6; // Number of cells in each direction
  const margin = 0.05; // Margin from edges
  const cellWidth = (1 - 2 * margin) / gridCells;
  const cellHeight = (1 - 2 * margin) / gridCells;

  // Determine which side of the frame to place labels
  const isLeftSide = node.x < highlightData.x + highlightData.width / 2;

  // Calculate grid position starting from bottom
  const gridX = isLeftSide ? 0 : gridCells - 1;
  // Reverse the index to start from bottom
  const reversedIndex = totalNodes - 1 - index;
  const gridY = Math.floor((reversedIndex % gridCells) * (gridCells / totalNodes));

  // Convert grid position to actual coordinates
  let labelX = margin + (gridX * cellWidth);
  let labelY = 1 - margin - (gridY * cellHeight); // Start from bottom

  // Ensure minimum distance from frame
  const minDistance = 0.15;
  const labelOffset = 0.15; // Offset for text alignment

  // Adjust X position based on which side we're on
  if (isLeftSide) {
    labelX = Math.min(node.x - minDistance, labelX);
    labelX -= labelOffset; // Move left for right-aligned text
  } else {
    labelX = Math.max(node.x + minDistance, labelX);
    labelX += 0.05; // Small offset from the node point for left-aligned text
  }

  // Avoid header area
  if (labelY < 0.15) { // Top 15% reserved for header
    labelY += 0.15;
  }

  // Avoid portrait area (middle of the image)
  const portraitArea = {
    top: 0.2,
    bottom: 0.8,
    left: 0.3,
    right: 0.7
  };

  if (labelY > portraitArea.top && labelY < portraitArea.bottom &&
    labelX > portraitArea.left && labelX < portraitArea.right) {
    if (labelY > (portraitArea.top + portraitArea.bottom) / 2) {
      labelY = portraitArea.bottom + 0.05;
    } else {
      labelY = portraitArea.top - 0.05;
    }
  }

  // Ensure we stay within bounds while maintaining alignment
  if (isLeftSide) {
    labelX = Math.max(margin, labelX);
  } else {
    labelX = Math.min(1 - margin, labelX);
  }
  labelY = Math.max(0.15, Math.min(0.95, labelY));

  return {
    x: labelX,
    y: labelY,
    align: isLeftSide ? 'right' : 'left' // Add alignment information
  };
};

const DynamicImageHighlight = React.memo(({ highlightData, nodeData, showNodes, isScrolling, shouldAnimate }) => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (shouldAnimate) {
      setAnimate(true);
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  const nodesWithOffsets = useMemo(() => {
    if (!nodeData || !Array.isArray(nodeData)) return [];
    return nodeData.map((node, index) => {
      const labelPosition = generateLabelOffset(node, highlightData, index, nodeData.length);
      return {
        ...node,
        labelX: labelPosition.x,
        labelY: labelPosition.y
      };
    });
  }, [nodeData, highlightData]);

  const createPath = useCallback((start, end) => {
    const normalizeX = x => x * containerSize.width;
    const normalizeY = y => y * containerSize.height;

    // Determine if the line should be horizontal or vertical
    const isHorizontal = Math.abs(end.x - start.x) > Math.abs(end.y - start.y);

    let path;
    if (isHorizontal) {
      // Horizontal line
      path = `M${normalizeX(start.x)},${normalizeY(start.y)}
              H${normalizeX(end.x)}
              V${normalizeY(end.y)}`;
    } else {
      // Vertical line
      path = `M${normalizeX(start.x)},${normalizeY(start.y)}
              V${normalizeY(end.y)}
              H${normalizeX(end.x)}`;
    }

    return path;
  }, [containerSize]);

  return (
    <div
      ref={containerRef}
      className={`dynamic-image-highlight ${animate ? 'animate' : ''}`}
    >
      {highlightData && (
        <div
          className="frame-rectangle"
          style={{
            left: `${highlightData.x * 100}%`,
            top: `${highlightData.y * 100}%`,
            width: `${highlightData.width * 100}%`,
            height: `${highlightData.height * 100}%`,
          }}
        >
          {highlightData.text && (
            <div className="frame-label">
              <span className="frame-text">{highlightData.text}</span>
              {highlightData.status && (
                <span className="frame-status">{highlightData.status}</span>
              )}
            </div>
          )}
        </div>
      )}
      {showNodes && (
        <>
          <svg className="node-lines-svg" style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}>
            {nodesWithOffsets.map((node, index) => (
              <path
                key={index}
                d={createPath(
                  { x: node.x, y: node.y },
                  { x: node.labelX, y: node.labelY }
                )}
                className="node-line"
                style={{
                  animationDelay: `${index * 0.2 + 0.2}s`,
                }}
              />
            ))}
          </svg>
          {nodesWithOffsets.map((node, index) => (
            <React.Fragment key={index}>
              <div
                className={`node-label ${node.labelX > 0.5 ? 'right-side' : 'left-side'}`}
                style={{
                  left: `${node.labelX * 100}%`,
                  top: `${node.labelY * 100}%`,
                  animationDelay: `${index * 0.2 + 0.6}s`,
                  textAlign: node.align
                }}
              >
                {node.label}
              </div>
              <div
                className="node-point"
                style={{
                  left: `${node.x * 100}%`,
                  top: `${node.y * 100}%`,
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
});

export default DynamicImageHighlight;
