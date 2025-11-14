import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/ChatScreen.styles';

const ChatScreen = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef(); 
  
  
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'Hello Chikuro.Mbaji! I\'m here to support you. How are you feeling today?', 
      time: '13:18' 
    },
  ]);

  const handleSend = () => {
    if (message.trim() === '') return;
    
    
    const newUserMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString().substring(0, 5) // Simple time
    };
    
    
    const botReply = {
      id: chatMessages.length + 2,
      sender: 'bot',
      text: 'Thanks for sharing. Tell me more.',
      time: new Date().toLocaleTimeString().substring(0, 5)
    };

    setChatMessages([...chatMessages, newUserMessage, botReply]);
    setMessage('');
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

      {/* --- Chat Area  --- */}
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

        {/* --- Input Bar --- */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
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