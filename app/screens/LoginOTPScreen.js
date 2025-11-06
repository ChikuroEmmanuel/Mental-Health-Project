import { useLocalSearchParams, useRouter } from 'expo-router';
import { PhoneAuthProvider, PhoneMultiFactorGenerator } from 'firebase/auth';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

// This screen is passed a "resolver" which is not serializable
// We store it in a temporary global variable to pass it
let mfaResolver = null;
export const setMfaResolver = (resolver) => {
  mfaResolver = resolver;
};

const LoginOTPScreen = () => {
    const router = useRouter();
    const [code, setCode] = useState('');
    const { verificationId } = useLocalSearchParams();

    const confirmCode = async () => {
        if (!verificationId || !code || !mfaResolver) {
            Alert.alert("Error", "An error occurred. Please try logging in again.");
            router.replace('/');
            return;
        }

        try {
            const credential = PhoneAuthProvider.credential(verificationId, code);
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);

            // Resolve the sign-in with the second factor
            await mfaResolver.resolveSignIn(multiFactorAssertion);
            
            Alert.alert("Success!", "You have been logged in successfully.");
            router.replace('/(tabs)/home'); // Navigate to the home screen
        } catch (error) {
            console.error("Login OTP Error: ", error);
            Alert.alert("Error", "The code you entered was incorrect.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>A 6-digit code was sent to your phone to complete your login.</Text>
            <TextInput
                style={styles.input}
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
                textAlign="center"
            />
            <TouchableOpacity style={styles.button} onPress={confirmCode}>
                <Text style={styles.buttonText}>Confirm & Log In</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};
// (Add the same styles as your OTPScreen.js)
const styles = StyleSheet.create({ /* ... */ });

export default LoginOTPScreen;