// components/GameGrid.tsx → VERSION FINALE ULTIME (compatible useUnits + useBuildings)
import React, { useRef } from 'react';
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { getTileAsset } from './Terrain/TileAssets';
import { GameConfig } from '../constants/GameConfig';
import { BuildingComponent, Building } from './Building/Building';
import { TruckComponent } from './Units/Truck';
import { EngineerComponent } from './Units/Engineer';
import { Unit } from '../hooks/useUnits';

const TILE_SIZE = GameConfig.TILE_DISPLAY_SIZE;

type GridSize = { width: number; height: number };

interface GameGridProps {
    tileMap: number[][];
    gridSize: GridSize;
    buildings: Building[];
    units: Unit[];
    onTilePress?: (x: number, y: number) => void;
    onBuildingPress?: (building: Building) => void;
    onUnitPress?: (unit: Unit) => void;
}

export function GameGrid({
                             tileMap,
                             gridSize,
                             buildings,
                             units = [],
                             onTilePress,
                             onBuildingPress,
                             onUnitPress,
                         }: GameGridProps) {
    const scrollViewRef = useRef<ScrollView>(null);

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.outerScrollContent}
            >
                <ScrollView
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={styles.innerScrollContent}
                >
                    <View style={styles.grid}>
                        {/* === TERRAIN === */}
                        {tileMap.map((row, y) => (
                            <View key={y} style={styles.row}>
                                {row.map((tileIndex, x) => (
                                    <Tile
                                        key={`${x}-${y}`}
                                        tileIndex={tileIndex}
                                        onPress={onTilePress ? () => onTilePress(x, y) : undefined}
                                    />
                                ))}
                            </View>
                        ))}

                        {/* === BÂTIMENTS === */}
                        {buildings.map((building) => (
                            <View
                                key={building.id}
                                style={[
                                    styles.buildingWrapper,
                                    {
                                        left: building.x * TILE_SIZE,
                                        top: building.y * TILE_SIZE,
                                    },
                                ]}
                            >
                                <BuildingComponent
                                    building={building}
                                    onPress={onBuildingPress}
                                />
                            </View>
                        ))}

                        {/* === TOUTES LES UNITÉS (camion, ingénieur, futur tank, etc.) === */}
                        {units.map((unit) => (
                            <View
                                key={unit.id}
                                style={{
                                    position: 'absolute',
                                    left: unit.x * TILE_SIZE,
                                    top: unit.y * TILE_SIZE,
                                    zIndex: unit.type === 'engineer' ? 6 : 5,
                                }}
                            >
                                {unit.type === 'truck' && (
                                    <TruckComponent
                                        unit={unit}
                                        onPress={() => onUnitPress?.(unit)}
                                    />
                                )}
                                {unit.type === 'engineer' && (
                                    <EngineerComponent
                                        unit={unit}
                                        onPress={() => onUnitPress?.(unit)}
                                    />
                                )}
                                {/* Tu pourras ajouter ici : tank, soldier, etc. */}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </ScrollView>
        </View>
    );
}

// === TUILE OPTIMISÉE ===
interface TileProps {
    tileIndex: number;
    onPress?: () => void;
}

const Tile = React.memo(function Tile({ tileIndex, onPress }: TileProps) {
    const tileImage = getTileAsset(tileIndex);

    const content = (
        <View style={styles.tileContainer}>
            <Image source={tileImage} style={styles.tileImage} resizeMode="cover" />
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    outerScrollContent: {
        flexGrow: 1,
    },
    innerScrollContent: {
        flexGrow: 1,
        padding: 30,
    },
    grid: {
        position: 'relative',
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
        borderWidth: 2,
        borderColor: '#1f2937',
        borderRadius: 8,
        overflow: 'visible',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    row: {
        flexDirection: 'row',
    },
    tileContainer: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#222222',
    },
    tileImage: {
        width: TILE_SIZE,
        height: TILE_SIZE,
    },
    buildingWrapper: {
        position: 'absolute',
        zIndex: 10,
    },
});

export default GameGrid;