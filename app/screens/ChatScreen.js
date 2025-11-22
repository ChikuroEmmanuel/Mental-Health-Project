import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection, // <--- NEW
  doc,
  onSnapshot,
  orderBy,
  query, // <--- NEW
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import uuid from 'react-native-uuid';
import { auth, db } from '../../firebaseConfig';
import styles from '../styles/ChatScreen.styles';

const API_URL = "https://prettied-repellingly-tanisha.ngrok-free.dev";

const ChatScreen = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef(); 
  
  // --- State ---
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUid] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // --- Load Session & Messages ---
  useEffect(() => {
    setSessionId(uuid.v4());

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);

        const messagesRef = collection(db, 'users', user.uid, 'chatMessages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const loadedMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            sender: doc.data().sender,
            text: doc.data().text,
            time: doc.data().createdAt?.toDate().toLocaleTimeString().substring(0, 5) || 'just now',
          }));

          if (loadedMessages.length > 0) {
            setChatMessages(loadedMessages);
          } else {
            setChatMessages([]); // Empty state
          }
        });

        return () => unsubscribeSnapshot();
      } else {
        router.replace('/');
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  // --- Handle New Chat (Reset) ---
  const handleNewChat = () => {
    Alert.alert(
      "Start New Conversation?",
      "This will clear the current screen and start a fresh topic.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Start New", 
          onPress: () => {
            const newId = uuid.v4();
            setSessionId(newId);
            setChatMessages([]); // Clear screen
          }
        }
      ]
    );
  };

  // --- Handle Sending Messages ---
  const handleSend = async () => {
    if (message.trim() === '' || isLoading || !uid) return;
    
    const textToSend = message;
    setMessage(''); 
    setIsLoading(true);

    // 1. Add User Message to UI
    const newUserMessage = {
      id: uuid.v4(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString().substring(0, 5)
    };
    setChatMessages(prev => [...prev, newUserMessage]);

    // 2. Save Message to Firestore (chatMessages collection)
    const messagesRef = collection(db, 'users', uid, 'chatMessages');
    await addDoc(messagesRef, {
      text: textToSend,
      sender: 'user',
      createdAt: serverTimestamp(),
      sessionId: sessionId,
    });

    // 3. --- NEW: Update Conversation Metadata (conversations collection) ---
    // This creates/updates a document with the ID of the sessionId
    await setDoc(doc(db, 'users', uid, 'conversations', sessionId), {
      lastMessage: textToSend,
      lastActive: serverTimestamp(),
      sessionId: sessionId
    }, { merge: true }); 
    // { merge: true } ensures we don't overwrite other fields if we add them later

    let botReplyText = '';

    try {
      // 4. Fetch from API
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          session_id: sessionId, 
        }),
      });

      const data = await response.json();
      botReplyText = response.ok ? data.answer : `Error: ${data.detail || 'Failed'}`;

    } catch (error) {
      console.error("Fetch error:", error);
      botReplyText = "I'm having trouble connecting right now. Please check your internet connection.";
    }

    // 5. Add Bot Reply to UI
    const botReply = {
      id: uuid.v4(),
      sender: 'bot',
      text: botReplyText,
      time: new Date().toLocaleTimeString().substring(0, 5)
    };
    setChatMessages(prev => [...prev, botReply]);

    // 6. Save Bot Reply to Firestore
    await addDoc(messagesRef, {
      text: botReplyText,
      sender: 'bot',
      createdAt: serverTimestamp(),
      sessionId: sessionId,
    });

    // 7. --- NEW: Update Conversation Metadata with Bot Reply ---
    await setDoc(doc(db, 'users', uid, 'conversations', sessionId), {
      lastMessage: botReplyText,
      lastActive: serverTimestamp(),
      sessionId: sessionId
    }, { merge: true });
    
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name="robot-happy-outline" size={20} color="#8A2BE2" />
          </View>
          <View>
            <Text style={styles.headerTitle}>MindCare Assistant</Text>
            <Text style={styles.headerSubtitle}>Always here for you</Text>
          </View>
        </View>
        
        {/* NEW CHAT BUTTON */}
        <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
          <MaterialCommunityIcons name="restart" size={24} color="#8A2BE2" />
        </TouchableOpacity>
      </View>

      {/* --- Chat Area --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView 
          style={styles.chatContainer}
          contentContainerStyle={chatMessages.length === 0 ? styles.emptyChatContainer : styles.chatContentContainer}
          ref={scrollViewRef} 
          onContentSizeChange={() => 
            scrollViewRef.current?.scrollToEnd({ animated: true }) 
          }
        >
          {chatMessages.length === 0 ? (
            /* --- EMPTY STATE --- */
            <View style={styles.emptyStateBox}>
              <View style={styles.emptyStateIconContainer}>
                <MaterialCommunityIcons name="robot-happy-outline" size={40} color="#8A2BE2" />
              </View>
              <Text style={styles.emptyStateTitle}>How may I help you today?</Text>
              <Text style={styles.emptyStateSubtitle}>
                I'm here to listen and support you. Feel free to share what's on your mind.
              </Text>
            </View>
          ) : (
            /* --- CHAT MESSAGES --- */
            chatMessages.map((msg) => (
              <View 
                key={msg.id} 
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.botBubble
                ]}
              >
                {msg.sender === 'bot' && (
                  <View style={styles.botIcon}>
                    <MaterialCommunityIcons name="robot-happy-outline" size={16} color="#8A2BE2" />
                  </View>
                )}
                <View style={styles.messageTextContainer}>
                  <Text style={[
                    styles.messageText,
                    msg.sender === 'user' && styles.userMessageText
                  ]}>
                    {msg.text}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    msg.sender === 'user' && styles.userMessageTime
                  ]}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            ))
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <View style={{ padding: 10, alignItems: 'flex-start' }}>
               <View style={[styles.botBubble, { padding: 10 }]}>
                 <ActivityIndicator size="small" color="#8A2BE2" />
               </View>
            </View>
          )}
        </ScrollView>

        {/* --- Input Bar --- */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.toolsButton} onPress={() => Alert.alert("Tools", "Shortcuts coming soon.")}>
            <Ionicons name="add" size={24} color="#8A2BE2" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={isLoading}
          >
            <FontAwesome name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={() => Alert.alert("Safety", "Emergency contacts...")}>
          <Text style={styles.disclaimer}>
            This is a supportive chatbot. <Text style={{textDecorationLine: 'underline'}}>Tap for emergency resources.</Text>
          </Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;