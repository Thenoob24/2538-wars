// app/editor.tsx
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert, AppState } from 'react-native';
import { useRouter } from 'expo-router';
import { TileGrid } from '../components/Terrain/TileGrid';
import { EditorToolbar } from '../components/Graphics/EditorToolBar';
import { TilePalette } from '../components/Terrain/TilePalette';
import { useEditorTools, GridSize } from '../hooks/useEditorTools';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@strategy_game:saved_map_v2';

export default function Editor() {
    const router = useRouter();
    const [isPaletteVisible, setIsPaletteVisible] = React.useState(false);

    const {
        currentTool,
        selectedTile,
        isDrawing,
        gridSize,
        selectTool,
        selectTile,
        startDrawing,
        stopDrawing,
        updateGridSize,
    } = useEditorTools({ width: 32, height: 32 });

    // === Tile Map ===
    const [tileMap, setTileMap] = React.useState<number[][]>(() =>
        Array(gridSize.height).fill(null).map(() => Array(gridSize.width).fill(0))
    );

    // Adapter la carte lors d'un changement de taille
    useEffect(() => {
        setTileMap(prev => {
            const newMap = Array(gridSize.height)
                .fill(null)
                .map(() => Array(gridSize.width).fill(0));

            for (let y = 0; y < Math.min(prev.length, gridSize.height); y++) {
                for (let x = 0; x < Math.min(prev[y]?.length || 0, gridSize.width); x++) {
                    newMap[y][x] = prev[y][x];
                }
            }
            return newMap;
        });
    }, [gridSize]);

    // === Tools ===
    const applyTool = useCallback((x: number, y: number) => {
        // ❗ Correction : on autorise le clic simple
        // (isDrawing continue de gérer le "drag")

        setTileMap(prev => {
            const newMap = prev.map(row => [...row]);

            if (currentTool === 'draw') {
                newMap[y][x] = selectedTile;
            } else if (currentTool === 'erase') {
                newMap[y][x] = 0;
            } else if (currentTool === 'fill') {
                const target = prev[y][x];
                if (target === selectedTile) return prev;

                const queue: [number, number][] = [[x, y]];
                const visited = new Set<string>();

                while (queue.length > 0) {
                    const [cx, cy] = queue.shift()!;
                    const key = `${cx},${cy}`;
                    if (visited.has(key)) continue;
                    visited.add(key);

                    if (
                        cy < 0 || cy >= gridSize.height ||
                        cx < 0 || cx >= gridSize.width ||
                        prev[cy][cx] !== target
                    ) continue;

                    newMap[cy][cx] = selectedTile;

                    queue.push(
                        [cx + 1, cy],
                        [cx - 1, cy],
                        [cx, cy + 1],
                        [cx, cy - 1]
                    );
                }
            }

            return newMap;
        });
    }, [currentTool, selectedTile, gridSize]);

    const handleTilePress = useCallback((x: number, y: number) => {
        applyTool(x, y);
    }, [applyTool]);

    // === Save ===
    const handleSave = useCallback(async () => {
        try {
            const data = JSON.stringify({
                gridSize,
                tileMap,
            });
            await AsyncStorage.setItem(STORAGE_KEY, data);
            Alert.alert('Succès', 'Carte sauvegardée !');
        } catch (err) {
            Alert.alert('Erreur', 'Impossible de sauvegarder.');
            console.error(err);
        }
    }, [gridSize, tileMap]);

    // === Load ===
    const handleLoad = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (!data) {
                Alert.alert('Info', 'Aucune sauvegarde trouvée.');
                return;
            }

            const parsed = JSON.parse(data);
            if (parsed.gridSize && parsed.tileMap) {
                updateGridSize(parsed.gridSize);
                setTileMap(parsed.tileMap);
                Alert.alert('Succès', 'Carte chargée !');
            } else {
                Alert.alert('Erreur', 'Données incompatibles.');
            }
        } catch (err) {
            Alert.alert('Erreur', 'Échec du chargement.');
            console.error(err);
        }
    }, [updateGridSize]);

    // === Clear ===
    const handleClear = useCallback(() => {
        Alert.alert(
            'Effacer tout',
            'Voulez-vous vraiment tout effacer ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Oui',
                    style: 'destructive',
                    onPress: () => setTileMap(prev =>
                        prev.map(row => row.map(() => 0))
                    ),
                },
            ]
        );
    }, []);

    // === Auto-Save ===
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'background' || state === 'inactive') {
                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ gridSize, tileMap })).catch(() => {});
            }
        });
        return () => subscription.remove();
    }, [gridSize, tileMap]);

    return (
        <View style={styles.container}>
            <EditorToolbar
                currentTool={currentTool}
                onToolChange={selectTool}
                selectedTile={selectedTile}
                onOpenPalette={() => setIsPaletteVisible(true)}
                gridSize={gridSize}
                onGridSizeChange={updateGridSize}
                onBack={() => router.back()}
                onSave={handleSave}
                onLoad={handleLoad}
                onClear={handleClear}
            />

            <TileGrid
                tileMap={tileMap}
                gridSize={gridSize}
                onTilePress={handleTilePress}
                editable
                isDrawing={isDrawing}
                onPressIn={startDrawing}
                onPressOut={stopDrawing}
            />

            <TilePalette
                visible={isPaletteVisible}
                selectedTile={selectedTile}
                onSelect={(tileIndex) => {
                    selectTile(tileIndex);
                    setIsPaletteVisible(false);
                }}
                onClose={() => setIsPaletteVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});
