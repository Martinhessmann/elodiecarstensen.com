import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import './DynamicImageHighlight.scss';

const generateLabelOffset = (node, highlightData, index, totalNodes) => {
  const angle = (index / totalNodes) * 2 * Math.PI;
  const baseDistance = 0.2; // Increased base distance
  const frameLabelBuffer = 0.1; // Buffer zone for frame label

  let offsetX = Math.cos(angle) * baseDistance;
  let offsetY = Math.sin(angle) * baseDistance;

  // Adjust offset to ensure label is outside the frame
  if (node.x < highlightData.x) {
    offsetX = -Math.abs(offsetX) - 0.1;
  } else if (node.x > highlightData.x + highlightData.width) {
    offsetX = Math.abs(offsetX) + 0.1;
  } else {
    offsetX = (node.x < highlightData.x + highlightData.width / 2) ?
      -Math.abs(offsetX) - 0.1 :
      Math.abs(offsetX) + 0.1;
  }

  if (node.y < highlightData.y) {
    offsetY = -Math.abs(offsetY) - 0.1;
  } else if (node.y > highlightData.y + highlightData.height) {
    offsetY = Math.abs(offsetY) + 0.1;
  } else {
    offsetY = (node.y < highlightData.y + highlightData.height / 2) ?
      -Math.abs(offsetY) - 0.1 :
      Math.abs(offsetY) + 0.1;
  }

  // Extra spacing for labels near the frame label (bottom of frame)
  if (node.y > highlightData.y + highlightData.height - 0.1 &&
    node.x >= highlightData.x - 0.1 &&
    node.x <= highlightData.x + highlightData.width + 0.1) {
    offsetY += frameLabelBuffer; // Move label down more to avoid frame label
  }

  // Prevent labels from being too close to the edges
  const finalX = node.x + offsetX;
  const finalY = node.y + offsetY;

  // Add minimum spacing between labels and frame edges
  const edgeBuffer = 0.05;
  if (finalX < highlightData.x && finalX > highlightData.x - edgeBuffer) {
    offsetX -= edgeBuffer;
  }
  if (finalX > highlightData.x + highlightData.width &&
    finalX < highlightData.x + highlightData.width + edgeBuffer) {
    offsetX += edgeBuffer;
  }
  if (finalY < highlightData.y && finalY > highlightData.y - edgeBuffer) {
    offsetY -= edgeBuffer;
  }
  if (finalY > highlightData.y + highlightData.height &&
    finalY < highlightData.y + highlightData.height + edgeBuffer) {
    offsetY += edgeBuffer;
  }

  return {
    x: node.x + offsetX,
    y: node.y + offsetY
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
              {highlightData.text}
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
                className="node-label"
                style={{
                  left: `${node.labelX * 100}%`,
                  top: `${node.labelY * 100}%`,
                  animationDelay: `${index * 0.2 + 0.6}s`
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
