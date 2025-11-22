// hooks/useGridManager.ts

import { useState, useCallback } from 'react';
import { GameConfig } from '../constants/GameConfig';
import {
    createEmptyGrid,
    createRandomGrid,
    floodFill,
    cloneGrid,
} from '../utils/tileHelpers';

export function useGridManager(initialSize: number = GameConfig.GRID_SIZE) {
    const [gridSize] = useState(initialSize);
    const [tileMap, setTileMap] = useState<number[][]>(() =>
        createEmptyGrid(initialSize)
    );

    // Mettre à jour une tuile spécifique
    const updateTile = useCallback((x: number, y: number, tileIndex: number) => {
        setTileMap((prev) => {
            const newGrid = cloneGrid(prev);
            if (y >= 0 && y < gridSize && x >= 0 && x < gridSize) {
                newGrid[y][x] = tileIndex;
            }
            return newGrid;
        });
    }, [gridSize]);

    // Effacer une tuile (mettre à 0)
    const eraseTile = useCallback((x: number, y: number) => {
        updateTile(x, y, 0);
    }, [updateTile]);

    // Remplir une zone
    const fillArea = useCallback((x: number, y: number, tileIndex: number) => {
        setTileMap((prev) => {
            if (y < 0 || y >= gridSize || x < 0 || x >= gridSize) return prev;
            const targetTile = prev[y][x];
            return floodFill(prev, x, y, targetTile, tileIndex);
        });
    }, [gridSize]);

    // Réinitialiser la grille
    const resetGrid = useCallback((fillTile: number = 0) => {
        setTileMap(createEmptyGrid(gridSize, fillTile));
    }, [gridSize]);

    // Créer une grille aléatoire
    const randomizeGrid = useCallback((maxTileIndex: number = 11) => {
        setTileMap(createRandomGrid(gridSize, maxTileIndex));
    }, [gridSize]);

    // Charger une grille depuis un tableau
    const loadGrid = useCallback((grid: number[][]) => {
        if (grid.length === gridSize && grid[0].length === gridSize) {
            setTileMap(cloneGrid(grid));
        }
    }, [gridSize]);

    return {
        gridSize,
        tileMap,
        updateTile,
        eraseTile,
        fillArea,
        resetGrid,
        randomizeGrid,
        loadGrid,
    };
}