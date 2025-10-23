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
  // Reserve space for UI elements - mobile optimized
  const headerHeight = 100; // Increased for mobile touch targets
  const wordListHeight = Math.min(100, viewportHeight * 0.2); // Reduced for mobile
  const padding = 16; // Reduced padding for mobile

  const availableHeight = viewportHeight - headerHeight - wordListHeight - padding;
  const availableWidth = viewportWidth - padding;

  // Mobile-optimized cell sizes (iOS minimum touch target is 44px)
  const minCellSize = 44; // Increased for proper touch targets
  const maxCellSize = 50; // Slightly increased max

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
    WebkitOverflowScrolling: 'touch'
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
