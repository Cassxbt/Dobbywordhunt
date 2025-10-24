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
  
  // Detect device type for aggressive mobile optimization
  const isMobile = safeViewportWidth < 480; // Small phones
  
  // MOBILE: Use fixed grid size from getLevelById(), skip calculations
  if (isMobile) {
    const gridSize = level.gridSize.max; // This is 8 or 10 from getLevelById()
    const gridWidth = safeViewportWidth * 0.85; // 85vw (matches Tailwind)
    const cellSize = gridWidth / gridSize;
    
    return {
      rows: gridSize,
      cols: gridSize,
      cellSize: Math.max(cellSize, 32) // Minimum 32px per cell
    };
  }
  
  // DESKTOP: Keep existing calculation logic below
  const isTablet = safeViewportWidth >= 480 && safeViewportWidth < 768; // Tablets
  
  // AGGRESSIVE viewport calculations for mobile
  const headerHeight = isMobile ? 140 : 120; // More space for mobile header
  const wordListHeight = isMobile ? 100 : Math.min(80, safeViewportHeight * 0.15); // More space for chips
  const padding = isMobile ? 32 : 24; // More padding for safety
  const safariBarsHeight = isMobile ? 120 : 100; // More conservative Safari bars estimate
  const safetyMargin = isMobile ? 40 : 0; // Extra safety margin for mobile

  const availableHeight = safeViewportHeight - headerHeight - wordListHeight - padding - safariBarsHeight - safetyMargin;
  const availableWidth = safeViewportWidth - (padding * 2);

  // AGGRESSIVE cell size reduction for mobile
  let minCellSize: number;
  let maxCellSize: number;
  
  if (isMobile) {
    minCellSize = 28; // Smaller for mobile (was 32)
    maxCellSize = 34; // Smaller for mobile (was 38)
  } else if (isTablet) {
    minCellSize = 32;
    maxCellSize = 38;
  } else {
    minCellSize = 36;
    maxCellSize = 42;
  }

  // Calculate optimal grid size based on level requirements
  const longestWord = Math.max(...level.words.map(w => w.length));
  const minGridSize = Math.max(longestWord, Math.ceil(Math.sqrt(level.words.length * 1.5)));
  
  // Calculate maximum possible grid size based on viewport
  const maxGridByHeight = Math.floor(availableHeight / minCellSize);
  const maxGridByWidth = Math.floor(availableWidth / minCellSize);
  const maxGridSize = Math.min(maxGridByHeight, maxGridByWidth);

  // CRITICAL: Force maximum grid dimensions based on device
  let maxGridDimension: number;
  if (isMobile) {
    maxGridDimension = 8; // Force 8x8 maximum on small phones
  } else if (isTablet) {
    maxGridDimension = 10; // Force 10x10 maximum on tablets
  } else {
    maxGridDimension = level.gridSize.max; // Use level's max on desktop
  }

  // Determine final grid size with AGGRESSIVE mobile constraints
  const calculatedSize = Math.max(minGridSize, Math.min(maxGridSize, level.gridSize.max));
  const gridSize = Math.min(calculatedSize, maxGridDimension);
  
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
