import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Ionicons name="person-circle" size={64} color="#2ECC71" />
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>Gérez votre compte</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F143C' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginTop: 16 },
  subtitle: { fontSize: 15, color: '#8A9CC2', marginTop: 6 },
});
