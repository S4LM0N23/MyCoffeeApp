import React from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';

const menuItems = [
  { id: '1', category: 'Hot Drinks', name: 'Americano' },
  { id: '2', category: 'Hot Drinks', name: 'Cappuccino' },
  { id: '3', category: 'Hot Drinks', name: 'Matcha Latte' },

  { id: '4', category: 'Cold Drinks', name: 'Iced Matcha Latte' },
  { id: '5', category: 'Cold Drinks', name: 'Frappuccino' },

  { id: '6', category: 'Desserts', name: 'Blueberry Cheesecake' },
  { id: '7', category: 'Desserts', name: 'Brownie' },
  { id: '8', category: 'Desserts', name: 'Chocolate Chip Cookie' },

  // NEW ITEMS
  { id: '9', category: 'Pastries', name: 'Croissant' },
  { id: '10', category: 'Pastries', name: 'Chocolate Muffin' },
  { id: '11', category: 'Pastries', name: 'Cinnamon Roll' }
];

export default function App() {
  const showItem = (itemName: string | undefined) => {
    Alert.alert('Menu Item', itemName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>☕ My Café Menu</Text>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.name}>{item.name}</Text>

            <Button
              title="View Item"
              onPress={() => showItem(item.name)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },

  item: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },

  category: {
    fontSize: 12,
    color: '#808080'
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  }
});