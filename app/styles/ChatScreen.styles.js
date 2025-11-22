import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
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
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8A2BE2',
  },
  newChatButton: {
    padding: 5,
  },
  
  // --- Chat Area ---
  keyboardAvoidingContainer: {
    flex: 1,
  },
 chatContainer: {
    flex: 1,
    backgroundColor: '#f8f7ff', // Light purple background
  },
  // Style for when messages exist (Standard list)
  chatContentContainer: {
    paddingBottom: 20,
    padding: 10,
  },
  // Style for when NO messages exist (Allows centering)
  emptyChatContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  // --- NEW EMPTY STATE STYLES ---
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6e6fa', // Light purple circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
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
    backgroundColor: '#fff', // Clean white for bot
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#e6e6fa',
  },
  userBubble: {
    backgroundColor: '#8A2BE2',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  botIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e6e6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 10,
  },
  messageTextContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },

  // --- Input Bar ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  toolsButton: {
    padding: 8,
    marginRight: 5,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f0f0f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  disclaimer: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    paddingBottom: 10,
    paddingTop: 5,
    backgroundColor: '#fff',
  },
});

export default styles;