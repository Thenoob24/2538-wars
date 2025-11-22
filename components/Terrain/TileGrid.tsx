// components/TileGrid.tsx

import React, { useCallback, useRef, useEffect } from 'react';
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import { getTileAsset } from './TileAssets';
import { GameConfig } from '../../constants/GameConfig';

const TILE_SIZE = GameConfig.TILE_DISPLAY_SIZE;

type GridSize = { width: number; height: number };

interface TileGridProps {
    tileMap: number[][];
    gridSize: GridSize;
    onTilePress?: (x: number, y: number) => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    editable?: boolean;
    isDrawing?: boolean; // <─ ajouté ici
}

export function TileGrid({
                             tileMap,
                             gridSize,
                             onTilePress,
                             onPressIn,
                             onPressOut,
                             editable = false,
                             isDrawing, // <─ DESTRUCTURATION OBLIGATOIRE
                         }: TileGridProps) {

    const scrollViewRef = useRef<ScrollView>(null);

    // Centre la grille au montage
    const centerGrid = useCallback(() => {
        const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
        const gridPixelWidth = gridSize.width * TILE_SIZE;
        const gridPixelHeight = gridSize.height * TILE_SIZE;

        const offsetX = Math.max(0, (gridPixelWidth - screenWidth) / 2);
        const offsetY = Math.max(0, (gridPixelHeight - screenHeight) / 2);

        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: offsetX, y: offsetY, animated: false });
        }, 50);
    }, [gridSize]);

    useEffect(() => {
        centerGrid();
    }, [centerGrid]);

    return (
        <TouchableWithoutFeedback
            onPressIn={editable ? onPressIn : undefined}
            onPressOut={editable ? onPressOut : undefined}
        >
            <View style={styles.container}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.outerScrollContent}

                    // ⬇️ correction : scroll désactivé uniquement quand on dessine
                    scrollEnabled={editable ? !isDrawing : true}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.innerScrollContent}
                    >
                        <View style={styles.grid}>
                            {tileMap.map((row, y) => (
                                <View key={y} style={styles.row}>
                                    {row.map((tileIndex, x) => (
                                        <Tile
                                            key={`${x}-${y}`}
                                            tileIndex={tileIndex}
                                            onPress={editable ? () => onTilePress?.(x, y) : undefined}
                                        />
                                    ))}
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
}

// Composant tuile optimisé
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
        borderWidth: 2,
        borderColor: '#1f2937',
        borderRadius: 8,
        overflow: 'hidden',
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
});
