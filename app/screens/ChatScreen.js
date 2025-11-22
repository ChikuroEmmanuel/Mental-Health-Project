import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react'; // Added useEffect
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import uuid from 'react-native-uuid'; // Added uuid
import { auth, db } from '../../firebaseConfig';
import styles from '../styles/ChatScreen.styles';

// ---------------------------------------------------------------
// ⚠️ UPDATE THIS URL ⚠️
// Copy the public URL from your Colab cell output
// (e.g., "https://prettied-repellingly-tanisha.ngrok-free.dev")
// ---------------------------------------------------------------
const API_URL = "https://prettied-repellingly-tanisha.ngrok-free.dev";
// ---------------------------------------------------------------


const ChatScreen = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef(); 
  
  // --- State for API connection ---
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUid] = useState(null);
  // ---

  // --- Initial chatMessages state is now just an empty array ---
  const [chatMessages, setChatMessages] = useState([]);

  // --- MODIFIED: Create session_id AND load messages ---
  useEffect(() => {
    // This creates a new session ID for the RAG pipeline
    setSessionId(uuid.v4());

    // --- NEW: Auth listener and message loader ---
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid); // Store the user's ID

        // Set up the Firestore listener to load messages
        const messagesRef = collection(db, 'users', user.uid, 'chatMessages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const loadedMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            sender: doc.data().sender,
            text: doc.data().text,
            // Format the Firestore timestamp to a readable time
            time: doc.data().createdAt?.toDate().toLocaleTimeString().substring(0, 5) || 'just now',
          }));

          if (loadedMessages.length > 0) {
            setChatMessages(loadedMessages);
          } else {
            // No history found, show the default greeting
            setChatMessages([
              { 
                id: 1, 
                sender: 'bot', 
                text: 'Hello Chikuro.Mbaji! I\'m here to support you. How are you feeling today?', 
                time: new Date().toLocaleTimeString().substring(0, 5)
              },
            ]);
          }
        });

        return () => unsubscribeSnapshot(); // Cleanup snapshot listener
      } else {
        router.replace('/'); // Not logged in
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
  }, [router]); // Added router to dependency array

  // --- MODIFIED: handleSend function ---
  const handleSend = async () => {
    // --- NEW: Added !uid check ---
    if (message.trim() === '' || isLoading || !uid) return;
    
    const userMessageText = message;
    setMessage(''); // Clear input immediately
    setIsLoading(true);

    // 1. Add the user's message to the chat
    const newUserMessage = {
      id: uuid.v4(), // --- Use UUID for a unique ID ---
      sender: 'user',
      text: userMessageText,
      time: new Date().toLocaleTimeString().substring(0, 5)
    };
    
    setChatMessages(prevChat => [...prevChat, newUserMessage]);

    // 2. --- NEW: Save user message to Firestore ---
    const messagesRef = collection(db, 'users', uid, 'chatMessages');
    await addDoc(messagesRef, {
      text: userMessageText,
      sender: 'user',
      createdAt: serverTimestamp(), // Use server time
      sessionId: sessionId, // Store which conversation this was
    });

    let botReplyText = '';

    try {
      // 3. Send message and session_id to the API (your existing logic)
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageText,
          session_id: sessionId, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        botReplyText = data.answer;
      } else {
        botReplyText = `Error: ${data.detail || 'Failed to get response'}`;
      }

    } catch (error) {
      console.error("Fetch error:", error);
      botReplyText = `Error: ${error.message}. Is the Colab server running?`;
    }

    // 4. Add the bot's reply to the chat
    const botReply = {
      id: uuid.v4(), // --- Use UUID for a unique ID ---
      sender: 'bot',
      text: botReplyText,
      time: new Date().toLocaleTimeString().substring(0, 5)
    };

    setChatMessages(prevChat => [...prevChat, botReply]);

    // 5. --- NEW: Save bot reply to Firestore ---
    await addDoc(messagesRef, {
      text: botReplyText,
      sender: 'bot',
      createdAt: serverTimestamp(),
      sessionId: sessionId,
    });
    
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
            <MaterialCommunityIcons name="heart-outline" size={20} color="#8A2BE2" />
          </View>
          <View>
            <Text style={styles.headerTitle}>MindCare Assistant</Text>
            <Text style={styles.headerSubtitle}>Always here for you</Text>
          </View>
        </View>
        <View style={{ width: 24 }} /> 
      </View>

      {/* --- Chat Area  --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView 
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: 20 }}
          ref={scrollViewRef} 
          onContentSizeChange={() => 
            scrollViewRef.current?.scrollToEnd({ animated: true }) 
          }
          
        >
          {chatMessages.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.botBubble
              ]}
            >
              {msg.sender === 'bot' && (
                <View style={styles.botIcon}>
                  <MaterialCommunityIcons name="heart-outline" size={16} color="#8A2BE2" />
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
          ))}
        </ScrollView>

        {/* --- NEW: Loading Indicator --- */}
        {isLoading && (
          <ActivityIndicator 
            style={{ marginVertical: 5 }} 
            size="small" 
            color="#8A2BE2" 
          />
        )}

        {/* --- Input Bar --- */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
            editable={!isLoading} // Disable input while loading
          />
          <TouchableOpacity 
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} // Assumes you have a .sendButtonDisabled style
            onPress={handleSend}
            disabled={isLoading} // Disable button while loading
          >
            <FontAwesome name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.disclaimer}>
          This is a supportive chatbot. For emergencies, please contact a mental health professional.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;