import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import Firebase auth services
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Adjust path if needed

const HomeScreen = () => {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState('');

    // Check for logged-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, get their email
                setUserEmail(user.email);
            } else {
                // User is signed out, navigate to login
                router.replace('/');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Handle user sign-out
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // The onAuthStateChanged listener will handle the navigation
        } catch (error) {
            console.error("Error signing out: ", error);
            alert('Error signing out. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.welcomeText}>Welcome Back!</Text>
                <Text style={styles.emailText}>{userEmail}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f0f0f5',
        padding: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    emailText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#8A2BE2',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HomeScreen;