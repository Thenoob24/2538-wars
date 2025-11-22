// hooks/useBuildings.ts
import { useState, useCallback } from 'react';

export type BuildingType = 'base' | 'mine' | 'turret' | 'factory' | 'barrack' | 'wall';

export interface Building {
    id: string;
    type: BuildingType;
    team: 'blue' | 'red' | 'green' | 'yellow' | 'neutral';
    level: number;
    x: number;
    y: number;
    width: number;
    height: number;
    health?: number;
    maxHealth?: number;
    isConstructing?: boolean;
    constructionProgress?: number; // 0 à 100
}

export function useBuildings() {
    const [buildings, setBuildings] = useState<Building[]>([]);

    // === AJOUTER UN BÂTIMENT ===
    const spawnBuilding = useCallback((building: Building) => {
        setBuildings(prev => [...prev, building]);
    }, []);

    // === AMÉLIORER UN BÂTIMENT ===
    const upgradeBuilding = useCallback((buildingId: string, cost: number) => {
        setBuildings(prev => prev.map(b =>
            b.id === buildingId && b.level < 5
                ? { ...b, level: b.level + 1 }
                : b
        ));
        return cost;
    }, []);

    // === RÉPARER UN BÂTIMENT ===
    const repairBuilding = useCallback((buildingId: string, amount: number) => {
        setBuildings(prev => prev.map(b => {
            if (b.id === buildingId && b.health !== undefined && b.maxHealth !== undefined) {
                return {
                    ...b,
                    health: Math.min(b.health + amount, b.maxHealth),
                };
            }
            return b;
        }));
    }, []);

    // === DÉTRUIRE UN BÂTIMENT ===
    const destroyBuilding = useCallback((buildingId: string) => {
        setBuildings(prev => prev.filter(b => b.id !== buildingId));
    }, []);

    // === COMMENCER CONSTRUCTION (ingénieur) ===
    const startConstruction = useCallback((
        buildingId: string,
        type: BuildingType,
        x: number,
        y: number,
        team: 'blue'
    ) => {
        const newBuilding: Building = {
            id: buildingId,
            type,
            team,
            level: 1,
            x,
            y,
            width: type === 'base' ? 3 : 2,
            height: type === 'base' ? 3 : 2,
            health: 100,
            maxHealth: 500,
            isConstructing: true,
            constructionProgress: 0,
        };
        setBuildings(prev => [...prev, newBuilding]);
    }, []);

    // === AVANCER CONSTRUCTION (par tick) ===
    const progressConstruction = useCallback((buildingId: string, amount = 10) => {
        setBuildings(prev => prev.map(b => {
            if (b.id === buildingId && b.isConstructing) {
                const progress = (b.constructionProgress || 0) + amount;
                if (progress >= 100) {
                    return { ...b, isConstructing: false, constructionProgress: 100, health: b.maxHealth };
                }
                return { ...b, constructionProgress: progress };
            }
            return b;
        }));
    }, []);

    return {
        buildings,
        spawnBuilding,
        upgradeBuilding,
        repairBuilding,
        destroyBuilding,
        startConstruction,
        progressConstruction,
    };
}