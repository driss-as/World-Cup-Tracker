import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#12070D',
  primary: '#E53935',
  textMuted: '#B48A96',
  border: '#5A1E2A',
};

const ROUTES = [
  { name: 'Home',    icons: ['home',      'home-outline']      },
  { name: 'Matches', icons: ['calendar',  'calendar-outline']  },
  { name: 'Profile', icons: ['person',    'person-outline']    },
];

export default function Sidebar({ currentRoute, onNavigate }) {
  return (
    <View style={styles.sidebar}>
      <View style={styles.brand}>
        <View style={styles.brandIcon}>
          <Ionicons name="football" size={22} color={C.primary} />
        </View>
        <View>
          <Text style={styles.brandTitle}>WORLD CUP</Text>
          <Text style={styles.brandSub}>2022</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.nav}>
        {ROUTES.map(({ name, icons }) => {
          const focused = currentRoute === name;
          return (
            <TouchableOpacity
              key={name}
              style={[styles.navItem, focused && styles.navItemActive]}
              onPress={() => onNavigate(name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={focused ? icons[0] : icons[1]}
                size={20}
                color={focused ? C.primary : C.textMuted}
              />
              <Text style={[styles.navLabel, focused && styles.navLabelActive]}>
                {name}
              </Text>
              {focused && <View style={styles.activeBar} />}
            </TouchableOpacity>
          );
        })}
      </View>

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
  brandTitle: { color: C.primary, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  brandSub:   { color: C.textMuted, fontSize: 11, fontWeight: '600' },
  divider:    { height: 1, backgroundColor: C.border, marginBottom: 20 },
  nav:        { flex: 1, gap: 4 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    position: 'relative',
  },
  navItemActive: { backgroundColor: C.primary + '18' },
  navLabel:      { color: C.textMuted, fontSize: 14, fontWeight: '600' },
  navLabelActive:{ color: C.primary },
  activeBar: {
    position: 'absolute',
    right: 0, top: 8, bottom: 8,
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
  footerText: { color: C.textMuted, fontSize: 11 },
});
