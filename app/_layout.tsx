// app/_layout.tsx

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    contentStyle: { backgroundColor: '#0a0a0a' },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="game" />
                <Stack.Screen name="editor" />
            </Stack>
        </>
    );
}