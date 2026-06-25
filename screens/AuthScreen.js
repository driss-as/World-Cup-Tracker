import { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#0F143C',
  card: '#162052',
  cardDark: '#0D1835',
  primary: '#2ECC71',
  text: '#FFFFFF',
  textMuted: '#8A9CC2',
  border: '#1E2D6B',
  danger: '#E74C3C',
};

export default function AuthScreen() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  async function handleSubmit() {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        Alert.alert(
          'Compte créé !',
          'Vérifiez votre e-mail pour confirmer votre inscription.',
        );
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Ionicons name="football" size={36} color={C.primary} />
          </View>
          <Text style={styles.appName}>WORLD CUP 2024</Text>
          <Text style={styles.appSub}>Suivez chaque match en direct</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Tab switcher */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => { setMode('login'); setError(''); }}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => { setMode('signup'); setError(''); }}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Inscription</Text>
            </TouchableOpacity>
          </View>

          {/* Fields */}
          <View style={styles.field}>
            <Text style={styles.label}>Adresse e-mail</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={C.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="vous@exemple.com"
                placeholderTextColor={C.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={C.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={C.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={C.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={15} color={C.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color={C.bg} />
              : <Text style={styles.btnText}>{isLogin ? 'Se connecter' : "S'inscrire"}</Text>
            }
          </TouchableOpacity>

          {/* Forgot password */}
          {isLogin && (
            <TouchableOpacity
              onPress={async () => {
                if (!email) { setError('Entrez votre e-mail pour réinitialiser.'); return; }
                await supabase.auth.resetPasswordForEmail(email);
                Alert.alert('E-mail envoyé', 'Vérifiez votre boîte mail.');
              }}
            >
              <Text style={styles.forgot}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  kav: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },

  logoArea: { alignItems: 'center', marginBottom: 36 },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: C.primary + '22',
    borderWidth: 2,
    borderColor: C.primary + '55',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  appName: { color: C.primary, fontSize: 20, fontWeight: '900', letterSpacing: 1.5 },
  appSub: { color: C.textMuted, fontSize: 13, marginTop: 4 },

  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: C.border,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: C.cardDark,
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: C.primary },
  tabText: { color: C.textMuted, fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: C.bg, fontWeight: '700' },

  field: { marginBottom: 16 },
  label: { color: C.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 8, letterSpacing: 0.5 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cardDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, color: C.text, fontSize: 15, paddingVertical: 13 },
  eyeBtn: { padding: 4 },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.danger + '18',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.danger + '44',
  },
  errorText: { color: C.danger, fontSize: 13, flex: 1 },

  btn: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  btnText: { color: C.bg, fontSize: 16, fontWeight: '800' },

  forgot: { color: C.textMuted, fontSize: 13, textAlign: 'center', textDecorationLine: 'underline' },
});
