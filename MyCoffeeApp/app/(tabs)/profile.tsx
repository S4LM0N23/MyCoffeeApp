import { View, Text, StyleSheet } from 'react-native';

// ─── Profile Screen ───────────────────────────────────────────────────────────
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>👤</Text>
      <Text style={styles.name}>Ian P. Saromines</Text>
      <Text style={styles.email}>ian@coffee.com</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Member Since</Text>
        <Text style={styles.value}>January 2024</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Orders</Text>
        <Text style={styles.value}>12</Text>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#FDF6EE',
  },
  avatar: {
    fontSize: 64,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3E1F00',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  card: {
    width: '80%',
    backgroundColor: '#FFF8F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#045028',
  },
  label: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3E1F00',
    marginTop: 4,
  },
});
