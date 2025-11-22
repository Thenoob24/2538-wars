// components/Graphics/GameHUD.tsx → VERSION FINALE ULTIME
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Building, getBuildingIcon } from '../Building/Building';
import { Truck, getTruckIcon, DEFAULT_TRUCK_ICON } from '../Units/Truck';
import { Engineer, getEngineerIcon, DEFAULT_ENGINEER_ICON } from '../Units/Engineer';
import { GameConfig } from '../../constants/GameConfig';

const TILE_SIZE = GameConfig.TILE_DISPLAY_SIZE;

interface GameHUDProps {
    resources: number;
    turn: number;
    selectedBuilding: Building | null;
    selectedTruck?: Truck | null;
    selectedEngineer?: Engineer | null;
    reachableTiles?: { x: number; y: number }[]; // ← NOUVEAU : cases atteignables
    onUpgrade?: () => void;
    onCreateTruck?: () => void;
    onCreateEngineer?: () => void;
    onEndTurn?: () => void;
    onBack?: () => void;
}

export function GameHUD({
                            resources,
                            turn,
                            selectedBuilding,
                            selectedTruck,
                            selectedEngineer,
                            reachableTiles = [],
                            onUpgrade,
                            onCreateTruck,
                            onCreateEngineer,
                            onEndTurn,
                            onBack,
                        }: GameHUDProps) {
    const selectedUnit = selectedTruck || selectedEngineer;

    return (
        <View style={styles.container}>
            {/* === TOP BAR === */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Ionicons name="diamond" size={20} color="#fbbf24" />
                        <Text style={styles.statText}>{resources}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons name="time" size={20} color="#60a5fa" />
                        <Text style={styles.statText}>Tour {turn}</Text>
                    </View>
                </View>
            </View>

            {/* === CASES ATTEIGNABLES (CORRIGÉES ET JOLIES) === */}
            {reachableTiles.length > 0 && (
                <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                    {reachableTiles.map((tile, i) => (
                        <View
                            key={i}
                            style={{
                                position: 'absolute',
                                left: tile.x * TILE_SIZE + 30 + (TILE_SIZE - 32) / 2,
                                top: tile.y * TILE_SIZE + 30 + (TILE_SIZE - 32) / 2,
                                width: 32,
                                height: 32,
                                backgroundColor: 'rgba(59, 130, 246, 0.3)',
                                borderWidth: 2,
                                borderColor: '#60a5fa',
                                borderRadius: 8,
                                zIndex: 2,
                            }}
                        />
                    ))}
                </View>
            )}

            {/* === PANNEAU DU BAS === */}
            {(selectedBuilding || selectedUnit) && (
                <View style={styles.bottomPanel}>
                    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onBack} />

                    <View style={styles.panelContent}>
                        {/* === PORTRAIT + INFOS === */}
                        <View style={styles.infoCard}>
                            {/* Portrait bâtiment */}
                            {selectedBuilding && getBuildingIcon(selectedBuilding) && (
                                <Image
                                    source={getBuildingIcon(selectedBuilding)}
                                    style={styles.portrait}
                                    resizeMode="contain"
                                />
                            )}

                            {/* Portrait unité */}
                            {selectedTruck && (
                                <Image
                                    source={getTruckIcon(selectedTruck)}
                                    style={styles.portrait}
                                    resizeMode="contain"
                                />
                            )}

                            {selectedEngineer && (
                                <Image
                                    source={getEngineerIcon(selectedEngineer)}
                                    style={styles.portrait}
                                    resizeMode="contain"
                                />
                            )}

                            {/* Infos bâtiment */}
                            {selectedBuilding && (
                                <>
                                    <Text style={styles.unitName}>
                                        {getBuildingName(selectedBuilding.type)} • Niv. {selectedBuilding.level}
                                    </Text>
                                    <Text style={styles.teamText}>Équipe {selectedBuilding.team}</Text>

                                    {selectedBuilding.health !== undefined && selectedBuilding.maxHealth && (
                                        <View style={styles.healthContainer}>
                                            <View style={styles.healthBarBg}>
                                                <View
                                                    style={[
                                                        styles.healthBarFill,
                                                        { width: `${(selectedBuilding.health / selectedBuilding.maxHealth) * 100}%` },
                                                    ]}
                                                />
                                            </View>
                                            <Text style={styles.healthText}>
                                                {selectedBuilding.health} / {selectedBuilding.maxHealth}
                                            </Text>
                                        </View>
                                    )}
                                </>
                            )}

                            {/* Infos unité */}
                            {selectedUnit && (
                                <>
                                    <Text style={styles.unitName}>
                                        {selectedTruck ? 'Camion de Ressources' : 'Ingénieur'}
                                    </Text>
                                    <Text style={styles.teamText}>Équipe {selectedUnit.team}</Text>
                                    <Text style={styles.status}>
                                        Mouvement : {selectedUnit.movementPoints}/
                                        {selectedTruck ? 5 : 4}
                                    </Text>
                                    {selectedTruck && (
                                        <Text style={styles.smallText}>
                                            {selectedTruck.isLoaded ? 'Chargé (+30)' : 'Vide'}
                                        </Text>
                                    )}
                                </>
                            )}
                        </View>

                        {/* === GRILLE D'ACTIONS === */}
                        <View style={styles.actionGrid}>
                            {/* Améliorer bâtiment */}
                            {selectedBuilding?.team === 'blue' && selectedBuilding.level < 5 && (
                                <TouchableOpacity
                                    style={[styles.actionButton, resources < 50 && styles.disabledButton]}
                                    onPress={onUpgrade}
                                    disabled={resources < 50}
                                >
                                    <Ionicons name="arrow-up-circle" size={36} color="#fff" />
                                    <Text style={styles.actionText}>Améliorer</Text>
                                    <Text style={styles.costText}>50</Text>
                                </TouchableOpacity>
                            )}

                            {/* Créer Camion */}
                            {selectedBuilding?.type === 'base' && selectedBuilding.team === 'blue' && (
                                <TouchableOpacity
                                    style={[styles.actionButton, resources < 50 && styles.disabledButton]}
                                    onPress={onCreateTruck}
                                    disabled={resources < 50}
                                >
                                    <Image source={DEFAULT_TRUCK_ICON} style={styles.unitIcon} resizeMode="contain" />
                                    <Text style={styles.actionText}>Camion</Text>
                                    <Text style={styles.costText}>50</Text>
                                </TouchableOpacity>
                            )}

                            {/* Créer Ingénieur */}
                            {selectedBuilding?.type === 'base' && selectedBuilding.team === 'blue' && (
                                <TouchableOpacity
                                    style={[styles.actionButton, resources < 100 && styles.disabledButton]}
                                    onPress={onCreateEngineer}
                                    disabled={resources < 100}
                                >
                                    <Image source={DEFAULT_ENGINEER_ICON} style={styles.unitIcon} resizeMode="contain" />
                                    <Text style={styles.actionText}>Ingénieur</Text>
                                    <Text style={styles.costText}>100</Text>
                                </TouchableOpacity>
                            )}

                            {/* Info Mine */}
                            {selectedBuilding?.type === 'mine' && (
                                <View style={styles.infoAction}>
                                    <Ionicons name="diamond" size={44} color="#fbbf24" />
                                    <Text style={styles.infoText}>Mine d’or</Text>
                                    <Text style={styles.smallInfo}>Envoyez un camion</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            )}

            {/* === BOUTON FIN DU TOUR === */}
            <View style={styles.endTurnContainer}>
                <TouchableOpacity style={styles.endTurnButton} onPress={onEndTurn}>
                    <Ionicons name="play-forward" size={28} color="#fff" />
                    <Text style={styles.endTurnText}>Fin du tour</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ──────────────────────────────────────
// Fonctions utilitaires
// ──────────────────────────────────────
function getBuildingName(type: string): string {
    switch (type) {
        case 'base': return 'Quartier Général';
        case 'mine': return 'Mine d\'Or';
        default: return type;
    }
}

// ──────────────────────────────────────
// Styles
// ──────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'box-none',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderBottomWidth: 2,
        borderBottomColor: '#1f2937',
    },
    backButton: {
        padding: 8,
        backgroundColor: '#374151',
        borderRadius: 8,
    },
    statsContainer: { flexDirection: 'row', gap: 16 },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#1f2937',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#374151',
    },
    statText: { color: '#fff', fontSize: 16, fontWeight: '600' },

    bottomPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 260,
    },
    panelContent: {
        position: 'absolute',
        bottom: 70,
        left: 16,
        right: 16,
        height: 190,
        backgroundColor: 'rgba(15, 23, 42, 0.97)',
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#3b82f6',
        flexDirection: 'row',
        padding: 16,
    },
    infoCard: {
        width: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    portrait: {
        width: 110,
        height: 110,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#3b82f6',
        backgroundColor: '#1f2937',
        marginBottom: 12,
    },
    unitName: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    teamText: { color: '#60a5fa', fontSize: 14, marginTop: 4 },
    status: { color: '#fbbf24', fontSize: 16, fontWeight: '600', marginTop: 8 },
    smallText: { color: '#9ca3af', fontSize: 13, marginTop: 4 },
    healthContainer: { marginTop: 12, width: '100%' },
    healthBarBg: { height: 10, backgroundColor: '#1f2937', borderRadius: 5, overflow: 'hidden' },
    healthBarFill: { height: '100%', backgroundColor: '#22c55e' },
    healthText: { color: '#fff', fontSize: 12, textAlign: 'center', marginTop: 4 },

    actionGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        gap: 16,
        alignItems: 'center',
    },
    actionButton: {
        width: 84,
        height: 94,
        backgroundColor: '#1e40af',
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#374151',
        borderColor: '#4b5563',
        opacity: 0.6,
    },
    unitIcon: { width: 64, height: 64 },
    actionText: { color: '#fff', fontSize: 12, marginTop: 4, fontWeight: '600' },
    costText: { color: '#fbbf24', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
    infoAction: { width: 84, height: 94, alignItems: 'center', justifyContent: 'center' },
    infoText: { color: '#fff', fontSize: 11, textAlign: 'center', marginTop: 6 },
    smallInfo: { color: '#9ca3af', fontSize: 10, textAlign: 'center' },

    endTurnContainer: { position: 'absolute', bottom: 16, right: 16 },
    endTurnButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#22c55e',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#16a34a',
    },
    endTurnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});