import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// ─── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreenContent() {
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const stored = await AsyncStorage.getItem('profileName');
    if (stored) setName(stored);
  }

  async function saveName() {
    await AsyncStorage.setItem('profileName', editName);
    setName(editName);
    setEditing(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarBox}>
        <Text style={styles.avatar}>☕</Text>
      </View>

      {editing ? (
        <View style={styles.editBox}>
          <Text style={styles.fieldLabel}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={editName}
            onChangeText={setEditName}
            placeholder="enter your name"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveName}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{name || 'Juan dela Cruz'}</Text>
          <TouchableOpacity onPress={() => { setEditName(name); setEditing(true); }}>
            <Text style={styles.editLink}>Edit Name</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.email}>ilovecoffeedawg@coffee.com</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Member Since</Text>
        <Text style={styles.cardValue}>January 2024</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Orders</Text>
        <Text style={styles.cardValue}>12</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Delivery Address</Text>
        <Text style={styles.cardPlaceholder}>not set</Text>
      </View>
    </View>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <NavigationIndependentTree>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#045028' },
          headerTintColor: '#F5E6D3',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="ProfileScreen" component={ProfileScreenContent} options={{ title: '👤 Profile' }} />
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FDF6EE',
    alignItems: 'center',
  },
  avatarBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF8F2',
    borderWidth: 2,
    borderColor: '#045028',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    fontSize: 48,
  },
  nameBlock: {
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#3E1F00',
    letterSpacing: 0.5,
  },
  editLink: {
    fontSize: 13,
    color: '#F5E6D3',
    marginTop: 12,
    letterSpacing: 0.5,
    backgroundColor: '#045028',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#045028',
    fontWeight: '600',
    overflow: 'hidden',
  },
  editBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#045028',
    padding: 12,
    fontSize: 14,
    color: '#000',
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  saveButton: {
    alignSelf: 'stretch',
    backgroundColor: '#045028',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FDF6EE',
    fontSize: 15,
    fontWeight: '600',
  },
  email: {
    fontSize: 13,
    color: '#888',
    marginBottom: 28,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF8F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#045028',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3E1F00',
  },
  cardPlaceholder: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: '500',
  },
});