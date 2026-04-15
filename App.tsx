import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FeedScreen } from './src/screens/FeedScreen';
import { RootStoreContext, rootStore } from './src/store/rootStore';

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

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <RootStoreContext.Provider value={rootStore}>
          <StatusBar style="dark" />
          <FeedScreen />
        </RootStoreContext.Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
