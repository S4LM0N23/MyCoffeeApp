import { View, Text, SectionList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { NavigationIndependentTree, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFavorites } from './favorites-context';

const remoteMenuUrl = 'https://api.sampleapis.com/coffee/hot';

// ─── Coffee Menu Data ────────────────────────────────────────────────────────
const staticMenuItems = [
  { id: '1', category: 'Hot Drinks',  name: 'Americano',   price: '₱120', desc: 'Bold and strong black coffee brewed with espresso shots.' },
  { id: '2', category: 'Hot Drinks',  name: 'Cappuccino',  price: '₱150', desc: 'Classic Italian coffee with equal parts espresso, steamed milk, and foam.' },
  { id: '3', category: 'Hot Drinks',  name: 'Matcha Latte', price: '₱160', desc: 'Smooth Matcha with creamy steamed milk.' },
  { id: '5', category: 'Cold Drinks', name: 'Iced Coffee', price: '₱130', desc: 'Chilled brewed coffee served over ice for a refreshing kick.' },
  { id: '6', category: 'Cold Drinks', name: 'Frappuccino', price: '₱175', desc: 'Blended iced coffee drink topped with whipped cream.' },
  { id: '7', category: 'Cold Drinks', name: 'Iced Matcha Latte', price: '₱175', desc: 'Blended iced matcha latte topped with whipped cream.' },
  { id: '8', category: 'Desserts', name: 'Blueberry Cheesecake', price: '₱175', desc: 'A delicious cheesecake with fresh blueberries.' },
  { id: '9', category: 'Desserts', name: 'Chocolate Cake', price: '₱175', desc: 'Rich and moist chocolate cake topped with chocolate ganache.' },
  { id: '10', category: 'Desserts', name: 'Tiramisu', price: '₱175', desc: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.' },
];

// ─── Stack Navigator Setup ───────────────────────────────────────────────────
// createStackNavigator() creates a "stack" of screens.
// Think of it like a stack of cards — you push a card when you go forward,
// and pop it off when you press Back.
const Stack = createNativeStackNavigator();

// ─── Home Screen (Coffee Menu) ───────────────────────────────────────────────
function HomeScreen({ navigation }: any) {
  const [menuSections, setMenuSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { favoriteIds, toggleFavorite, refreshKey, refreshAll, isOnline } = useFavorites();

  useEffect(() => {
    loadMenu();
  }, []);

  useEffect(() => {
    // triggered when any tab calls `refreshAll()`
    if (typeof refreshKey !== 'undefined') {
      loadMenu();
    }
  }, [refreshKey]);

  useFocusEffect(
    useCallback(() => {
      checkConnection();
    }, [])
  );

  async function checkConnection() {
    setError('');
    try {
      const response = await fetch(remoteMenuUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('No connection');
      }
    } catch (err: any) {
      console.warn('Connection check failed:', err);
      setError('☕ No internet connection. Please check your connection.');
    }
  }

  useEffect(() => {
    if (!isOnline) {
      setError('☕ No internet connection. Please check your connection.');
    }
  }, [isOnline]);

  async function loadMenu() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(remoteMenuUrl);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid menu data');
      }
      setMenuSections([
        {
          title: 'Drinks',
          data: staticMenuItems.filter((item) => item.category === 'Hot Drinks' || item.category === 'Cold Drinks'),
        },
        {
          title: 'Desserts',
          data: staticMenuItems.filter((item) => item.category === 'Desserts'),
        },
      ]);
    } catch (err: any) {
      console.warn('Menu load error:', err);
      setError('☕ No internet connection. Please check your connection.');
      setMenuSections([
        {
          title: 'Drinks',
          data: staticMenuItems.filter((item) => item.category === 'Hot Drinks' || item.category === 'Cold Drinks'),
        },
        {
          title: 'Desserts',
          data: staticMenuItems.filter((item) => item.category === 'Desserts'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function retryConnection() {
    setError('');
    refreshAll();
  }

  const renderItem = ({ item }: any) => {
    const isFavorite = favoriteIds.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.75}
        onPress={() => navigation.navigate('Detail', { coffee: item })}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.category}>{item.category}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favoriteButton}>
            <Text style={[styles.favorite, isFavorite && styles.favoriteActive]}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#045028" />
          <Text style={styles.loadingText}>Brewing your coffee menu…</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>☕</Text>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retryConnection}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.heading}>☕ Coffee Shop Menu</Text>
          <SectionList
            sections={menuSections}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </View>
  );
}

// ─── Detail Screen ───────────────────────────────────────────────────────────
function DetailScreen({ route, navigation }: any) {

  // route.params contains the data we passed when calling navigation.navigate()
  const { coffee } = route.params;

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailCategory}>{coffee.category}</Text>
      <Text style={styles.detailName}>{coffee.name}</Text>
      <Text style={styles.detailPrice}>{coffee.price}</Text>
      <Text style={styles.detailDesc}>{coffee.desc}</Text>

      {/* navigation.goBack() pops this screen off and returns to HomeScreen */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── App (Navigation Container) ─────────────────────────────────────────────
// NavigationIndependentTree is needed because Expo Router already has its own
// navigator running. This tells React Navigation to treat our Stack as
// a separate, independent navigation tree so they don't conflict.
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
        {/* Register our two screens with the Stack */}
        <Stack.Screen name="Menu"   component={HomeScreen}   options={{ title: '☕ Coffee Shop'}} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Coffee Details', headerLeft: () => null }} />
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // Home Screen
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
  item: {
    backgroundColor: '#FFF8F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#045028',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  favoriteButton: {
    padding: 4,
  },
  favorite: {
    fontSize: 20,
    color: '#888',
  },
  favoriteActive: {
    color: '#228B22',
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3E1F00',
  },
  price: {
    fontSize: 14,
    color: '#C1440E',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#045028',
    backgroundColor: '#EEF6EF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 12,
    color: '#045028',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#B12704',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FDF6EE',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#B12704',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#3E1F00',
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#045028',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FDF6EE',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Detail Screen
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
    marginBottom: 8,
  },
  detailPrice: {
    fontSize: 22,
    color: '#C1440E',
    fontWeight: '600',
    marginBottom: 20,
  },
  detailDesc: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: '#045028',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FDF6EE',
    fontSize: 16,
    fontWeight: '600',
  },

});
