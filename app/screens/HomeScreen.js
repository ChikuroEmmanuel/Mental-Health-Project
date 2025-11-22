import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // 2. Added FontAwesome
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../firebaseConfig';
import styles from '../styles/HomeScreen.styles';

const affirmations = [
  "You are strong, capable, and resilient.",
  "Be kind to yourself today. You're doing your best.",
  "Your feelings are valid. It's okay to feel them.",
  "Every small step forward is still progress.",
  "You are deserving of peace and happiness.",
  "It's okay to rest and recharge.",
  "You have the power to create a positive change.",
  "Your mental health matters, and seeking support is a sign of strength.", // <-- Added this one!
  "It's okay to not be okay, and it's okay to ask for help.",
  "You are loved, valued, and enough.",
];

const HomeScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null); 
  const [menuVisible, setMenuVisible] = useState(false);
  const [userFullName, setUserFullName] = useState('');
  const [greeting, setGreeting] = useState('Welcome'); // 3. Add state for greeting
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  
  // --- Function to get a random affirmation ---
  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentAffirmation(affirmations[randomIndex]);
  };

  // Check for logged-in user and fetch their name
  useEffect(() => {
    getRandomAffirmation();
    // 4. Set the greeting based on the time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists() && userDocSnap.data().fullName ) {
           const fullName = userDocSnap.data().fullName;
           const firstName = fullName.replace('.', ' ').split(' ')[0];

           setUserFullName(firstName);
          } else {
            setUserFullName('User'); 
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
          setUserFullName('User'); 
        }

      } else {
        router.replace('/');
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Menu Navigation Handlers (no changes) ---
  const onMenuButtonPress = (path) => {
    setMenuVisible(false); 
    if (path === '/(tabs)/profile' || path === '/(tabs)/home') {
      router.push(path); 
    } else {
      alert(`Maps to ${path}`);
    }
  };

  // --- Modal for the 3-dot menu (no changes) ---
  const renderMenuModal = () => (
    <Modal
      visible={menuVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setMenuVisible(false)}
    >
      <Pressable style={styles.modalBackdrop} onPress={() => setMenuVisible(false)} />
      <View style={styles.menuContainer}>
        {/* ... menu items ... */}
        <TouchableOpacity style={styles.menuItem} onPress={() => onMenuButtonPress('/(tabs)/home')}>
          <Text style={styles.menuItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onMenuButtonPress('/about')}>
          <Text style={styles.menuItemText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onMenuButtonPress('/(tabs)/profile')}>
          <Text style={styles.menuItemText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderMenuModal()}
      
      {/* --- Header Section (no changes) --- */}
      <View style={styles.headerContainer}>
        <Text style={styles.logoText}>YouthCare</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <MaterialCommunityIcons name="dots-vertical" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Main Body with New Greeting --- */}
      <ScrollView style={styles.scrollContainer}>
        
        {/* Good Morning section */}
        <View style={styles.greetingContainer}>
          <View style={styles.avatarContainer}>
            {/* Placeholder for profile pic. You can use an <Image> tag here later */}
            <FontAwesome name="user" size={20} color="#8A2BE2" />
          </View>
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greetingMessage}>{greeting}, {userFullName || 'User'}!</Text>
            <Text style={styles.greetingSubtext}>How are you feeling today?</Text>
          </View>
        </View>
        
        {/* --- Daily Affirmations Section  --- */}
        <Text style={styles.sectionTitle}>Daily Affirmation</Text>
        <LinearGradient
          colors={['#8A2BE2', '#6A0DAD']} // Purple gradient colors
          style={styles.affirmationCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.affirmationContent}>
            <MaterialCommunityIcons 
              name="sparkles" // Sparkle icon
              size={40} 
              color="#fff" 
              style={styles.affirmationSparkleIcon} 
            />
            <Text style={styles.affirmationText}>{currentAffirmation}</Text>
            <TouchableOpacity 
              style={styles.newAffirmationButton} 
              onPress={getRandomAffirmation}
            >
              <MaterialCommunityIcons name="cached" size={18} color="#fff" />
              <Text style={styles.newAffirmationButtonText}>New Affirmation</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* --- AI Mental Health Support Card */}
        <Text style={styles.sectionTitle}>AI Mental Health Support</Text>
        <View style={styles.chatCard}>
          <View style={styles.chatCardHeader}>
            <View style={styles.chatIconContainer}>
              <MaterialCommunityIcons name="chat-processing-outline" size={24} color="#8A2BE2" />
            </View>
            <Text style={styles.chatTitle}>Your MindCare Assistant</Text>
          </View>
          <Text style={styles.chatDescription}>
            Our AI-powered chatbot is here to provide emotional support, coping
            strategies, and a safe space to express your feelings. Available 24/7
            whenever you need someone to talk to.
          </Text>
          <TouchableOpacity 
            style={styles.chatButtonPrimary}
            onPress={() => router.push('/(tabs)/chat')} // Navigates to your chat tab
          >
            <MaterialCommunityIcons name="chat-outline" size={20} color="#fff" />
            <Text style={styles.chatButtonTextPrimary}>Start Chatting</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.chatButtonSecondary}
            onPress={() => router.push('/history')}
            >
            <MaterialCommunityIcons name="history" size={20} color="#8A2BE2" />
            <Text style={styles.chatButtonTextSecondary}>My Conversations</Text>
          </TouchableOpacity>
        </View>

        { /* --- Self Care Section --- */}
        <Text style={styles.sectionTitle}>Quick Self Care</Text>
        <TouchableOpacity 
          style={styles.quickCard} 
          onPress={() => router.push('/breathing')}
        >
          <View style={[styles.quickIconContainer, styles.quickIconBlue]}>
            <Ionicons name="filter-circle-outline" size={24} color="#5A9CB8" />
          </View>
          <View style={styles.quickTextContainer}>
            <Text style={styles.quickTitle}>Breathing Exercise</Text>
            <Text style={styles.quickSubtitle}>Calm your mind with guided breathing</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickCard} 
          onPress={() => router.push('/(tabs)/journal')} // Navigates to Journal
        >
          <View style={[styles.quickIconContainer, styles.quickIconGreen]}>
            <MaterialCommunityIcons name="pencil-outline" size={24} color="#6A9A65" />
          </View>
          <View style={styles.quickTextContainer}>
            <Text style={styles.quickTitle}>Quick Journal Prompt</Text>
            <Text style={styles.quickSubtitle}>Reflect on your thoughts and feelings</Text>
          </View>
        </TouchableOpacity>

      
        

      </ScrollView>
    </SafeAreaView>
  );
};



export default HomeScreen;