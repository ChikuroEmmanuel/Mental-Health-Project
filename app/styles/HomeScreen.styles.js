import { StyleSheet } from "react-native";

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7ff', 
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30, 
    backgroundColor: '#f8f7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8A2BE2', 
    marginTop: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  menuContainer: {
    position: 'absolute',
    top: 60, 
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  menuItem: {
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  scrollContainer: {
    padding: 20,
  },
  
  // --- 6. New Styles for the Greeting Section ---
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6e6fa', // Light purple background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingMessage: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  greetingSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },

  // --- 4. New Styles for Daily Affirmation ---
  affirmationCard: {
    borderRadius: 16,
    marginBottom: 25,
    padding: 20,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    minHeight: 200, // Give it a minimum height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  affirmationContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Allow content to take up space
  },
  affirmationSparkleIcon: {
    marginBottom: 15, // Space below the icon
  },
  affirmationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text for the gradient background
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 20, // Space above the button
  },
  newAffirmationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)', // Semi-transparent white border
    backgroundColor: 'rgba(255,255,255,0.1)', // Slightly transparent background
  },
  newAffirmationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  // --- STYLES for the Chat Card ---
  chatCard: {
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
  chatCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chatIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e6e6fa', // Light purple
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  chatButtonPrimary: {
    backgroundColor: '#8A2BE2', // Bright purple
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  chatButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chatButtonSecondary: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0', // Light grey border
  },
  chatButtonTextSecondary: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // You'll also need this style for the section title above the card
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 25,
    marginBottom: 15,
  },
  
  // --- NEW STYLES for Quick Self Care ---
sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 25,
  },
  quickCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    alignItems: 'center', // Center everything horizontally
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2, // Subtle shadow for Android
    borderWidth: 1,
    borderColor: '#f0f0f0', // Very light border
  },
  quickIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12, // Space between icon and text
  },
  quickIconBlue: {
    backgroundColor: '#E3F2FD', // Light blue background
  },
  quickIconGreen: {
    backgroundColor: '#E8F5E9', // Light green background
  },
  quickIconPurple: {
    backgroundColor: '#F3E5F5', // Light purple background
  },
  quickContent: {
    alignItems: 'center', // Center text
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  
  // --- Daily Tip Style ---
  tipCard: {
    backgroundColor: '#F0F8FF', // Very light blue
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  tipText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  tipIcon: {
    fontWeight: 'bold',
    color: '#333',
  },
  
});

export default styles;