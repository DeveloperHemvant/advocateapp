import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const c = Colors[colorScheme];
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.tint,
        tabBarInactiveTintColor: c.icon,
        tabBarStyle: {
          backgroundColor: c.backgroundCard,
          borderTopColor: c.border,
          borderTopWidth: 1,
        },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="draft"
        options={{
          title: 'Draft AI',
          tabBarIcon: ({ color }) => <MaterialIcons name="auto-awesome" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cases"
        options={{
          title: 'Cases',
          tabBarIcon: ({ color }) => <MaterialIcons name="work" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="research"
        options={{
          title: 'Research',
          tabBarIcon: ({ color }) => <MaterialIcons name="search" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="account-circle" size={26} color={color} />,
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
