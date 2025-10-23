import { Cell } from '../types/game';
import { CellComponentMemo } from './Cell';
import { useDragSelection } from '../hooks/useDragSelection';
import { getResponsiveGridStyle } from '../utils/resizeGrid';

interface GridProps {
  grid: Cell[][];
  cellSize: number;
  hintHighlight: { row: number; col: number } | null;
  onSelectionComplete: (selectedCells: { row: number; col: number }[]) => void;
}

export function Grid({ grid, cellSize, hintHighlight, onSelectionComplete }: GridProps) {
  const { selection, containerRef, handleStart, handleMove, handleEnd } = useDragSelection({
    gridSize: grid.length,
    onSelectionComplete
  });

  const isCellHinted = (row: number, col: number) => {
    return hintHighlight?.row === row && hintHighlight?.col === col;
  };

  // Optimize selection checking with Set for O(1) lookup
  const selectedCellsSet = new Set(selection.selectedCells.map(cell => `${cell.row},${cell.col}`));
  const isCellSelectedOptimized = (row: number, col: number) => {
    return selectedCellsSet.has(`${row},${col}`);
  };

  const gridStyle = getResponsiveGridStyle({
    rows: grid.length,
    cols: grid[0]?.length || 0,
    cellSize
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-hidden">
      <div
        ref={containerRef}
        className="relative"
        style={gridStyle}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <CellComponentMemo
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              isSelected={isCellSelectedOptimized(rowIndex, colIndex)}
              isHinted={isCellHinted(rowIndex, colIndex)}
              cellSize={cellSize}
              onMouseDown={handleStart}
              onTouchStart={handleStart}
            />
          ))
        )}
        
        {/* Selection line overlay */}
        {selection.isSelecting && selection.startCell && selection.currentCell && (
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
          >
            <line
              x1={selection.startCell.col * cellSize + cellSize / 2}
              y1={selection.startCell.row * cellSize + cellSize / 2}
              x2={selection.currentCell.col * cellSize + cellSize / 2}
              y2={selection.currentCell.row * cellSize + cellSize / 2}
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeDasharray="5,5"
              opacity="0.8"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
