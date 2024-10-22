import React, { useEffect, useRef, useState } from 'react';
import './DynamicImageHighlight.scss';

const DynamicImageHighlight = ({ highlightData, nodeData, showNodes, isScrolling, themeColor, shouldAnimate }) => {
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
      const timer = setTimeout(() => setAnimate(false), 2000); // Adjust time as needed
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  const forceDirectedPlacement = (nodes, iterations = 50) => {
    const labelWidth = 0.15;
    const labelHeight = 0.05;
    const repulsionForce = 0.01;
    const attractionForce = 0.0005;
    const minDistance = 0.1; // Minimum distance between node point and label

    for (let i = 0; i < iterations; i++) {
      nodes.forEach((node, index) => {
        let fx = 0, fy = 0;

        // Repulsion from other nodes
        nodes.forEach((otherNode, otherIndex) => {
          if (index !== otherIndex) {
            const dx = node.labelX - otherNode.labelX;
            const dy = node.labelY - otherNode.labelY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < labelWidth) {
              fx += (dx / distance) * repulsionForce;
              fy += (dy / distance) * repulsionForce;
            }
          }
        });

        // Attraction to original position
        const dx = node.x - node.labelX;
        const dy = node.y - node.labelY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          const angle = Math.atan2(dy, dx);
          node.labelX = node.x - minDistance * Math.cos(angle);
          node.labelY = node.y - minDistance * Math.sin(angle);
        } else {
          fx += dx * attractionForce;
          fy += dy * attractionForce;
        }

        // Update position
        node.labelX += fx;
        node.labelY += fy;

        // Keep within bounds
        node.labelX = Math.max(labelWidth / 2, Math.min(1 - labelWidth / 2, node.labelX));
        node.labelY = Math.max(labelHeight / 2, Math.min(1 - labelHeight / 2, node.labelY));
      });
    }

    return nodes;
  };

  const calculateNodePositions = (nodes) => {
    const nodesWithInitialPositions = nodes.map(node => ({
      ...node,
      labelX: node.x + (Math.random() - 0.5) * 0.4,
      labelY: node.y + (Math.random() - 0.5) * 0.4
    }));

    return forceDirectedPlacement(nodesWithInitialPositions);
  };

  const nodesWithPositions = nodeData ? calculateNodePositions(nodeData) : [];

  const createPath = (start, end) => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return '';
    }

    const normalizeX = x => x * containerSize.width;
    const normalizeY = y => y * containerSize.height;

    const isHorizontalBend = Math.abs(end.x - start.x) > Math.abs(end.y - start.y);
    const bendPoint = isHorizontalBend ? { x: end.x, y: start.y } : { x: start.x, y: end.y };

    return `M${normalizeX(start.x)},${normalizeY(start.y)} L${normalizeX(bendPoint.x)},${normalizeY(bendPoint.y)} L${normalizeX(end.x)},${normalizeY(end.y)}`;
  };

  return (
    <div className={`dynamic-image-highlight ${isScrolling ? 'fade-out' : ''} ${animate ? 'animate' : ''}`} ref={containerRef}>
      {highlightData && (
        <div
          className="frame-rectangle"
          style={{
            left: `${highlightData.x * 100}%`,
            top: `${highlightData.y * 100}%`,
            width: `${highlightData.width * 100}%`,
            height: `${highlightData.height * 100}%`,
          }}
        />
      )}
      {highlightData && highlightData.text && (
        <div
          className="frame-label"
          style={{
            left: `${highlightData.x * 100}%`,
            top: `${highlightData.y * 100}%`,
            color: themeColor,
          }}
        >
          {highlightData.text}
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
            {nodesWithPositions.map((node, index) => (
              <path
                key={index}
                d={createPath(
                  { x: node.x, y: node.y },
                  { x: node.labelX, y: node.labelY }
                )}
                className="node-line"
                style={{
                  animationDelay: `${index * 0.2 + 0.2}s`,
                  stroke: themeColor,
                }}
              />
            ))}
          </svg>
          {nodesWithPositions.map((node, index) => (
            <React.Fragment key={index}>
              <div
                className="node-label"
                style={{
                  left: `${node.labelX * 100}%`,
                  top: `${node.labelY * 100}%`,
                  animationDelay: `${index * 0.2 + 0.6}s`,
                  backgroundColor: themeColor,
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
                  backgroundColor: themeColor,
                }}
              />
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
};

export default DynamicImageHighlight;
