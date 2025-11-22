// app/game.tsx

import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { TileGrid } from '../components/TileGrid';
import { useGridManager } from '../hooks/useGridManager';

export default function Game() {
    const router = useRouter();
    const { tileMap, randomizeGrid } = useGridManager();

    // Générer une carte aléatoire au démarrage
    useEffect(() => {
        randomizeGrid(30); // Utiliser les 30 premières tuiles pour plus de variété
    }, []);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header de jeu */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backText}>← Menu</Text>
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>🎮 En jeu</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => alert('Menu de pause - À venir')}
                    >
                        <Text style={styles.menuText}>⋯</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Grille de jeu (lecture seule) */}
            <TileGrid tileMap={tileMap} editable={false} />

            {/* Interface de jeu (HUD) */}
            <View style={styles.hud}>
                <View style={styles.hudSection}>
                    <Text style={styles.hudLabel}>Or</Text>
                    <Text style={styles.hudValue}>1000 💰</Text>
                </View>
                <View style={styles.hudSection}>
                    <Text style={styles.hudLabel}>Population</Text>
                    <Text style={styles.hudValue}>50 / 100 👥</Text>
                </View>
                <View style={styles.hudSection}>
                    <Text style={styles.hudLabel}>Tour</Text>
                    <Text style={styles.hudValue}>1 🔄</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    safeArea: {
        backgroundColor: '#111827',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#111827',
        borderBottomWidth: 2,
        borderBottomColor: '#374151',
    },
    backButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#374151',
        borderRadius: 8,
    },
    backText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#374151',
        borderRadius: 8,
    },
    menuText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    hud: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderTopWidth: 2,
        borderTopColor: '#374151',
    },
    hudSection: {
        alignItems: 'center',
    },
    hudLabel: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 4,
    },
    hudValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});