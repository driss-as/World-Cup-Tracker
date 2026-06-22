import { useWindowDimensions, View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import MatchesScreen from './screens/MatchesScreen';
import TablesScreen from './screens/TablesScreen';
import StatsScreen from './screens/StatsScreen';
import ProfileScreen from './screens/ProfileScreen';
import Sidebar from './components/Sidebar';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home:    ['home',      'home-outline'],
  Matches: ['calendar',  'calendar-outline'],
  Tables:  ['list',      'list-outline'],
  Stats:   ['bar-chart', 'bar-chart-outline'],
  Profile: ['person',    'person-outline'],
};

const BREAKPOINT = 768;

function BottomTabBar({ state, navigation }) {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: '#0D1835',
      borderTopColor: '#1E2D6B',
      borderTopWidth: 1,
      height: 62,
      paddingBottom: 10,
      paddingTop: 8,
    }}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const [active, inactive] = TAB_ICONS[route.name];
        return (
          <TouchableOpacity
            key={route.key}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 }}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={focused ? active : inactive}
              size={22}
              color={focused ? '#2ECC71' : '#8A9CC2'}
            />
            <Text style={{ fontSize: 11, fontWeight: '600', color: focused ? '#2ECC71' : '#8A9CC2' }}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function CustomTabBar(props) {
  const { width } = useWindowDimensions();
  if (width >= BREAKPOINT) return <Sidebar {...props} />;
  return <BottomTabBar {...props} />;
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            const [active, inactive] = TAB_ICONS[route.name];
            return <Ionicons name={focused ? active : inactive} size={22} color={color} />;
          },
          tabBarActiveTintColor: '#2ECC71',
          tabBarInactiveTintColor: '#8A9CC2',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        })}
      >
        <Tab.Screen name="Home"    component={HomeScreen} />
        <Tab.Screen name="Matches" component={MatchesScreen} />
        <Tab.Screen name="Tables"  component={TablesScreen} />
        <Tab.Screen name="Stats"   component={StatsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
