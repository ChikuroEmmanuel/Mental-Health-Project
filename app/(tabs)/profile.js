import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, PhoneAuthProvider, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // For fetching user full name
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, // For toggles
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../firebaseConfig'; // Adjust path if needed


const ProfileScreen = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [lastLoginDate, setLastLoginDate] = useState('N/A');
  const [loading, setLoading] = useState(true);
  const recaptchaVerifier = useRef(null);

  // Example for switch states (you'd save these to AsyncStorage or Firestore for persistence)
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);


  // --- Fetch User Data ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        // Get last login date (Firebase provides this as a timestamp)
        if (user.metadata.lastSignInTime) {
          const date = new Date(user.metadata.lastSignInTime);
          setLastLoginDate(date.toLocaleDateString());
        } else {
          setLastLoginDate('N/A');
        }

        // Fetch full name from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserFullName(userDocSnap.data().fullName || 'User');
          } else {
            setUserFullName('User');
          }
        } catch (firestoreError) {
          console.error("Error fetching full name:", firestoreError);
          setUserFullName('User');
        }

      } else {
        // No user, navigate to login
        router.replace('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Handlers for actions ---
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged Out', 'You have been successfully logged out.');
      // onAuthStateChanged listener will handle navigation to '/'
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    if (!userEmail) {
      Alert.alert('Error', 'No user email found to reset password.');
      return;
    }
    Alert.alert(
      "Reset Password",
      "A password reset link will be sent to your email. Do you want to proceed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              await sendPasswordResetEmail(auth, userEmail);
              Alert.alert('Password Reset', 'A password reset email has been sent to your inbox.');
            } catch (error) {
              console.error("Error sending password reset email:", error);
              Alert.alert('Error', `Failed to send reset email: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const handleEnableMFA = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    try {
      // Step A: Fetch the user's phone number from Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists() || !userDocSnap.data().phoneNumber) {
        Alert.alert("Error", "No phone number found. Please add one during registration.");
        return;
      }
      const phoneNumber = userDocSnap.data().phoneNumber;

      // Step B: Send the verification SMS
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );

      // Step C: Navigate to the OTP screen (which you already built)
      Alert.alert("SMS Sent", "A verification code has been sent to your phone.");
      router.push({
        pathname: '/otp', // This is your existing otp.js route
        params: { verificationId: verificationId }
      });

    } catch (error) {
      console.error("Error enabling MFA: ", error);
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => Alert.alert('Deleting...', 'Feature to delete account is coming soon!'),
          // In a real app, you would prompt for re-authentication and then delete user and their data.
          // See Firebase docs for "Re-authenticate a user" and "Delete a user"
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
       <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={auth.app.options}
          attemptInvisibleVerification={true}
       /> 
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons name="heart" size={32} color="#8A2BE2" />
          </View>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account settings</Text>
        </View>

        {/* Account Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account-circle-outline" size={20} color="#333" />
            <Text style={styles.cardHeaderText}>Account Information</Text>
          </View>
          <View style={styles.accountInfoContent}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userFullName ? userFullName[0].toUpperCase() : 'U'}</Text>
            </View>
            <View>
              <Text style={styles.accountName}>{userFullName}</Text>
              <Text style={styles.accountEmail}>
                <MaterialCommunityIcons name="email-outline" size={14} color="#666" /> {userEmail}
              </Text>
            </View>
          </View>
        </View>

        {/* Privacy & Security Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="shield-outline" size={20} color="#333" />
            <Text style={styles.cardHeaderText}>Privacy & Security</Text>
          </View>
          <Text style={styles.securityText}>
            Your conversations are private and secure.
            We prioritize your mental health and privacy.
          </Text>
          <Text style={styles.lastLoginText}>Last login: {lastLoginDate}</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleEnableMFA}>
            <MaterialCommunityIcons name="two-factor-authentication" size={20} color="#8A2BE2" />
            <Text style={styles.actionButtonText}>Enable Two-Factor Authentication</Text>
            <FontAwesome name="chevron-right" size={14} color="#888" style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <MaterialCommunityIcons name="lock-reset" size={20} color="#8A2BE2" />
            <Text style={styles.actionButtonText}>Change Password</Text>
            <FontAwesome name="chevron-right" size={14} color="#888" style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* App Settings Card (New) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="cog-outline" size={20} color="#333" />
            <Text style={styles.cardHeaderText}>App Settings</Text>
          </View>

          <View style={styles.settingRow}>
            <MaterialCommunityIcons name="bell-outline" size={20} color="#333" />
            <Text style={styles.settingText}>Notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#8A2BE2" }}
              thumbColor={isNotificationsEnabled ? "#fff" : "#f4f3f4"}
              onValueChange={() => setIsNotificationsEnabled(previousState => !previousState)}
              value={isNotificationsEnabled}
              style={styles.switch}
            />
          </View>

          <View style={styles.settingRow}>
            <MaterialCommunityIcons name="theme-light-dark" size={20} color="#333" />
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#8A2BE2" }}
              thumbColor={isDarkModeEnabled ? "#fff" : "#f4f3f4"}
              onValueChange={() => setIsDarkModeEnabled(previousState => !previousState)}
              value={isDarkModeEnabled}
              style={styles.switch}
            />
          </View>
        </View>

        {/* Danger Zone (New) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="alert-outline" size={20} color="#d9534f" />
            <Text style={[styles.cardHeaderText, { color: '#d9534f' }]}>Danger Zone</Text>
          </View>

          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleDeleteAccount}>
            <MaterialCommunityIcons name="delete-outline" size={20} color="#d9534f" />
            <Text style={[styles.actionButtonText, { color: '#d9534f' }]}>Delete Account</Text>
            <FontAwesome name="chevron-right" size={14} color="#d9534f" style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button (placed outside cards for prominence) */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <MaterialCommunityIcons name="logout" size={20} color="#fff" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f7ff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 50, // Adjusted padding
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6e6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8A2BE2',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  accountInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6e6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  accountEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  securityText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    lineHeight: 20,
  },
  lastLoginText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1, // Takes up remaining space
    marginLeft: 10,
  },
  chevron: {
    marginLeft: 'auto', // Pushes chevron to the right
  },
  dangerButton: {
    borderBottomWidth: 0, // No border for the last item in a section
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  switch: {
    // Styling for the switch component can be tricky
    // You might need to adjust margin if it's not aligning perfectly
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Make switch a bit smaller
  },
  signOutButton: {
    backgroundColor: '#d9534f', // Red for sign out
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, // Space from the last card
    marginBottom: 20,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProfileScreen;