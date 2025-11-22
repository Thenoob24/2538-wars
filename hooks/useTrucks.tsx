// hooks/useTrucks.ts
import { useState, useCallback, useRef } from 'react';
import { Truck, TruckDirection } from '../components/Units/Truck';

const MAX_MOVEMENT = 5;
const GOLD_PER_TRIP = 30;
const MOVE_DELAY = 300; // Temps entre chaque case (ms)

export function useTrucks() {
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const calculateDirection = (fromX: number, fromY: number, toX: number, toY: number): TruckDirection => {
        const dx = toX - fromX;
        const dy = toY - fromY;

        // Si on va plus vers le bas que vers les côtés → on voit l'arrière du camion
        if (Math.abs(dy) >= Math.abs(dx) && dy > 0) return 'SE';
        if (Math.abs(dy) >= Math.abs(dx) && dy < 0) return 'NW';
        if (dx > 0) return 'SE';
        return 'SW';
    };

    const spawnTruck = useCallback((baseX: number, baseY: number, team: 'blue' | 'red' | 'green' | 'yellow') => {
        const newTruck: Truck = {
            id: `truck-${Date.now()}-${Math.random().toFixed(4)}`,
            team,
            x: baseX + 3,
            y: baseY + 1,
            direction: 'SE',
            isLoaded: false,
            movementPoints: MAX_MOVEMENT,
            isMoving: false,
        };
        setTrucks(prev => [...prev, newTruck]);
    }, []);

    // FONCTION ANIMÉE
    const moveTruckAnimated = useCallback((
        truckId: string,
        targetX: number,
        targetY: number,
        onArrived?: (truck: Truck) => void
    ) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setTrucks(prev => prev.map(truck => {
            if (truck.id !== truckId || truck.movementPoints <= 0 || truck.isMoving) return truck;

            let currentX = truck.x;
            let currentY = truck.y;
            let stepsLeft = Math.min(truck.movementPoints, Math.abs(targetX - truck.x) + Math.abs(targetY - truck.y));

            const moveStep = () => {
                if (stepsLeft <= 0) {
                    const arrivedTruck = { ...truck, x: currentX, y: currentY, isMoving: false };
                    setTrucks(prev => prev.map(t => t.id === truckId ? { ...t, ...arrivedTruck, movementPoints: t.movementPoints - (truck.movementPoints - stepsLeft) } : t));
                    if (onArrived) onArrived(arrivedTruck);
                    return;
                }

                const dx = targetX - currentX;
                const dy = targetY - currentY;

                if (Math.abs(dx) >= Math.abs(dy)) {
                    currentX += dx > 0 ? 1 : -1;
                } else {
                    currentY += dy > 0 ? 1 : -1;
                }

                const direction = calculateDirection(truck.x, truck.y, currentX, currentY);

                setTrucks(prev => prev.map(t =>
                    t.id === truckId
                        ? { ...t, x: currentX, y: currentY, direction, isMoving: true }
                        : t
                ));

                stepsLeft--;
                timeoutRef.current = setTimeout(moveStep, MOVE_DELAY);
            };

            moveStep();
            return { ...truck, isMoving: true };
        }));
    }, []);

    const loadTruck = useCallback((truckId: string) => {
        setTrucks(prev => prev.map(t => t.id === truckId ? { ...t, isLoaded: true } : t));
    }, []);

    const unloadTruck = useCallback((truckId: string): number => {
        setTrucks(prev => prev.map(t => t.id === truckId ? { ...t, isLoaded: false } : t));
        return GOLD_PER_TRIP;
    }, []);

    const resetTruckMovement = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setTrucks(prev => prev.map(t => ({ ...t, movementPoints: MAX_MOVEMENT, isMoving: false })));
    }, []);

    return {
        trucks,
        spawnTruck,
        moveTruckAnimated,    // ← bien exporté
        loadTruck,
        unloadTruck,
        resetTruckMovement,
    };
}