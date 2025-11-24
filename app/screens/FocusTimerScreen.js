import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import SelectDurationModal from '../components/SelectDurationModal'; // Import the modal
import styles from '../styles/FocusTimerScreen.styles';

const DEFAULT_FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const FocusTimerScreen = () => {
  const router = useRouter();
  
  // State
  const [focusDuration, setFocusDuration] = useState(DEFAULT_FOCUS_TIME); // Current selected duration
  const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility
  
  const timerRef = useRef(null);

  // --- Timer Logic (Unchanged) ---
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // --- Helper: Format Time (Unchanged) ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- Handle Completion (Unchanged) ---
  const handleTimerComplete = async () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    Vibration.vibrate();

    if (!isBreak) {
      Alert.alert(
        "Focus Session Complete! 🎉",
        "Great job! Time for a mental health break.",
        [
          { text: "Start Breathing Exercise", onPress: () => router.push('/breathing') },
          { text: "Take a Break (5 min)", onPress: () => startBreak() }
        ]
      );
    } else {
      Alert.alert("Break Over", "Ready to focus again?", [
        { text: "Start Focus", onPress: () => startFocus() }
      ]);
    }
  };

  // --- Controls ---
  const startFocus = () => {
    setIsBreak(false);
    setTimeLeft(focusDuration); // Use the user's selected duration
    setIsActive(true);
  };

  const startBreak = () => {
    setIsBreak(true);
    setTimeLeft(BREAK_TIME);
    setIsActive(true);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(focusDuration); // Reset to the selected duration
  };

  // --- New Duration Handler ---
  const handleDurationSelect = (newDuration) => {
    setFocusDuration(newDuration);
    setTimeLeft(newDuration); // Update the timer immediately
    setIsActive(false); // Stop timer if running
    setIsBreak(false); // Ensure we are in focus mode
  };

  return (
    <SafeAreaView style={[styles.container, isBreak ? styles.breakBackground : styles.focusBackground]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isBreak ? "Relax & Recharge" : "Deep Focus Mode"}</Text>
        <View style={{ width: 28 }} /> 
      </View>

      {/* Main Timer Display */}
      <View style={styles.timerContainer}>
        {/* Make circle clickable to open modal (only when not running/break) */}
        <TouchableOpacity 
          style={styles.circle} 
          onPress={() => !isActive && !isBreak && setModalVisible(true)}
          disabled={isActive || isBreak} // Disable while running
        >
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.statusText}>
            {isBreak ? "Break Time" : (isActive ? "Focusing..." : "Tap to Change")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleTimer}>
          <MaterialCommunityIcons 
            name={isActive ? "pause" : "play"} 
            size={40} 
            color={isBreak ? "#4CAF50" : "#8A2BE2"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
          <MaterialCommunityIcons name="refresh" size={30} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Tip Section */}
      <View style={styles.tipContainer}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#fff" />
        <Text style={styles.tipText}>
          {isBreak 
            ? "Tip: Stand up, stretch, or drink some water." 
            : "Tip: Put your phone on 'Do Not Disturb' for better focus."}
        </Text>
      </View>

      {/* Duration Modal */}
      <SelectDurationModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleDurationSelect}
        currentDuration={focusDuration}
      />

    </SafeAreaView>
  );
};

export default FocusTimerScreen;