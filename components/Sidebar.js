import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#0D1835',
  card: '#162052',
  primary: '#2ECC71',
  text: '#FFFFFF',
  textMuted: '#8A9CC2',
  border: '#1E2D6B',
};

const TAB_ICONS = {
  Home:    ['home',      'home-outline'],
  Matches: ['calendar',  'calendar-outline'],
  Tables:  ['list',      'list-outline'],
  Stats:   ['bar-chart', 'bar-chart-outline'],
  Profile: ['person',    'person-outline'],
};

export default function Sidebar({ state, descriptors, navigation }) {
  return (
    <View style={styles.sidebar}>
      {/* Branding */}
      <View style={styles.brand}>
        <View style={styles.brandIcon}>
          <Ionicons name="football" size={22} color={C.primary} />
        </View>
        <View>
          <Text style={styles.brandTitle}>WORLD CUP</Text>
          <Text style={styles.brandSub}>2024</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Nav items */}
      <View style={styles.nav}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const [active, inactive] = TAB_ICONS[route.name];

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.navItem, focused && styles.navItemActive]}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={focused ? active : inactive}
                size={20}
                color={focused ? C.primary : C.textMuted}
              />
              <Text style={[styles.navLabel, focused && styles.navLabelActive]}>
                {route.name}
              </Text>
              {focused && <View style={styles.activeBar} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: C.bg,
    borderRightWidth: 1,
    borderRightColor: C.border,
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: C.primary + '22',
    borderWidth: 1,
    borderColor: C.primary + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: C.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandSub: {
    color: C.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginBottom: 20,
  },
  nav: {
    flex: 1,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: C.primary + '18',
  },
  navLabel: {
    color: C.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  navLabelActive: {
    color: C.primary,
  },
  activeBar: {
    position: 'absolute',
    right: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
    backgroundColor: C.primary,
  },
  footer: {
    paddingHorizontal: 4,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  footerText: {
    color: C.textMuted,
    fontSize: 11,
  },
});
