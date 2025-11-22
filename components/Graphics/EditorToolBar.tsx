// components/EditorToolbar.tsx

import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
} from 'react-native';
import { GameConfig, getTilePosition } from '../../constants/GameConfig';
import type { EditorTool } from '../../hooks/useEditorTools';

type GridSize = { width: number; height: number };

interface EditorToolbarProps {
    currentTool: EditorTool;
    onToolChange: (tool: EditorTool) => void;
    selectedTile: number;
    onOpenPalette: () => void;

    // Redimensionnement de la grille
    gridSize: GridSize;
    onGridSizeChange: (size: GridSize) => void;

    // Actions classiques
    onBack?: () => void;
    onSave?: () => void;
    onLoad?: () => void;
    onClear?: () => void;
}

export function EditorToolbar({
                                  currentTool,
                                  onToolChange,
                                  selectedTile,
                                  onOpenPalette,
                                  gridSize,
                                  onGridSizeChange,
                                  onBack,
                                  onSave,
                                  onLoad,
                                  onClear,
                              }: EditorToolbarProps) {

    const changeSize = (deltaW: number, deltaH: number) => {
        onGridSizeChange({
            width: Math.max(8, Math.min(64, gridSize.width + deltaW)),
            height: Math.max(8, Math.min(64, gridSize.height + deltaH)),
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Barre principale */}
            <View style={styles.container}>
                {/* ← Retour */}
                {onBack && (
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <Text style={styles.backText}>Retour</Text>
                    </TouchableOpacity>
                )}

                {/* Outils centraux */}
                <View style={styles.toolsContainer}>
                    <ToolButton
                        label="Dessiner"
                        active={currentTool === 'draw'}
                        onPress={() => onToolChange('draw')}
                        color="#10b981"
                    />
                    <ToolButton
                        label="Effacer"
                        active={currentTool === 'erase'}
                        onPress={() => onToolChange('erase')}
                        color="#ef4444"
                    />
                    <ToolButton
                        label="Remplir"
                        active={currentTool === 'fill'}
                        onPress={() => onToolChange('fill')}
                        color="#3b82f6"
                    />
                </View>

                {/* Sélecteur de tuile */}
                <TouchableOpacity style={styles.tileSelector} onPress={onOpenPalette}>
                    <Text style={styles.tileLabel}>#{selectedTile}</Text>
                </TouchableOpacity>
            </View>

            {/* Barre secondaire (actions + taille) */}
            <View style={styles.secondaryBar}>
                {/* Contrôle de la taille de la grille */}
                <View style={styles.sizeControl}>
                    <Text style={styles.sizeText}>
                        Taille : {gridSize.width}×{gridSize.height}
                    </Text>
                    <View style={styles.sizeButtons}>
                        <TouchableOpacity
                            style={styles.sizeBtn}
                            onPress={() => changeSize(-4, -4)}
                        >
                            <Text style={styles.sizeBtnText}>−</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.sizeBtn}
                            onPress={() => changeSize(4, 4)}
                        >
                            <Text style={styles.sizeBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Boutons d'action */}
                {onClear && (
                    <TouchableOpacity style={styles.secondaryButton} onPress={onClear}>
                        <Text style={styles.secondaryButtonText}>Effacer tout</Text>
                    </TouchableOpacity>
                )}
                {onSave && (
                    <TouchableOpacity style={styles.secondaryButton} onPress={onSave}>
                        <Text style={styles.secondaryButtonText}>Sauvegarder</Text>
                    </TouchableOpacity>
                )}
                {onLoad && (
                    <TouchableOpacity style={styles.secondaryButton} onPress={onLoad}>
                        <Text style={styles.secondaryButtonText}>Charger</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

// Bouton d'outil
interface ToolButtonProps {
    label: string;
    active: boolean;
    onPress: () => void;
    color: string;
}

function ToolButton({ label, active, onPress, color }: ToolButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.toolButton,
                active && { backgroundColor: color, borderColor: color },
            ]}
            onPress={onPress}
        >
            <Text style={[styles.toolButtonText, active && styles.toolButtonTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}



// Styles
const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#111827',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
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
    toolsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    toolButton: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        backgroundColor: '#374151',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    toolButtonText: {
        color: '#d1d5db',
        fontSize: 13,
        fontWeight: '600',
    },
    toolButtonTextActive: {
        color: 'white',
    },
    tileSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#374151',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#fbbf24',
    },
    previewContainer: {
        width: 44,
        height: 44,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#fbbf24',
        borderRadius: 6,
        backgroundColor: '#1f2937',
    },
    tileLabel: {
        color: '#fbbf24',
        fontSize: 15,
        fontWeight: 'bold',
    },
    secondaryBar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#1f2937',
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    sizeControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#374151',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 12,
    },
    sizeText: {
        color: '#e5e7eb',
        fontSize: 13,
        fontWeight: '600',
    },
    sizeButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    sizeBtn: {
        width: 32,
        height: 32,
        backgroundColor: '#4b5563',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sizeBtnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#374151',
        borderRadius: 8,
    },
    secondaryButtonText: {
        color: '#d1d5db',
        fontSize: 13,
        fontWeight: '600',
    },
});