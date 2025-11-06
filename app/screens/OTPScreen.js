import { useLocalSearchParams, useRouter } from 'expo-router';
import { PhoneAuthProvider, PhoneMultiFactorGenerator } from 'firebase/auth';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../../firebaseConfig'; // Adjust path if needed

const OTPScreen = () => {
    const router = useRouter();
    const [code, setCode] = useState('');
    // Get the verificationId passed from the login screen
    const { verificationId } = useLocalSearchParams();

    const confirmCode = async () => {
        if (!verificationId || !code) {
            Alert.alert("Error", "Missing verification details. Please try again.");
            return;
        }

        try {
            // Get the MFA credential
            const credential = PhoneAuthProvider.credential(verificationId, code);
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);

            // Complete the sign-in process with the second factor
            await auth.currentUser.multiFactor.enroll(multiFactorAssertion, "My Phone Number");
            
            Alert.alert("Success!", "Two-Factor Authentication has been enabled.",[{ text: "OK", onPress: () => router.back() }] // Go back to profile
            );
        } catch (error) {
            console.error("OTP Confirmation Error: ", error);
            Alert.alert("Error", "The code you entered was incorrect. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>A 6-digit code was sent to your phone.</Text>
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
                <Text style={styles.buttonText}>Confirm Code</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

// Add your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        width: '80%',
        height: 60,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 24,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#8A2BE2',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OTPScreen;