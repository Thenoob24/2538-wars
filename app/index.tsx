// app/index.tsx

import React from 'react';
import { useRouter } from 'expo-router';
import { MainMenu } from '../components/Graphics/MainMenu';

export default function Index() {
    const router = useRouter();

    return (
        <MainMenu
            onStartGame={() => router.push('/game-solo')}
            onStartEditor={() => router.push('/editor')}
        />
    );
}