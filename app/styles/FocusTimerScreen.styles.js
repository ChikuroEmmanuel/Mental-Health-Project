import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  focusBackground: {
    backgroundColor: '#8A2BE2', 
  },
  breakBackground: {
    backgroundColor: '#4CAF50', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50, 
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  statusText: {
    fontSize: 18, // Reduced font size slightly
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
    fontWeight: '600',
    textTransform: 'uppercase', // Added uppercase for style
    letterSpacing: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    gap: 30,
  },
  controlButton: {
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  tipContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
});

export default styles;