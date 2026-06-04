import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ─── Stack Navigator Setup ───────────────────────────────────────────────────
// This is a SECOND independent stack — separate from the one in index.tsx.
// Each tab has its own stack, and NavigationIndependentTree keeps them isolated.
const Stack = createNativeStackNavigator();

// ─── Cart Screen ─────────────────────────────────────────────────────────────
function CartScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Cart Screen</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OrderSummary')}
      >
        <Text style={styles.buttonText}>View Order Summary</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Order Summary Screen ─────────────────────────────────────────────────────
function OrderSummaryScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Order Summary</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>← Back to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
// NavigationIndependentTree isolates this stack from the one in index.tsx.
// Both tabs have their own stack — they do not share or interfere with each other.
export default function App() {
  return (
    <NavigationIndependentTree>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1A4D2E' },
          headerTintColor: '#F5F5F5',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Cart"         component={CartScreen}         options={{ title: '🛒 My Cart' }} />
        <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} options={{ title: 'Order Summary', headerLeft: () => null }} />
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1A4D2E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
