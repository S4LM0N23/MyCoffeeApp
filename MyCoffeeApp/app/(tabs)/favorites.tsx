import { View, Text, SectionList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { NavigationIndependentTree, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from '@/.expo/types/router';

// ─── Static Menu Items ───────────────────────────────────────────────────────
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

// ─── Favorites Screen ────────────────────────────────────────────────────────
export default function FavoritesScreen() {
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
      checkConnection();
    }, [])
  );

  async function checkConnection() {
    try {
      const response = await fetch('https://api.sampleapis.com/coffee/hot', { method: 'HEAD' });
      if (!response.ok) throw new Error('No connection');
      setError('');
    } catch (err: any) {
      console.warn('Connection check failed:', err);
      setError('☕ No internet connection. Please check your connection.');
    }
  }

  async function loadFavorites() {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem('favorites');
      const ids = raw ? JSON.parse(raw) : [];
      setFavoriteIds(ids);

      // Filter menu items that are favorited
      const items = staticMenuItems.filter((item) => ids.includes(item.id));
      
      // Group by category
      const grouped = items.reduce((acc: any, item: any) => {
        const existing = acc.find((g: any) => g.title === item.category);
        if (existing) {
          existing.data.push(item);
        } else {
          acc.push({ title: item.category, data: [item] });
        }
        return acc;
      }, []);

      setFavoriteItems(grouped);
    } catch (err: any) {
      console.warn('Failed to load favorites', err);
      setError('Unable to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function removeFavorite(id: string) {
    const updated = favoriteIds.filter((itemId) => itemId !== id);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
      setFavoriteIds(updated);
      
      // Reload favorites to update the list
      const items = staticMenuItems.filter((item) => updated.includes(item.id));
      const grouped = items.reduce((acc: any, item: any) => {
        const existing = acc.find((g: any) => g.title === item.category);
        if (existing) {
          existing.data.push(item);
        } else {
          acc.push({ title: item.category, data: [item] });
        }
        return acc;
      }, []);
      setFavoriteItems(grouped);
    } catch (err: any) {
      console.warn('Failed to remove favorite', err);
      setError('Unable to remove favorite. Please try again.');
    }
  }

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
        <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>❤️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#045028" />
        <Text style={styles.loadingText}>Loading favorites…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>☕</Text>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  if (favoriteItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🤍</Text>
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptyMessage}>Start adding your favorite coffee items to see them here!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>❤️ Your Favorites</Text>
      <SectionList
        sections={favoriteItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6EE',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#045028',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#045028',
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#C67C4E',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#C67C4E',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'flex-start',
  },
  itemContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#045028',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C67C4E',
    marginBottom: 8,
  },
  desc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  removeButton: {
    padding: 8,
    marginLeft: 10,
  },
  removeButtonText: {
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#045028',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
    paddingHorizontal: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#045028',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#045028',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
