import { Ionicons } from '@expo/vector-icons';
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const DURATIONS = [
  { label: '10 Minutes', value: 10 * 60 },
  { label: '15 Minutes', value: 15 * 60 },
  { label: '20 Minutes', value: 20 * 60 },
  { label: '25 Minutes (Pomodoro)', value: 25 * 60 },
  { label: '30 Minutes', value: 30 * 60 },
  { label: '45 Minutes', value: 45 * 60 },
  { label: '60 Minutes', value: 60 * 60 },
];

const SelectDurationModal = ({ visible, onClose, onSelect, currentDuration }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Focus Duration</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={DURATIONS}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.option,
                item.value === currentDuration && styles.selectedOption
              ]}
              onPress={() => {
                onSelect(item.value);
                onClose();
              }}
            >
              <Text style={[
                styles.optionText,
                item.value === currentDuration && styles.selectedOptionText
              ]}>
                {item.label}
              </Text>
              {item.value === currentDuration && (
                <Ionicons name="checkmark" size={20} color="#8A2BE2" />
              )}
            </TouchableOpacity>
          )}
        />
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
    padding: 20,
    maxHeight: '60%', // Limit height so it doesn't cover the whole screen
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  selectedOption: {
    backgroundColor: '#f8f7ff', // Highlight selected
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: -10, // Compensate for padding
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#8A2BE2',
    fontWeight: '600',
  },
});

export default SelectDurationModal;