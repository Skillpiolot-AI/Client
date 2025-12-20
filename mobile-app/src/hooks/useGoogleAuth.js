// Google Authentication Hook
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = '617112929155-qpo9es7nh8d7ouf9nlmvem7ghqcop1d5.apps.googleusercontent.com';

export const useGoogleAuth = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: GOOGLE_CLIENT_ID,
        // For Expo Go, we need to use the Expo proxy
        expoClientId: GOOGLE_CLIENT_ID,
    });

    const signInWithGoogle = async () => {
        try {
            const result = await promptAsync();
            if (result?.type === 'success') {
                const { authentication } = result;
                return {
                    success: true,
                    accessToken: authentication?.accessToken,
                    idToken: authentication?.idToken,
                };
            }
            return { success: false, error: 'Google sign-in was cancelled' };
        } catch (error) {
            console.error('Google sign-in error:', error);
            return { success: false, error: error.message };
        }
    };

    return {
        request,
        response,
        signInWithGoogle,
        isReady: !!request,
    };
};

// Helper to get user info from Google
export const getGoogleUserInfo = async (accessToken) => {
    try {
        const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to get Google user info:', error);
        return null;
    }
};

export default useGoogleAuth;
