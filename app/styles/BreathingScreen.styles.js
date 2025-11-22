import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e6e6fa', // Light purple
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#8A2BE2', // Main purple
  },
  phaseText: {
    fontSize: 16,
    color: '#8A2BE2',
    marginTop: -5,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#007AFF', // Blue color for Start
  },
  pauseButton: {
    backgroundColor: '#FF3B30', // Red color for Pause
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default styles;