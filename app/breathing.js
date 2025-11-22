import { Stack } from 'expo-router';
import BreathingScreen from './screens/BreathingScreen';


export default function BreathingPage() {
  return (
    <>
      {/* This configures the route as a modal */}
      <Stack.Screen 
        options={{ 
          presentation: 'transparentModal', 
          headerShown: false 
        }} 
      />
      <BreathingScreen />
    </>
  );
}

