import { Link } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const LoginScreen = () => {
  // State hooks to store user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle the sign-in process
  const handleSignIn = () => {
    // Basic validation
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
    // For demonstration, we'll just log the credentials.
    // In a real app, you would implement your authentication logic here.
    console.log('Attempting to sign in with:');
    console.log('Email:', email);
    console.log('Password:', password);
    alert('Sign-in successful! (See console for details)');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Set status bar style to match the light background */}
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f5" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="heart" size={32} color="#8A2BE2" />
        </View>
        <Text style={styles.title}>MindCare</Text>
        <Text style={styles.subtitle}>Your mental wellness companion</Text>
      </View>

      {/* Login Form Card */}
      <View style={styles.formCard}>
        <Text style={styles.welcomeText}>Welcome Back</Text>

        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#aaa"
          secureTextEntry // Hides the password characters
          value={password}
          onChangeText={setPassword}
        />

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <Link href='/register' style={styles.signUpLink}>
            Sign up
          </Link>
        </View>
      </View>

      {/* Footer Text */}
      <Text style={styles.footerText}>Your privacy and security matter to us</Text>
    </SafeAreaView>
  );
};

// StyleSheet for all the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5', // A light greyish background
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e6e6fa', // Light lavender background for the icon
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#8A2BE2', // Purple color for the subtitle
    marginTop: 5,
  },
  formCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#444',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: '#8A2BE2', // Vibrant purple
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 14,
    color: '#888',
  },
  signUpLink: {
    fontSize: 14,
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: '#aaa',
  },
});

export default LoginScreen;