import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import './DynamicImageHighlight.scss';

const DynamicImageHighlight = React.memo(({ highlightData, nodeData, showNodes, isScrolling, shouldAnimate }) => {
  console.log('DynamicImageHighlight render', { highlightData, nodeData, showNodes, isScrolling, shouldAnimate });

  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    console.log('Container size effect');
    const updateSize = () => {
      if (containerRef.current) {
        const newSize = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        };
        console.log('New container size:', newSize);
        setContainerSize(newSize);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    console.log('Animation effect', { shouldAnimate });
    if (shouldAnimate) {
      setAnimate(true);
      const timer = setTimeout(() => {
        console.log('Animation timeout');
        setAnimate(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  const forceDirectedPlacement = useCallback((nodes, iterations = 50) => {
    console.log('Starting force-directed placement', { nodes, iterations });
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

    console.log('Finished force-directed placement', nodes);
    return nodes;
  }, []);

  const calculateNodePositions = useCallback((nodes) => {
    console.log('Calculating node positions', nodes);
    const nodesWithInitialPositions = nodes.map(node => ({
      ...node,
      labelX: node.x + (Math.random() - 0.5) * 0.4,
      labelY: node.y + (Math.random() - 0.5) * 0.4
    }));

    const result = forceDirectedPlacement(nodesWithInitialPositions);
    console.log('Calculated node positions', result);
    return result;
  }, [forceDirectedPlacement]);

  const nodesWithPositions = useMemo(() => {
    if (!showNodes || !nodeData) return [];
    return calculateNodePositions(nodeData);
  }, [showNodes, nodeData, calculateNodePositions]);

  const createPath = useCallback((start, end) => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      console.log('Container size is zero, skipping path creation');
      return '';
    }

    const normalizeX = x => x * containerSize.width;
    const normalizeY = y => y * containerSize.height;

    const isHorizontalBend = Math.abs(end.x - start.x) > Math.abs(end.y - start.y);
    const bendPoint = isHorizontalBend ? { x: end.x, y: start.y } : { x: start.x, y: end.y };

    const path = `M${normalizeX(start.x)},${normalizeY(start.y)} L${normalizeX(bendPoint.x)},${normalizeY(bendPoint.y)} L${normalizeX(end.x)},${normalizeY(end.y)}`;

    console.log('Created path', { start, end, path });
    return path;
  }, [containerSize]);

  console.log('Rendering component', { animate, showNodes, isScrolling, containerSize });

  return (
    <div
      ref={containerRef}
      className={`dynamic-image-highlight ${animate ? 'animate' : ''}`}
      style={{
        '--highlight-x': `${highlightData.x * 100}%`,
        '--highlight-y': `${highlightData.y * 100}%`,
        '--highlight-width': `${highlightData.width * 100}%`,
        '--highlight-height': `${highlightData.height * 100}%`,
      }}
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
        />
      )}
      {highlightData && highlightData.text && (
        <div
          className="frame-label"
          style={{
            left: `${highlightData.x * 100}%`,
            top: `${highlightData.y * 100}%`,
            // The color is now handled by CSS
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
            {nodesWithPositions.map((node, index) => {
              console.log(`Rendering node line ${index}`, node);
              return (
                <path
                  key={index}
                  d={createPath(
                    { x: node.x, y: node.y },
                    { x: node.labelX, y: node.labelY }
                  )}
                  className="node-line"
                  style={{
                    animationDelay: `${index * 0.2 + 0.2}s`,
                    stroke: 'white',
                  }}
                />
              );
            })}
          </svg>
          {nodesWithPositions.map((node, index) => {
            console.log(`Rendering node ${index}`, node);
            return (
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
                    backgroundColor: 'white',
                  }}
                />
              </React.Fragment>
            );
          })}
        </>
      )}
    </div>
  );
});

export default DynamicImageHighlight;
