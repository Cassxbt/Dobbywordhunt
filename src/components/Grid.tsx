import { Cell } from '../types/game';
import { CellComponentMemo } from './Cell';
import { useDragSelection } from '../hooks/useDragSelection';

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

  // Calculate grid columns for CSS Grid
  const gridCols = grid[0]?.length || 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div
        ref={containerRef}
        className="grid gap-[2px] w-[85vw] max-w-[500px] aspect-square mx-auto relative"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          touchAction: 'none'
        }}
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
            className="absolute inset-0 pointer-events-none w-full h-full"
            style={{ zIndex: 10 }}
            viewBox={`0 0 ${gridCols} ${gridCols}`}
            preserveAspectRatio="none"
          >
            <line
              x1={selection.startCell.col + 0.5}
              y1={selection.startCell.row + 0.5}
              x2={selection.currentCell.col + 0.5}
              y2={selection.currentCell.row + 0.5}
              stroke="#8B5CF6"
              strokeWidth="0.15"
              strokeDasharray="0.2,0.2"
              opacity="0.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
