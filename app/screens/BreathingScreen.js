import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    SafeAreaView,
    StyleSheet,
    Text, // Import the Animated API
    TouchableOpacity,
    View,
} from 'react-native';

const BreathingScreen = () => {
  const router = useRouter();
  const [instruction, setInstruction] = useState('Get Ready...');
  
  // Create an animated value, starting at 0.5 (small)
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  // This useEffect hook will run once and loop the animation
  useEffect(() => {
    const runAnimation = () => {
      // 1. Inhale (4 seconds)
      setInstruction('Inhale for 4s');
      Animated.timing(scaleAnim, {
        toValue: 1, // Grow to full size
        duration: 4000,
        useNativeDriver: true, // For smooth performance
      }).start(() => {
        // 2. Hold (4 seconds)
        setInstruction('Hold for 4s');
        // We use a simple setTimeout for the hold duration
        setTimeout(() => {
          // 3. Exhale (4 seconds)
          setInstruction('Exhale for 4s');
          Animated.timing(scaleAnim, {
            toValue: 0.5, // Shrink back to small size
            duration: 4000,
            useNativeDriver: true,
          }).start(() => {
            // 4. Restart the loop
            // Add a small pause before restarting
            setTimeout(runAnimation, 1000);
          });
        }, 4000); // This is the 4-second hold
      });
    };

    runAnimation(); // Start the animation loop
  }, [scaleAnim]);

  // Style for the animated circle
  const animatedCircleStyle = {
    transform: [{ scale: scaleAnim }],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <View style={styles.exerciseContainer}>
        {/* The Animated Circle */}
        <Animated.View style={[styles.circle, animatedCircleStyle]} />
        
        {/* The Instruction Text */}
        <Text style={styles.instructionText}>{instruction}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  exerciseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(138, 43, 226, 0.3)', // Light purple
    borderWidth: 10,
    borderColor: 'rgba(138, 43, 226, 0.6)', // Darker purple border
  },
  instructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
    position: 'absolute',
  },
});

export default BreathingScreen;