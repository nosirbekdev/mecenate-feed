import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FeedScreen } from './src/screens/FeedScreen';
import { PostDetailScreen } from './src/screens/PostDetailScreen';
import { RootStoreContext, rootStore } from './src/store/rootStore';
import type { RootStackParamList } from './src/navigation/types';
import { colors } from './src/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <RootStoreContext.Provider value={rootStore}>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator
              screenOptions={{
                contentStyle: { backgroundColor: colors.bg },
                headerShadowVisible: false,
                headerTitleStyle: { color: colors.text },
              }}
            >
              <Stack.Screen
                component={FeedScreen}
                name="Feed"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={PostDetailScreen}
                name="PostDetail"
                options={{ title: '\u041f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044f' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </RootStoreContext.Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
