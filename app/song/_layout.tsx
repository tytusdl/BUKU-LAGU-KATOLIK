import { Stack } from 'expo-router';

export default function SongLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="category/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 