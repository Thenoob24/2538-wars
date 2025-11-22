// hooks/useGame.ts → VERSION CORRIGÉE
import { useState, useCallback, useEffect } from 'react';
import { useUnits, Unit } from './useUnits';
import { useBuildings, Building } from './useBuildings';

interface GameState {
    selectedBuilding: Building | null;
    selectedUnit: Unit | null;
    resources: { blue: number; red: number };
    turn: number;
    currentPlayer: 'blue' | 'red';
}

export function useGame(initialMap: number[][], gridSize: { width: number; height: number }) {
    // ✅ CORRECTION ICI : utiliser moveUnitAnimated au lieu de moveUnitTo
    const { units, spawnUnit, moveUnitAnimated, resetMovement } = useUnits();
    const { buildings, spawnBuilding } = useBuildings();

    const [gameState, setGameState] = useState<GameState>({
        selectedBuilding: null,
        selectedUnit: null,
        resources: { blue: 300, red: 300 },
        turn: 1,
        currentPlayer: 'blue',
    });

    // INITIALISATION DE LA CARTE
    const initializeMap = useCallback(() => {
        // Blue HQ + mine
        spawnBuilding({ id: 'hq-blue', type: 'base', team: 'blue', level: 1, x: 3, y: 3, width: 3, height: 3, health: 1000, maxHealth: 1000 });
        spawnBuilding({ id: 'mine-blue', type: 'mine', team: 'neutral', level: 1, x: 8, y: 6, width: 3, height: 3 });

        // Red HQ + mine
        spawnBuilding({ id: 'hq-red', type: 'base', team: 'red', level: 1, x: gridSize.width - 6, y: gridSize.height - 6, width: 3, height: 3, health: 1000, maxHealth: 1000 });
        spawnBuilding({ id: 'mine-red', type: 'mine', team: 'neutral', level: 1, x: gridSize.width - 11, y: gridSize.height - 9, width: 3, height: 3 });

        // Unités de départ
        spawnUnit({ id: 'truck-blue-1', type: 'truck', team: 'blue', x: 7, y: 4, direction: 'SE', movementPoints: 5, maxMovementPoints: 5, data: { isLoaded: false } });
        spawnUnit({ id: 'engineer-blue-1', type: 'engineer', team: 'blue', x: 8, y: 5, direction: 'SE', movementPoints: 4, maxMovementPoints: 4 });
        spawnUnit({ id: 'truck-red-1', type: 'truck', team: 'red', x: gridSize.width - 7, y: gridSize.height - 5, direction: 'NW', movementPoints: 5, maxMovementPoints: 5, data: { isLoaded: false } });
        spawnUnit({ id: 'engineer-red-1', type: 'engineer', team: 'red', x: gridSize.width - 8, y: gridSize.height - 6, direction: 'NW', movementPoints: 4, maxMovementPoints: 4 });
    }, [gridSize, spawnBuilding, spawnUnit]);

    const nextTurn = useCallback(() => {
        resetMovement();
        setGameState(prev => ({
            ...prev,
            turn: prev.turn + 1,
            currentPlayer: prev.currentPlayer === 'blue' ? 'red' : 'blue',
        }));
    }, [resetMovement]);

    const selectUnit = useCallback((unit: Unit) => {
        setGameState(prev => ({
            ...prev,
            selectedUnit: prev.selectedUnit?.id === unit.id ? null : unit,
            selectedBuilding: null,
        }));
    }, []);

    const selectBuilding = useCallback((building: Building) => {
        setGameState(prev => ({
            ...prev,
            selectedBuilding: prev.selectedBuilding?.id === building.id ? null : building,
            selectedUnit: null,
        }));
    }, []);

    const createTruck = useCallback(() => {
        if (gameState.resources.blue < 50) return;
        const hq = buildings.find(b => b.type === 'base' && b.team === 'blue');
        if (!hq) return;

        spawnUnit({
            id: `truck-${Date.now()}`,
            type: 'truck',
            team: 'blue',
            x: hq.x + 4,
            y: hq.y + 1,
            direction: 'SE',
            movementPoints: 5,
            maxMovementPoints: 5,
            data: { isLoaded: false },
        });

        setGameState(prev => ({ ...prev, resources: { ...prev.resources, blue: prev.resources.blue - 50 } }));
    }, [gameState.resources.blue, buildings, spawnUnit]);

    const createEngineer = useCallback(() => {
        if (gameState.resources.blue < 100) return;
        const hq = buildings.find(b => b.type === 'base' && b.team === 'blue');
        if (!hq) return;

        spawnUnit({
            id: `engineer-${Date.now()}`,
            type: 'engineer',
            team: 'blue',
            x: hq.x + 5,
            y: hq.y + 2,
            direction: 'SE',
            movementPoints: 4,
            maxMovementPoints: 4,
        });

        setGameState(prev => ({ ...prev, resources: { ...prev.resources, blue: prev.resources.blue - 100 } }));
    }, [gameState.resources.blue, buildings, spawnUnit]);

    // ✅ WRAPPER pour garder le nom moveUnitTo dans l'API publique
    const moveUnitTo = useCallback((unitId: string, x: number, y: number) => {
        moveUnitAnimated(unitId, x, y);
    }, [moveUnitAnimated]);

    return {
        gameState,
        units,
        buildings,
        initializeMap,
        selectUnit,
        selectBuilding,
        createTruck,
        createEngineer,
        moveUnitTo,        // ✅ MAINTENANT DISPONIBLE
        nextTurn,
        setGameState,
    };
}