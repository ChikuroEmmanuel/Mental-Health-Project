import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import styles from '../styles/ChatHistoryScreen.styles';

const ChatHistoryScreen = () => {
  const router = useRouter();
  
  // State to manage visibility of the tip card
  const [showTip, setShowTip] = useState(true);

  // Placeholder for conversation data (Empty for now to show Empty State)
  // Later, you will fetch this from Firestore ('conversations' collection)
  const conversations = []; 

  const handleStartNewChat = () => {
    // Navigate to the Chat tab (which starts a chat)
    // Or you can create a specific logic to start a *fresh* chat
    router.push('/(tabs)/chat');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- Header --- */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="history" size={24} color="#8A2BE2" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Chat History</Text>
          <Text style={styles.headerSubtitle}>Your conversation history</Text>
        </View>
      </View>

      {/* --- Content Container --- */}
      <View style={styles.container}>
        
        {/* 1. Empty State Card (Shows only if no conversations) */}
        {conversations.length === 0 && (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="message-text-outline" size={60} color="#e6e6fa" />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              You haven't started any sessions with the MindCare Assistant yet.
            </Text>
            
            {/* Action Button to fix the "Dead End" UX */}
            <TouchableOpacity 
              style={styles.startChatButton}
              onPress={handleStartNewChat}
            >
              <Text style={styles.startChatText}>Start New Chat</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2. Tip Card (Dismissible) */}
        {showTip && (
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              <Text style={{ fontWeight: 'bold' }}>💡 Tip: </Text>
              Regular conversations help track your mental health journey. Consider reviewing your chat history to identify patterns.
            </Text>
            <TouchableOpacity 
              onPress={() => setShowTip(false)} 
              style={styles.closeTipButton}
            >
              <Ionicons name="close" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* 3. List of Conversations will go here later... */}

      </View>

      {/* 4. Floating Action Button (FAB) */}
      {/* Always visible so user can start a chat from anywhere on this screen */}
      <TouchableOpacity style={styles.fab} onPress={handleStartNewChat}>
        <MaterialCommunityIcons name="plus" size={30} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default ChatHistoryScreen;