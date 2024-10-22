import React, { useEffect, useRef, useState } from 'react';
import './DynamicImageHighlight.scss';

const DynamicImageHighlight = ({ image, highlightData, nodeData }) => {
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

    const isInsideHighlight = (x, y) => {
      return x >= highlightData.x && x <= highlightData.x + highlightData.width &&
        y >= highlightData.y && y <= highlightData.y + highlightData.height;
    };

    const getPositionsOutsideHighlight = () => {
      const positions = [];
      const directions = [
        { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
        { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
        { dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }
      ];

      for (let dir of directions) {
        let x = sourceX + dir.dx * (0.2 + Math.random() * 0.1); // Spread out more
        let y = sourceY + dir.dy * (0.2 + Math.random() * 0.1);

        if (!isInsideHighlight(x, y) && !isOutsideViewport({ x, y })) {
          positions.push({ x, y });
        }
      }

      return positions;
    };

    const isOverlapping = (pos, otherLabels) => {
      return otherLabels.some(other =>
        Math.abs(pos.x - other.x) < labelWidth &&
        Math.abs(pos.y - other.y) < labelHeight
      );
    };

    const isOutsideViewport = (pos) => {
      return pos.x - labelWidth / 2 < padding || pos.x + labelWidth / 2 > 1 - padding ||
        pos.y - labelHeight / 2 < padding || pos.y + labelHeight / 2 > 1 - padding;
    };

    const otherLabels = allNodes
      .slice(0, index)
      .map(node => ({ x: node.labelX, y: node.labelY }));

    const positions = getPositionsOutsideHighlight();

    for (let pos of positions) {
      if (!isOverlapping(pos, otherLabels) && !isOutsideViewport(pos)) {
        return pos;
      }
    }

    // Fallback position
    return {
      x: Math.random() < 0.5 ? padding : 1 - padding - labelWidth,
      y: Math.max(padding, Math.min(1 - padding - labelHeight, sourceY))
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
      <img src={image} alt="Gallery item" className="gallery-image" />
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
            stroke="white"
            strokeWidth="0.25"
            fill="none"
          />
        ))}
      </svg>
      {nodesWithPositions.map((node, index) => (
        <React.Fragment key={index}>
          <div
            className="node-label"
            style={{
              left: `${node.labelX * 100}%`,
              top: `${node.labelY * 100}%`
            }}
          >
            {node.label}
          </div>
          <div
            className="node-point"
            style={{
              left: `${node.absoluteX * 100}%`,
              top: `${node.absoluteY * 100}%`
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default DynamicImageHighlight;
