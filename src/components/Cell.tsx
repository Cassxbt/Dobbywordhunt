import React from 'react';
import { Cell } from '../types/game';

interface CellProps {
  cell: Cell;
  isSelected: boolean;
  isHinted: boolean;
  cellSize: number;
  onMouseDown: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
}

function CellComponent({ cell, isSelected, isHinted, onMouseDown, onTouchStart }: CellProps) {
  const getCellClasses = () => {
    let classes = 'aspect-square flex items-center justify-center border border-gray-200 font-semibold transition-all duration-200 ease-in-out cursor-pointer select-none rounded-md text-[clamp(0.8rem,2.5vw,1.2rem)] min-h-[32px] min-w-[32px]';
    
    if (cell.isFound) {
      classes += ' bg-primary-100 text-primary-800 border-primary-300';
    } else if (isHinted) {
      classes += ' bg-yellow-200 text-yellow-900 border-yellow-400 hint-glow';
    } else if (isSelected) {
      classes += ' bg-primary-200 text-primary-900 border-primary-400';
    } else {
      classes += ' bg-white text-gray-800 hover:bg-gray-50 active:scale-95';
    }
    
    return classes;
  };

  return (
    <div
      className={getCellClasses()}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      role="button"
      tabIndex={0}
      aria-label={`Cell ${cell.row},${cell.col}: ${cell.letter}`}
      style={{
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'manipulation'
      }}
    >
      {cell.letter}
    </div>
  );
}

export const CellComponentMemo = React.memo(CellComponent);
