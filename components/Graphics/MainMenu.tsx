// components/MainMenu.tsx

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';

interface MainMenuProps {
    onStartSolo: () => void;
    onStartCampaign: () => void;
    onStartMultiplayer: () => void;
    onStartEditor: () => void;
    onStartGame: () => void; // ← NOUVEAU : pour le mode de jeu
}

export function MainMenu({
                             onStartSolo,
                             onStartCampaign,
                             onStartMultiplayer,
                             onStartEditor,
                             onStartGame, // ← NOUVEAU
                         }: MainMenuProps) {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>

                    {/* Titre */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>🎮 Strategy Game</Text>
                        <Text style={styles.subtitle}>Jeu de stratégie en tuiles</Text>
                    </View>

                    {/* Boutons du menu */}
                    <View style={styles.menuButtons}>

                        {/* ← NOUVEAU : Mode de jeu avec bases */}
                        <MenuButton
                            title="⚔️ Jouer"
                            description="Mode de jeu avec bases et améliorations"
                            onPress={onStartGame}
                            color="#22c55e"
                        />

                        <MenuButton
                            title="🧭 Solo (Démo)"
                            description="Jouer une partie classique"
                            onPress={onStartSolo}
                            color="#10b981"
                        />

                        <MenuButton
                            title="📜 Campagne"
                            description="Progressez à travers plusieurs missions"
                            onPress={onStartCampaign}
                            color="#f59e0b"
                        />

                        <MenuButton
                            title="🌐 Multijoueur"
                            description="Affrontez d'autres joueurs"
                            onPress={onStartMultiplayer}
                            color="#ef4444"
                            disabled
                        />

                        <MenuButton
                            title="✏️ Éditeur"
                            description="Créer une carte personnalisée"
                            onPress={onStartEditor}
                            color="#3b82f6"
                        />

                        <MenuButton
                            title="⚙️ Options"
                            description="Paramètres du jeu"
                            onPress={() => alert('Options - À venir')}
                            color="#8b5cf6"
                            disabled
                        />

                        <MenuButton
                            title="ℹ️ À propos"
                            description="Informations sur le jeu"
                            onPress={() =>
                                alert('Strategy Game v1.0\nCréé avec Expo & React Native')
                            }
                            color="#6b7280"
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Créé avec ❤️ en React Native</Text>
                    </View>

                </View>
            </SafeAreaView>
        </View>
    );
}

interface MenuButtonProps {
    title: string;
    description: string;
    onPress: () => void;
    color: string;
    disabled?: boolean;
}

function MenuButton({
                        title,
                        description,
                        onPress,
                        color,
                        disabled = false,
                    }: MenuButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.menuButton,
                { borderColor: color },
                disabled && styles.menuButtonDisabled,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <View style={[styles.menuButtonAccent, { backgroundColor: color }]} />
            <View style={styles.menuButtonContent}>
                <Text style={[styles.menuButtonTitle, disabled && styles.textDisabled]}>
                    {title}
                </Text>
                <Text
                    style={[styles.menuButtonDescription, disabled && styles.textDisabled]}
                >
                    {description}
                </Text>
            </View>
            <Text style={[styles.menuButtonArrow, disabled && styles.textDisabled]}>→</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#94a3b8',
        textAlign: 'center',
    },
    menuButtons: {
        gap: 16,
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderRadius: 12,
        borderWidth: 2,
        overflow: 'hidden',
        minHeight: 80,
    },
    menuButtonDisabled: {
        opacity: 0.5,
    },
    menuButtonAccent: {
        width: 6,
        height: '100%',
    },
    menuButtonContent: {
        flex: 1,
        padding: 16,
    },
    menuButtonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    menuButtonDescription: {
        fontSize: 14,
        color: '#94a3b8',
    },
    menuButtonArrow: {
        fontSize: 24,
        color: 'white',
        marginRight: 16,
    },
    textDisabled: {
        color: '#64748b',
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#64748b',
    },
});