import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import MatchesScreen from './screens/MatchesScreen';
import TablesScreen from './screens/TablesScreen';
import StatsScreen from './screens/StatsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: ['home', 'home-outline'],
  Matches: ['calendar', 'calendar-outline'],
  Tables: ['list', 'list-outline'],
  Stats: ['bar-chart', 'bar-chart-outline'],
  Profile: ['person', 'person-outline'],
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            const [active, inactive] = TAB_ICONS[route.name];
            return <Ionicons name={focused ? active : inactive} size={22} color={color} />;
          },
          tabBarActiveTintColor: '#2ECC71',
          tabBarInactiveTintColor: '#8A9CC2',
          tabBarStyle: {
            backgroundColor: '#0D1835',
            borderTopColor: '#1E2D6B',
            borderTopWidth: 1,
            height: 62,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Matches" component={MatchesScreen} />
        <Tab.Screen name="Tables" component={TablesScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
