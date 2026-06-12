import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// ─── Cart Screen ─────────────────────────────────────────────────────────────
function CartScreen({ navigation }: any) {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState<{ note: string; time: string } | null>(null);

  useEffect(() => {
    loadNote();
  }, []);

  async function loadNote() {
    const raw = await AsyncStorage.getItem('orderNote');
    if (raw) {
      const parsed = JSON.parse(raw);
      setSaved(parsed);
    }
  }

  async function saveNote() {
    const order = { note: note, time: new Date().toLocaleTimeString() };
    await AsyncStorage.setItem('orderNote', JSON.stringify(order));
    setSaved(order);
    setNote('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🛒 Your Cart</Text>

      <View style={styles.section}>
        <Text style={styles.fieldLabel}>Special Instructions</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="e.g. extra sugar, no ice..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={saveNote}>
          <Text style={styles.buttonText}>Save Note</Text>
        </TouchableOpacity>
      </View>

      {saved && (
        <View style={styles.savedBox}>
          <Text style={styles.savedLabel}>Last Saved</Text>
          <Text style={styles.savedText}>{saved.note}</Text>
          <Text style={styles.savedTime}>{saved.time}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('OrderSummary')}
      >
        <Text style={styles.primaryButtonText}>View Order Summary</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Order Summary Screen ────────────────────────────────────────────────────
function OrderSummaryScreen({ navigation }: any) {
  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailCategory}>Order Details</Text>
      <Text style={styles.detailName}>Summary</Text>

      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Status</Text>
        <Text style={styles.summaryValue}>Empty — no items in cart</Text>
      </View>

      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Total</Text>
        <Text style={styles.summaryValue}>₱ ---</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back to Cart</Text>
      </TouchableOpacity>
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
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: '🛒 Cart' }} />
        <Stack.Screen
          name="OrderSummary"
          component={OrderSummaryScreen}
          options={{ title: 'Order Summary', headerLeft: () => null }}
        />
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDF6EE',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00163e',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFF8F2',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#045028',
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#045028',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FDF6EE',
    fontSize: 15,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#045028',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    color: '#FDF6EE',
    fontSize: 16,
    fontWeight: '600',
  },
  savedBox: {
    backgroundColor: '#FFF8F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  savedLabel: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: '600',
  },
  savedText: {
    fontSize: 16,
    color: '#3E1F00',
    marginBottom: 6,
    fontWeight: '500',
  },
  savedTime: {
    fontSize: 12,
    color: '#999',
  },

  // Detail/Summary Screen
  detailContainer: {
    flex: 1,
    padding: 28,
    backgroundColor: '#FDF6EE',
    justifyContent: 'center',
  },
  detailCategory: {
    fontSize: 13,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  detailName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3E1F00',
    marginBottom: 28,
  },
  summaryItem: {
    backgroundColor: '#FFF8F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#045028',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 16,
    color: '#3E1F00',
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#045028',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  backButtonText: {
    color: '#FDF6EE',
    fontSize: 16,
    fontWeight: '600',
  },
});