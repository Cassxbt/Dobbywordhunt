import { Level } from '../types/game';

export interface GridDimensions {
  rows: number;
  cols: number;
  cellSize: number;
}

export function calculateGridSize(
  level: Level,
  viewportWidth: number,
  viewportHeight: number
): GridDimensions {
  // Use visualViewport API for Safari (excludes address bar)
  const safeViewportHeight = window.visualViewport?.height || viewportHeight;
  const safeViewportWidth = window.visualViewport?.width || viewportWidth;
  
  // Mobile Safari UI bars take ~140px (top + bottom)
  const headerHeight = 120; // Header + timer + buttons
  const wordListHeight = Math.min(80, safeViewportHeight * 0.15); // Chips at bottom
  const padding = 24; // Minimal padding
  const safariBarsHeight = 100; // Account for Safari UI bars

  const availableHeight = safeViewportHeight - headerHeight - wordListHeight - padding - safariBarsHeight;
  const availableWidth = safeViewportWidth - (padding * 2);

  // Detect mobile for smaller cell sizes
  const isMobile = safeViewportWidth < 768;
  
  // Smaller cell sizes for mobile to fit more grid
  const minCellSize = isMobile ? 32 : 36; // Smaller minimum for mobile
  const maxCellSize = isMobile ? 38 : 42; // Smaller maximum for mobile

  // Calculate optimal grid size based on level requirements
  const longestWord = Math.max(...level.words.map(w => w.length));
  const minGridSize = Math.max(longestWord, Math.ceil(Math.sqrt(level.words.length * 1.5)));
  
  // Calculate maximum possible grid size based on viewport
  const maxGridByHeight = Math.floor(availableHeight / minCellSize);
  const maxGridByWidth = Math.floor(availableWidth / minCellSize);
  const maxGridSize = Math.min(maxGridByHeight, maxGridByWidth);

  // Determine final grid size with mobile constraints
  const gridSize = Math.max(minGridSize, Math.min(maxGridSize, level.gridSize.max));
  
  // Calculate actual cell size with mobile constraints
  const cellSizeByHeight = availableHeight / gridSize;
  const cellSizeByWidth = availableWidth / gridSize;
  const cellSize = Math.min(cellSizeByHeight, cellSizeByWidth, maxCellSize);

  return {
    rows: gridSize,
    cols: gridSize,
    cellSize: Math.max(cellSize, minCellSize)
  };
}

export function getResponsiveGridStyle(dimensions: GridDimensions): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${dimensions.cols}, 1fr)`,
    gridTemplateRows: `repeat(${dimensions.rows}, 1fr)`,
    gap: '2px',
    width: '100%',
    height: '100%',
    maxWidth: `${dimensions.cols * dimensions.cellSize}px`,
    maxHeight: `${dimensions.rows * dimensions.cellSize}px`,
    margin: '0 auto',
    // Mobile-specific fixes
    overflow: 'hidden',
    touchAction: 'none', // Prevent scrolling during drag
    WebkitOverflowScrolling: 'touch',
    // Ensure grid stays within viewport
    position: 'relative',
    boxSizing: 'border-box'
  };
}

export function getCellStyle(cellSize: number): React.CSSProperties {
  return {
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    minWidth: `${cellSize}px`,
    minHeight: `${cellSize}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${Math.max(cellSize * 0.4, 16)}px`,
    fontWeight: '600',
    borderRadius: '6px',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none'
  };
}
