// utils/tileHelpers.ts

import { GameConfig } from '../constants/GameConfig';

/**
 * Crée une grille vide remplie d'une tuile par défaut
 */
export function createEmptyGrid(size: number, defaultTile: number = 0): number[][] {
    return Array(size)
        .fill(0)
        .map(() => Array(size).fill(defaultTile));
}

/**
 * Crée une grille aléatoire avec des tuiles variées
 */
export function createRandomGrid(size: number, maxTileIndex: number = 5): number[][] {
    return Array(size)
        .fill(0)
        .map(() =>
            Array(size)
                .fill(0)
                .map(() => Math.floor(Math.random() * maxTileIndex))
        );
}

/**
 * Algorithme de remplissage (flood fill)
 */
export function floodFill(
    grid: number[][],
    startX: number,
    startY: number,
    targetTile: number,
    replacementTile: number
): number[][] {
    const newGrid = grid.map(row => [...row]);

    if (targetTile === replacementTile) return newGrid;

    const queue: [number, number][] = [[startX, startY]];
    const visited = new Set<string>();
    const gridSize = grid.length;

    while (queue.length > 0) {
        const [x, y] = queue.shift()!;
        const key = `${x},${y}`;

        if (visited.has(key)) continue;
        if (x < 0 || y < 0 || x >= gridSize || y >= gridSize) continue;
        if (newGrid[y][x] !== targetTile) continue;

        visited.add(key);
        newGrid[y][x] = replacementTile;

        // Ajouter les cases adjacentes
        queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    return newGrid;
}

/**
 * Clone profond d'une grille
 */
export function cloneGrid(grid: number[][]): number[][] {
    return grid.map(row => [...row]);
}

/**
 * Sauvegarde une grille en JSON
 */
export function serializeGrid(grid: number[][]): string {
    return JSON.stringify(grid);
}

/**
 * Charge une grille depuis JSON
 */
export function deserializeGrid(json: string): number[][] | null {
    try {
        const grid = JSON.parse(json);
        if (Array.isArray(grid) && Array.isArray(grid[0])) {
            return grid;
        }
        return null;
    } catch {
        return null;
    }
}