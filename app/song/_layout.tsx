import { Stack } from 'expo-router';

export default function SongLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: 'transparent',
        }
      }}
    >
      <Stack.Screen
        name="[id]"
      />
      <Stack.Screen
        name="category/[id]"
      />
    </Stack>
  );
}