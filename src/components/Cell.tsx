import React from 'react';
import { Cell } from '../types/game';
import { getCellStyle } from '../utils/resizeGrid';

interface CellProps {
  cell: Cell;
  isSelected: boolean;
  isHinted: boolean;
  cellSize: number;
  onMouseDown: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
}

function CellComponent({ cell, isSelected, isHinted, cellSize, onMouseDown, onTouchStart }: CellProps) {
  const getCellClasses = () => {
    let classes = 'border border-gray-200 font-semibold transition-all duration-200 ease-in-out';
    
    if (cell.isFound) {
      classes += ' bg-primary-100 text-primary-800 border-primary-300';
    } else if (isHinted) {
      classes += ' bg-yellow-200 text-yellow-900 border-yellow-400 hint-glow';
    } else if (isSelected) {
      classes += ' bg-primary-200 text-primary-900 border-primary-400';
    } else {
      classes += ' bg-white text-gray-800 hover:bg-gray-50';
    }
    
    return classes;
  };

  return (
    <div
      className={getCellClasses()}
      style={getCellStyle(cellSize)}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      role="button"
      tabIndex={0}
      aria-label={`Cell ${cell.row},${cell.col}: ${cell.letter}`}
    >
      {cell.letter}
    </div>
  );
}

export const CellComponentMemo = React.memo(CellComponent);
