import { useState, useCallback } from 'react';
import { useWindowDimensions, View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import MatchesScreen from './screens/MatchesScreen';
import ProfileScreen from './screens/ProfileScreen';
import NewsDetailScreen from './screens/NewsDetailScreen';
import PremiumScreen from './screens/PremiumScreen';
import AuthScreen from './screens/AuthScreen';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './lib/AuthContext';

const Tab = createBottomTabNavigator();
const navigationRef = createNavigationContainerRef();

const TAB_ICONS = {
  Home:    ['home',      'home-outline'],
  Matches: ['calendar',  'calendar-outline'],
  Profile: ['person',    'person-outline'],
};

const BREAKPOINT = 768;

function BottomTabBar({ state, navigation }) {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: '#12070D',
      borderTopColor: '#5A1E2A',
      borderTopWidth: 1,
      height: 62,
      paddingBottom: 10,
      paddingTop: 8,
    }}>
      {state.routes.filter((route) => TAB_ICONS[route.name]).map((route) => {
        const index = state.routes.findIndex((item) => item.key === route.key);
        const focused = state.index === index;
        const [active, inactive] = TAB_ICONS[route.name];
        return (
          <TouchableOpacity
            key={route.key}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 }}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <Ionicons name={focused ? active : inactive} size={22} color={focused ? '#E53935' : '#B48A96'} />
            <Text style={{ fontSize: 11, fontWeight: '600', color: focused ? '#E53935' : '#B48A96' }}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainApp() {
  const { width } = useWindowDimensions();
  const isWide = width >= BREAKPOINT;
  const [currentRoute, setCurrentRoute] = useState('Home');

  const handleNavigate = useCallback((name) => {
    if (navigationRef.isReady()) navigationRef.navigate(name);
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        if (navigationRef.isReady())
          setCurrentRoute(navigationRef.getCurrentRoute()?.name ?? 'Home');
      }}
    >
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#190A12' }}>
        {isWide && <Sidebar currentRoute={currentRoute} onNavigate={handleNavigate} />}
        <View style={{ flex: 1 }}>
          <Tab.Navigator
            tabBar={(props) => isWide ? null : <BottomTabBar {...props} />}
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, color }) => {
                const [active, inactive] = TAB_ICONS[route.name] ?? ['ellipse', 'ellipse-outline'];
                return <Ionicons name={focused ? active : inactive} size={22} color={color} />;
              },
              tabBarActiveTintColor: '#E53935',
              tabBarInactiveTintColor: '#B48A96',
            })}
          >
            <Tab.Screen name="Home"    component={HomeScreen} />
            <Tab.Screen name="Matches" component={MatchesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="NewsDetail" component={NewsDetailScreen} />
            <Tab.Screen name="Premium" component={PremiumScreen} />
          </Tab.Navigator>
        </View>
      </View>
    </NavigationContainer>
  );
}

function AppContent() {
  const { session } = useAuth();

  if (session === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: '#190A12', alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar style="light" backgroundColor="#190A12" />
        <Ionicons name="football" size={48} color="#E53935" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#190A12" />
      {session ? <MainApp /> : <AuthScreen />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
