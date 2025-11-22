// app/game-solo.tsx → VERSION QUI MARCHE À 100%
import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameGrid } from '../components/GameGrid';
import { GameHUD } from '../components/Graphics/GameHUD';
import { useGame } from '../hooks/useGame';

const STORAGE_KEY = '@strategy_game:saved_map_v2';

export default function GameSolo() {
    const router = useRouter();
    const [tileMap, setTileMap] = useState<number[][]>([]);
    const [gridSize, setGridSize] = useState({ width: 32, height: 32 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadMap();
    }, []);

    const loadMap = async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.gridSize && parsed.tileMap) {
                    setGridSize(parsed.gridSize);
                    setTileMap(parsed.tileMap);
                } else {
                    createDefaultMap();
                }
            } else {
                createDefaultMap();
            }
        } catch (err) {
            console.error('Erreur chargement carte:', err);
            createDefaultMap();
        } finally {
            setIsLoading(false);
        }
    };

    const createDefaultMap = () => {
        const defaultMap = Array(32).fill(null).map(() => Array(32).fill(1));
        setTileMap(defaultMap);
        setGridSize({ width: 32, height: 32 });
    };

    const {
        gameState,
        units,
        buildings,
        initializeMap,
        selectUnit,
        selectBuilding,
        createTruck,
        createEngineer,
        moveUnitTo,           // OUBLIÉ → AJOUTÉ ICI
        nextTurn,
        upgradeBuilding,
        setGameState,
    } = useGame(tileMap, gridSize);

    // Initialiser la carte une fois
    useEffect(() => {
        if (tileMap.length > 0 && buildings.length === 0) {
            initializeMap();
        }
    }, [tileMap, buildings.length, initializeMap]);

    // Cases atteignables
    const reachableTiles = useMemo(() => {
        const unit = gameState.selectedUnit;
        if (!unit) return [];

        const maxMove = unit.movementPoints;
        const tiles: { x: number; y: number }[] = [];

        for (let dx = -maxMove; dx <= maxMove; dx++) {
            for (let dy = -maxMove; dy <= maxMove; dy++) {
                if (Math.abs(dx) + Math.abs(dy) <= maxMove && (dx !== 0 || dy !== 0)) {
                    const x = unit.x + dx;
                    const y = unit.y + dy;
                    if (x >= 0 && x < gridSize.width && y >= 0 && y < gridSize.height) {
                        tiles.push({ x, y });
                    }
                }
            }
        }
        return tiles;
    }, [gameState.selectedUnit, gridSize]);

    const handleTilePress = (x: number, y: number) => {
        const selectedUnit = gameState.selectedUnit;
        if (selectedUnit) {
            const dist = Math.abs(selectedUnit.x - x) + Math.abs(selectedUnit.y - y);
            if (dist <= selectedUnit.movementPoints && dist > 0) {
                moveUnitTo(selectedUnit.id, x, y); // FONCTIONNE MAINTENANT
            } else {
                handleDeselectAll();
            }
        } else {
            handleDeselectAll();
        }
    };

    const handleDeselectAll = () => {
        setGameState(prev => ({
            ...prev,
            selectedBuilding: null,
            selectedUnit: null,
        }));
    };

    const handleBuildingPress = (building: any) => {
        handleDeselectAll();
        selectBuilding(building);
    };

    const handleUnitPress = (unit: any) => {
        handleDeselectAll();
        selectUnit(unit);
    };

    if (isLoading || !tileMap.length) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <GameGrid
                tileMap={tileMap}
                gridSize={gridSize}
                buildings={buildings}
                units={units}
                onTilePress={handleTilePress}
                onBuildingPress={handleBuildingPress}
                onUnitPress={handleUnitPress}
            />

            <GameHUD
                resources={gameState.resources.blue}
                turn={gameState.turn}
                selectedBuilding={gameState.selectedBuilding}
                selectedUnit={gameState.selectedUnit}
                reachableTiles={reachableTiles}
                onCreateTruck={createTruck}
                onCreateEngineer={createEngineer}
                onUpgrade={upgradeBuilding}
                onEndTurn={nextTurn}
                onBack={handleDeselectAll}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    loadingContainer: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#fff', fontSize: 18, marginTop: 16 },
});