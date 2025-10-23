import { useState, useCallback, useRef, useEffect } from 'react';
import { DragSelection } from '../types/game';

export interface UseDragSelectionProps {
  gridSize: number;
  onSelectionComplete: (selectedCells: { row: number; col: number }[]) => void;
}

export function useDragSelection({ gridSize, onSelectionComplete }: UseDragSelectionProps) {
  const [selection, setSelection] = useState<DragSelection>({
    startCell: null,
    currentCell: null,
    selectedCells: [],
    isSelecting: false
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  const getCellFromEvent = useCallback((event: React.TouchEvent | React.MouseEvent | Touch | MouseEvent) => {
    if (!containerRef.current) return null;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const cellSize = Math.min(rect.width / gridSize, rect.height / gridSize);
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    // Add tolerance for edge detection (allow 10% overflow)
    const tolerance = 0.1;
    if (row >= -tolerance && row < gridSize + tolerance && 
        col >= -tolerance && col < gridSize + tolerance) {
      // Clamp to valid range
      const clampedRow = Math.max(0, Math.min(gridSize - 1, row));
      const clampedCol = Math.max(0, Math.min(gridSize - 1, col));
      return { row: clampedRow, col: clampedCol };
    }

    return null;
  }, [gridSize]);

  const calculateSelectedCells = useCallback((start: { row: number; col: number }, end: { row: number; col: number }) => {
    const cells: { row: number; col: number }[] = [];
    
    const deltaRow = end.row - start.row;
    const deltaCol = end.col - start.col;
    
    // Determine if it's a straight line (horizontal, vertical, or diagonal)
    const isHorizontal = deltaRow === 0;
    const isVertical = deltaCol === 0;
    const isDiagonal = Math.abs(deltaRow) === Math.abs(deltaCol);
    
    if (!isHorizontal && !isVertical && !isDiagonal) {
      return cells; // Not a valid selection
    }
    
    const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
    const stepRow = deltaRow === 0 ? 0 : deltaRow / Math.abs(deltaRow);
    const stepCol = deltaCol === 0 ? 0 : deltaCol / Math.abs(deltaCol);
    
    for (let i = 0; i <= steps; i++) {
      const row = start.row + Math.round(i * stepRow);
      const col = start.col + Math.round(i * stepCol);
      
      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        cells.push({ row, col });
      }
    }
    
    return cells;
  }, [gridSize]);

  const handleStart = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    // Prevent default behavior for touch events
    if ('touches' in event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const cell = getCellFromEvent(event);
    
    if (cell) {
      setSelection({
        startCell: cell,
        currentCell: cell,
        selectedCells: [cell],
        isSelecting: true
      });
    }
  }, [getCellFromEvent]);

  const handleMove = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    if (!selection.isSelecting || !selection.startCell) return;
    
    // Prevent default behavior for touch events
    if ('touches' in event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Cancel previous RAF if it exists
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    // Use RAF to throttle updates
    rafIdRef.current = requestAnimationFrame(() => {
      const cell = getCellFromEvent(event);
      
      if (cell && selection.startCell) {
        const selectedCells = calculateSelectedCells(selection.startCell, cell);
        setSelection(prev => ({
          ...prev,
          currentCell: cell,
          selectedCells
        }));
      }
    });
  }, [selection.isSelecting, selection.startCell, getCellFromEvent, calculateSelectedCells]);

  const handleEnd = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    if (!selection.isSelecting || !selection.startCell) return;
    
    // Prevent default behavior for touch events
    if ('touches' in event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Cancel any pending RAF
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    const cell = getCellFromEvent(event);
    
    if (cell && selection.startCell) {
      const selectedCells = calculateSelectedCells(selection.startCell, cell);
      
      if (selectedCells.length > 1) {
        onSelectionComplete(selectedCells);
      }
    }
    
    setSelection({
      startCell: null,
      currentCell: null,
      selectedCells: [],
      isSelecting: false
    });
  }, [selection.isSelecting, selection.startCell, getCellFromEvent, calculateSelectedCells, onSelectionComplete]);

  // Global event listeners for mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (selection.isSelecting) {
        handleMove(e as any);
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (selection.isSelecting) {
        handleEnd(e as any);
      }
    };

    if (selection.isSelecting) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [selection.isSelecting, handleMove, handleEnd]);

  // Global event listeners for touch events
  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (selection.isSelecting) {
        e.preventDefault();
        handleMove(e as any);
      }
    };

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (selection.isSelecting) {
        e.preventDefault();
        handleEnd(e as any);
      }
    };

    if (selection.isSelecting) {
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false });
    }

    return () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [selection.isSelecting, handleMove, handleEnd]);

  return {
    selection,
    containerRef,
    handleStart,
    handleMove,
    handleEnd
  };
}
