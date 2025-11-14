import { StyleSheet } from 'react-native';

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e6e6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8A2BE2',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f7ff', // Light purple background
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#e6e6fa', // Light purple bubble
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: '#8A2BE2', // Dark purple bubble
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  botIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 10,
  },
  messageTextContainer: {
    flex: 1,
  },
  // --- CORRECTED STYLES ---
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  userMessageText: {
    color: '#fff', // White text for user messages
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  userMessageTime: {
    color: '#eee', // Lighter time text for user messages
  },
  // --- (End of corrections) ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120, // To allow multiline but not take over screen
    backgroundColor: '#f0f0f5',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimer: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
});

export default styles;