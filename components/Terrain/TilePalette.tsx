// components/TilePalette.tsx → Version "beaucoup plus de tuiles, plus petit, plus beau"

import React, { useState } from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    Text,
    StyleSheet,
    FlatList,
    Image,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { getTileAsset, TILESET_CONFIG } from '../components/TileAssets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// On augmente fortement le nombre de tuiles visibles
const TILES_PER_ROW = 8;           // 8 colonnes → tuiles plus petites mais toujours lisibles
const TILE_SIZE = (SCREEN_WIDTH * 0.90) / TILES_PER_ROW - 12; // ~90% de largeur écran, marges incluses
const TILES_PER_PAGE = TILES_PER_ROW * 8; // 8 lignes → 64 tuiles par page (au lieu de 32)

interface TilePaletteProps {
    visible: boolean;
    selectedTile: number;
    onSelect: (tileIndex: number) => void;
    onClose: () => void;
}

export function TilePalette({
                                visible,
                                selectedTile,
                                onSelect,
                                onClose,
                            }: TilePaletteProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(TILESET_CONFIG.TOTAL_TILES / TILES_PER_PAGE);

    const startIndex = currentPage * TILES_PER_PAGE;
    const endIndex = Math.min(startIndex + TILES_PER_PAGE, TILESET_CONFIG.TOTAL_TILES);
    const tiles = Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i);

    const handleSelect = (tileIndex: number) => {
        onSelect(tileIndex);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <SafeAreaView style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Palette de tuiles</Text>
                            <Text style={styles.subtitle}>
                                Page {currentPage + 1} / {totalPages} • Tuile sélectionnée : #{selectedTile}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>×</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Grille de tuiles */}
                    <FlatList
                        data={tiles}
                        numColumns={TILES_PER_ROW}
                        keyExtractor={(item) => item.toString()}
                        renderItem={({ item }) => (
                            <TilePaletteItem
                                tileIndex={item}
                                isSelected={item === selectedTile}
                                onPress={() => handleSelect(item)}
                            />
                        )}
                        contentContainerStyle={styles.grid}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Pagination */}
                    <View style={styles.pagination}>
                        <TouchableOpacity
                            onPress={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            style={[styles.navButton, currentPage === 0 && styles.navButtonDisabled]}
                        >
                            <Text style={styles.navText}>← Précédent</Text>
                        </TouchableOpacity>

                        <Text style={styles.pageText}>{currentPage + 1} / {totalPages}</Text>

                        <TouchableOpacity
                            onPress={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            style={[styles.navButton, currentPage === totalPages - 1 && styles.navButtonDisabled]}
                        >
                            <Text style={styles.navText}>Suivant →</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}


function TilePaletteItem({ tileIndex, isSelected, onPress }: {
    tileIndex: number;
    isSelected: boolean;
    onPress: () => void;
}) {
    const tileImage = getTileAsset(tileIndex);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.tileWrapper,
                isSelected && styles.tileSelected,
            ]}
        >
            <View style={styles.tileContainer}>
                <Image
                    source={tileImage}
                    style={styles.tileImage}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.tileLabel}>#{tileIndex}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '94%',
        maxHeight: '92%',
        backgroundColor: '#111827',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#374151',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#0f172a',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fbbf24',
    },
    subtitle: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 4,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        color: 'white',
        fontSize: 28,
        fontWeight: '300',
    },
    grid: {
        padding: 8,
    },
    tileWrapper: {
        margin: 4,
        alignItems: 'center',
    },
    tileContainer: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundColor: '#1e293b',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'transparent',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    tileSelected: {
        borderColor: '#fbbf24',
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 10,
    },
    tileImage: {
        width: '92%',
        height: '92%',
    },
    tileLabel: {
        marginTop: 4,
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: '600',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#0f172a',
        borderTopWidth: 1,
        borderTopColor: '#374151',
    },
    navButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#3b82f6',
        borderRadius: 12,
    },
    navButtonDisabled: {
        backgroundColor: '#374151',
    },
    navText: {
        color: 'white',
        fontWeight: '600',
    },
    pageText: {
        color: '#e2e8f0',
        fontSize: 16,
        fontWeight: 'bold',
    },
});