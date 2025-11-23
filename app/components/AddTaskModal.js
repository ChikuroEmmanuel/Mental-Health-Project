import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { db } from '../../firebaseConfig'; // Adjust path if needed

const AddTaskModal = ({ visible, onClose, userId }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a task title.");
      return;
    }

    try {
      await addDoc(collection(db, 'users', userId, 'dailyTasks'), {
        title: title,
        isCompleted: false,
        dueDate: dueDate, // Firestore stores Date objects as Timestamps
        createdAt: serverTimestamp(),
      });
      
      // Reset and Close
      setTitle('');
      setDueDate(new Date());
      onClose();
    } catch (error) {
      console.error("Error adding task: ", error);
      Alert.alert("Error", "Could not save task.");
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS
    setDueDate(currentDate);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.modalContent}>
        <Text style={styles.title}>New Task</Text>

        {/* Task Title Input */}
        <Text style={styles.label}>What needs to be done?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Drink 8 glasses of water"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* Date Picker Section */}
        <Text style={styles.label}>Due Date</Text>
        {Platform.OS === 'android' && (
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{dueDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}

        {(showDatePicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
            style={styles.datePicker}
          />
        )}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Create Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f0f0f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#f0f0f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  datePicker: {
    marginBottom: 20,
    alignSelf: 'center', // Center for iOS
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    color: '#666',
  },
  saveButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AddTaskModal;