import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated, // For the circle animation
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/BreathingScreen.styles.js'; // We will create this

const BreathingScreen = () => {
  const router = useRouter();
  
  // State for the exercise logic
  const [instruction, setInstruction] = useState('Breathe in slowly through your nose');
  const [phase, setPhase] = useState('idle'); // 'idle', 'inhale', 'hold', 'exhale'
  const [countdown, setCountdown] = useState(4);
  const [isStarted, setIsStarted] = useState(false);
  
  // Refs for managing animations and timers
  const scaleAnim = useRef(new Animated.Value(1)).current; // Start at normal size
  const countdownInterval = useRef(null);
  const phaseTimeout = useRef(null);

  // This effect controls the entire animation loop
  useEffect(() => {
    if (!isStarted) {
      // If paused or idle, clear all timers and stop animation
      clearInterval(countdownInterval.current);
      clearTimeout(phaseTimeout.current);
      scaleAnim.stopAnimation();
      return; // Do nothing else
    }

    // Function to run the 4-second countdown
    const runCountdown = () => {
      setCountdown(4); // Reset to 4
      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval.current);
            return 1;
          }
          return prev - 1;
        });
      }, 1000);
    };

    // Function to start a new phase (inhale, hold, exhale)
    const startPhase = (nextPhase) => {
      setPhase(nextPhase);
      runCountdown(); // Start the countdown for this phase
      
      if (nextPhase === 'inhale') {
        setInstruction('Breathe in slowly through your nose');
        Animated.timing(scaleAnim, {
          toValue: 1.5, // Grow
          duration: 4000,
          useNativeDriver: true,
        }).start();
        // After 4s, move to 'hold'
        phaseTimeout.current = setTimeout(() => startPhase('hold'), 4000);

      } else if (nextPhase === 'hold') {
        setInstruction('Hold your breath gently');
        // No animation, just hold
        // After 4s, move to 'exhale'
        phaseTimeout.current = setTimeout(() => startPhase('exhale'), 4000);

      } else if (nextPhase === 'exhale') {
        setInstruction('Breathe out slowly through your mouth');
        Animated.timing(scaleAnim, {
          toValue: 1, // Shrink back to normal
          duration: 4000,
          useNativeDriver: true,
        }).start();
        // After 4s, loop back to 'inhale'
        phaseTimeout.current = setTimeout(() => startPhase('inhale'), 4000);
      }
    };

    // Start the very first cycle
    startPhase('inhale');

    // Cleanup function when component unmounts or [isStarted] changes
    return () => {
      clearInterval(countdownInterval.current);
      clearTimeout(phaseTimeout.current);
    };
  }, [isStarted, scaleAnim]); // Re-run this effect when isStarted changes

  // Function to handle the button press
  const handleStartPause = () => {
    setIsStarted(!isStarted); // Toggle the 'isStarted' state
  };

  // Close the modal
  const handleClose = () => {
    setIsStarted(false); // Stop the animation
    router.back();
  };

  // Style for the animated circle
  const animatedCircleStyle = {
    transform: [{ scale: scaleAnim }],
  };

  return (
    <Pressable style={styles.backdrop} onPress={handleClose}>
      <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={28} color="#aaa" />
        </TouchableOpacity>

        <Text style={styles.title}>Breathing Exercise</Text>

        {/* Animated Circle & Countdown */}
        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circle, animatedCircleStyle]}>
            <Text style={styles.countdownText}>
              {isStarted ? countdown : 4}
            </Text>
            <Text style={styles.phaseText}>
              {isStarted ? phase.charAt(0).toUpperCase() + phase.slice(1) : "Ready"}
            </Text>
          </Animated.View>
        </View>

        {/* Instructions */}
        <Text style={styles.instructionText}>
          {isStarted ? instruction : 'Breathe in slowly through your nose'}
        </Text>
        <Text style={styles.subtitle}>Follow the 4-4-4 breathing pattern</Text>

        {/* Start / Pause Button */}
        <TouchableOpacity 
          style={[styles.button, isStarted ? styles.pauseButton : styles.startButton]}
          onPress={handleStartPause}
        >
          <Text style={styles.buttonText}>
            {isStarted ? 'Pause' : 'Start Exercise'}
          </Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  );
};

export default BreathingScreen;