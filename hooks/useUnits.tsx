// hooks/useUnits.ts → GÈRE TOUTES LES UNITÉS + ANIMATIONS
import { useState, useCallback, useRef } from 'react';

export type UnitType = 'truck' | 'engineer' | 'tank' | 'soldier';

export interface Unit {
    id: string;
    type: UnitType;
    team: 'blue' | 'red' | 'green' | 'yellow';
    x: number;
    y: number;
    direction: 'NE' | 'NW' | 'SE' | 'SW';
    movementPoints: number;
    maxMovementPoints: number;
    isMoving?: boolean;
    data?: any; // Pour truck.isLoaded, engineer.repairing, etc.
}

const MOVE_DELAY = 250; // ms entre chaque case

export function useUnits() {
    const [units, setUnits] = useState<Unit[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // === AJOUTER UNE UNITÉ ===
    const spawnUnit = useCallback((unit: Unit) => {
        setUnits(prev => [...prev, { ...unit, isMoving: false }]);
    }, []);

    // === DÉPLACEMENT ANIMÉ (TOUTES LES UNITÉS) ===
    const moveUnitAnimated = useCallback((
        unitId: string,
        targetX: number,
        targetY: number,
        onComplete?: (unit: Unit) => void
    ) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setUnits(prev => prev.map(unit => {
            if (unit.id !== unitId || unit.isMoving || unit.movementPoints <= 0) return unit;

            let currentX = unit.x;
            let currentY = unit.y;
            let stepsLeft = Math.min(unit.movementPoints, Math.abs(targetX - unit.x) + Math.abs(targetY - unit.y));

            const moveStep = () => {
                if (stepsLeft <= 0) {
                    const finalUnit = {
                        ...unit,
                        x: currentX,
                        y: currentY,
                        isMoving: false,
                        movementPoints: unit.movementPoints - (unit.movementPoints - stepsLeft),
                    };
                    setUnits(prev => prev.map(u => u.id === unitId ? finalUnit : u));
                    if (onComplete) onComplete(finalUnit);
                    return;
                }

                const dx = targetX - currentX;
                const dy = targetY - currentY;

                if (Math.abs(dx) >= Math.abs(dy)) {
                    currentX += dx > 0 ? 1 : -1;
                } else {
                    currentY += dy > 0 ? 1 : -1;
                }

                // Calcul direction
                const newDx = currentX - unit.x;
                const newDy = currentY - unit.y;
                let direction: Unit['direction'] = 'SE';
                if (Math.abs(newDx) > Math.abs(newDy)) {
                    direction = newDx > 0 ? 'SE' : 'SW';
                } else {
                    direction = newDy > 0 ? 'SE' : 'NE';
                }

                setUnits(prev => prev.map(u =>
                    u.id === unitId
                        ? { ...u, x: currentX, y: currentY, direction, isMoving: true }
                        : u
                ));

                stepsLeft--;
                timeoutRef.current = setTimeout(moveStep, MOVE_DELAY);
            };

            moveStep();
            return { ...unit, isMoving: true };
        }));
    }, []);

    // === RÉINITIALISER MOUVEMENT (fin de tour) ===
    const resetMovement = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setUnits(prev => prev.map(u => ({
            ...u,
            movementPoints: u.maxMovementPoints,
            isMoving: false,
        })));
    }, []);

    return {
        units,
        spawnUnit,
        moveUnitAnimated,
        resetMovement,
    };
}