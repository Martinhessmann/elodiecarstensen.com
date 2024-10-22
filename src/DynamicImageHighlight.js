import React, { useEffect, useRef, useState } from 'react';
import './DynamicImageHighlight.scss';

const DynamicImageHighlight = ({ highlightData, nodeData, showNodes }) => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

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

  const findOptimalPosition = (label, sourceX, sourceY, index, allNodes) => {
    const padding = 0.05; // 5% padding from the edges
    const labelWidth = 0.15;
    const labelHeight = 0.05;
    const minVerticalDistance = 16 / containerSize.height; // Convert 16px to percentage of container height

    const isInsideHighlight = (x, y) => {
      return x >= highlightData.x && x <= highlightData.x + highlightData.width &&
        y >= highlightData.y && y <= highlightData.y + highlightData.height;
    };

    const getPositionsOutsideHighlight = () => {
      const positions = [];
      const directions = [
        { dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }, // Bottom positions first
        { dx: -1, dy: 0 }, { dx: 1, dy: 0 }, // Then sides
        { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 } // Top positions last
      ];

      for (let dir of directions) {
        let x = sourceX + dir.dx * (0.2 + Math.random() * 0.1);
        let y = sourceY + dir.dy * (0.2 + Math.random() * 0.1);

        // Prefer lower positions
        if (dir.dy === 1) {
          y = Math.min(y + 0.2, 1 - padding - labelHeight); // Push down, but not outside viewport
        }

        if (!isInsideHighlight(x, y) && !isOutsideViewport({ x, y })) {
          positions.push({ x, y });
        }
      }

      return positions;
    };

    const isOutsideViewport = (pos) => {
      return pos.x - labelWidth / 2 < padding || pos.x + labelWidth / 2 > 1 - padding ||
        pos.y - labelHeight / 2 < padding || pos.y + labelHeight / 2 > 1 - padding;
    };

    const otherLabels = allNodes
      .slice(0, index)
      .map(node => ({ x: node.labelX, y: node.labelY }));

    const usedYValues = new Set(otherLabels.map(label => Math.round(label.y * 1000) / 1000));

    const positions = getPositionsOutsideHighlight();

    // Sort positions, prioritizing lower positions
    positions.sort((a, b) => {
      // Prioritize positions below the source point
      if (a.y > sourceY && b.y <= sourceY) return -1;
      if (b.y > sourceY && a.y <= sourceY) return 1;

      // If both are below or both are above, prefer the one closer to the bottom
      return b.y - a.y;
    });

    for (let pos of positions) {
      const roundedY = Math.round(pos.y * 1000) / 1000;
      if (!usedYValues.has(roundedY) && !isOutsideViewport(pos) && !isInsideHighlight(pos.x, pos.y)) {
        return pos;
      }
    }

    // If no suitable position is found, try to adjust the y-coordinate
    for (let pos of positions) {
      let adjustedY = pos.y;
      let direction = 1; // Start by moving down
      let attempts = 0;
      while (attempts < 20) {
        const roundedY = Math.round(adjustedY * 1000) / 1000;
        if (!usedYValues.has(roundedY) && !isOutsideViewport({ x: pos.x, y: adjustedY }) && !isInsideHighlight(pos.x, adjustedY)) {
          return { x: pos.x, y: adjustedY };
        }
        adjustedY += direction * minVerticalDistance;
        if (adjustedY > 1 - padding - labelHeight || adjustedY < padding) {
          direction *= -1; // Change direction if we hit the top or bottom
        }
        attempts++;
      }
    }

    // Fallback position: prefer bottom
    let fallbackY = 1 - padding - labelHeight;
    while (usedYValues.has(Math.round(fallbackY * 1000) / 1000) || isOutsideViewport({ x: padding, y: fallbackY })) {
      fallbackY -= minVerticalDistance;
      if (fallbackY < padding) {
        fallbackY = 1 - padding - labelHeight;
        break;
      }
    }

    return {
      x: Math.random() < 0.5 ? padding : 1 - padding - labelWidth,
      y: fallbackY
    };
  };

  const getAbsolutePosition = (relativeX, relativeY) => {
    if (!highlightData) return { x: relativeX, y: relativeY };
    return {
      x: highlightData.x + (relativeX * highlightData.width),
      y: highlightData.y + (relativeY * highlightData.height)
    };
  };

  const calculateNodePositions = (nodes) => {
    return nodes.map((node, index, array) => {
      const absolutePos = getAbsolutePosition(node.x, node.y);
      const { x, y } = findOptimalPosition(
        node.label,
        absolutePos.x,
        absolutePos.y,
        index,
        array.slice(0, index).map(n => ({
          ...n,
          labelX: n.labelX || n.x,
          labelY: n.labelY || n.y
        }))
      );
      return { ...node, absoluteX: absolutePos.x, absoluteY: absolutePos.y, labelX: x, labelY: y };
    });
  };

  const nodesWithPositions = nodeData ? calculateNodePositions(nodeData) : [];

  const createPath = (start, end) => {
    // Check if containerSize is valid
    if (containerSize.width === 0 || containerSize.height === 0) {
      return ''; // Return an empty path if container size is not yet available
    }

    // Normalize coordinates
    const normalizeX = x => x * containerSize.width;
    const normalizeY = y => y * containerSize.height;

    // Determine if the path should bend horizontally or vertically
    const isHorizontalBend = Math.abs(end.x - start.x) > Math.abs(end.y - start.y);

    let bendPoint;
    if (isHorizontalBend) {
      // Horizontal bend
      bendPoint = { x: end.x, y: start.y };
    } else {
      // Vertical bend
      bendPoint = { x: start.x, y: end.y };
    }

    return `M${normalizeX(start.x)},${normalizeY(start.y)} L${normalizeX(bendPoint.x)},${normalizeY(bendPoint.y)} L${normalizeX(end.x)},${normalizeY(end.y)}`;
  };

  return (
    <div className="dynamic-image-highlight" ref={containerRef}>
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
                  { x: node.absoluteX, y: node.absoluteY },
                  { x: node.labelX, y: node.labelY }
                )}
                className="node-line"
                style={{
                  animationDelay: `${index * 0.2 + 0.2}s`
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
                  animationDelay: `${index * 0.2 + 0.6}s`
                }}
              >
                {node.label}
              </div>
              <div
                className="node-point"
                style={{
                  left: `${node.absoluteX * 100}%`,
                  top: `${node.absoluteY * 100}%`,
                  animationDelay: `${index * 0.2}s`
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
