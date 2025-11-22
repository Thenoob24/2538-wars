// hooks/useEditorTools.ts
import { useState, useCallback } from 'react';

export type EditorTool = 'draw' | 'erase' | 'fill';
export type GridSize = { width: number; height: number };

export function useEditorTools(initialSize: GridSize = { width: 16, height: 16 }) {
    const [currentTool, setCurrentTool] = useState<EditorTool>('draw');
    const [selectedTile, setSelectedTile] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [gridSize, setGridSize] = useState<GridSize>(initialSize);

    const selectTool = useCallback((tool: EditorTool) => {
        setCurrentTool(tool);
    }, []);

    const selectTile = useCallback((tileIndex: number) => {
        setSelectedTile(tileIndex);
    }, []);

    const startDrawing = useCallback(() => setIsDrawing(true), []);
    const stopDrawing = useCallback(() => setIsDrawing(false), []);

    const updateGridSize = useCallback((newSize: GridSize) => {
        setGridSize(newSize);
    }, []);

    return {
        currentTool,
        selectedTile,
        isDrawing,
        gridSize,
        selectTool,
        selectTile,
        startDrawing,
        stopDrawing,
        updateGridSize,
    };
}