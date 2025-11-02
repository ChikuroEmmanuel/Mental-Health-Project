import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseConfig'; // Adjust this path if needed

// Moods for the selection
const moods = ['Happy', 'Calm', 'Neutral', 'Anxious', 'Sad'];

const JournalScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [entryText, setEntryText] = useState('');
  const [previousEntries, setPreviousEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);

  // --- 1. Get User and Fetch Entries ---
  // Listen for auth state changes to get the user's UID
  // Then, set up a real-time listener for their journal entries
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        
        // Set up the Firestore listener
        const entriesCollection = collection(db, 'users', user.uid, 'journalEntries');
        const q = query(entriesCollection, orderBy('createdAt', 'desc'));

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const entries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPreviousEntries(entries);
          setLoading(false);
        });

        return () => unsubscribeSnapshot(); // Cleanup snapshot listener
      } else {
        setUid(null);
        setPreviousEntries([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
  }, []);

  // --- 2. Handle Saving a New Entry ---
  const handleSaveEntry = async () => {
    if (!selectedMood || !entryText) {
      Alert.alert('Missing Info', 'Please select a mood and write an entry.');
      return;
    }
    if (!uid) {
      Alert.alert('Error', 'You must be logged in to save an entry.');
      return;
    }

    try {
      // Create a reference to the user's journal entries subcollection
      const entriesCollection = collection(db, 'users', uid, 'journalEntries');
      
      // Add a new document with the entry data
      await addDoc(entriesCollection, {
        mood: selectedMood,
        text: entryText,
        createdAt: serverTimestamp(), // Use server timestamp for reliable sorting
      });

      // Reset form
      setSelectedMood(null);
      setEntryText('');
      Alert.alert('Success', 'Your journal entry has been saved.');

    } catch (error) {
      console.error('Error saving entry: ', error);
      Alert.alert('Error', 'Could not save your entry. Please try again.');
    }
  };

  // --- 3. Render the Component ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name="book-open-page-variant" size={24} color="#8A2BE2" />
          </View>
          <View>
            <Text style={styles.headerTitle}>My Journal</Text>
            <Text style={styles.headerSubtitle}>Express your thoughts and feelings</Text>
          </View>
        </View>

        {/* New Entry Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <FontAwesome name="plus" size={16} color="#333" /> New Entry
          </Text>
          
          <Text style={styles.label}>How are you feeling?</Text>
          <View style={styles.moodContainer}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodButton,
                  selectedMood === mood && styles.selectedMoodButton
                ]}
                onPress={() => setSelectedMood(mood)}
              >
                <Text style={[
                  styles.moodText,
                  selectedMood === mood && styles.selectedMoodText
                ]}>
                  {mood}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>What's on your mind?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Write your thoughts here... This is a safe space for you to express yourself."
            multiline
            value={entryText}
            onChangeText={setEntryText}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>

        {/* Previous Entries */}
        <Text style={styles.sectionTitle}>Previous Entries</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#8A2BE2" />
        ) : previousEntries.length > 0 ? (
          previousEntries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryDateContainer}>
                  <FontAwesome name="calendar" size={16} color="#666" />
                  <Text style={styles.entryDate}>
                    {entry.createdAt ? entry.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </Text>
                </View>
                <View style={[styles.moodTag, { backgroundColor: getMoodColor(entry.mood) }]}>
                  <Text style={styles.moodTagText}>{entry.mood}</Text>
                </View>
              </View>
              <Text style={styles.entryText}>{entry.text}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noEntriesText}>You have no journal entries yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to get a color for the mood tag
const getMoodColor = (mood) => {
  const colors = {
    'Happy': '#e0f8e9',
    'Calm': '#e0f0f8',
    'Neutral': '#e0e0e0',
    'Anxious': '#f8f3e0',
    'Sad': '#f8e0e0',
  };
  return colors[mood] || '#eee';
};

// --- 4. Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20, // Side Padding
    paddingVertical: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e6e6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8A2BE2',
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  moodButton: {
    backgroundColor: '#f0f0f5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  selectedMoodButton: {
    backgroundColor: '#8A2BE2',
  },
  moodText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedMoodText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#f8f7ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  entryDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  moodTag: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  moodTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  entryText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  noEntriesText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default JournalScreen;