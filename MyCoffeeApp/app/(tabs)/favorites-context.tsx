import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const remoteMenuUrl = 'https://api.sampleapis.com/coffee/hot';

type FavoritesContextType = {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  loading: boolean;
  refreshKey: number;
  refreshAll: () => void;
  isOnline: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const onlineRef = useRef<boolean>(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const raw = await AsyncStorage.getItem('favorites');
        if (raw) {
          setFavoriteIds(JSON.parse(raw));
        }
      } catch (err) {
        console.warn('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  // Periodically check connectivity; when offline->online, trigger a global refresh
  useEffect(() => {
    let mounted = true;
    const id = setInterval(async () => {
      try {
        const res = await fetch(remoteMenuUrl, { method: 'HEAD' });
        if (!mounted) return;
        if (res.ok) {
          if (!onlineRef.current) {
            onlineRef.current = true;
            setIsOnline(true);
            setRefreshKey((k) => k + 1);
          } else {
            setIsOnline(true);
          }
        } else {
          onlineRef.current = false;
          setIsOnline(false);
        }
      } catch (err) {
        if (!mounted) return;
        onlineRef.current = false;
        setIsOnline(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((currentIds) => {
      const updated = currentIds.includes(id)
        ? currentIds.filter((itemId) => itemId !== id)
        : [...currentIds, id];

      AsyncStorage.setItem('favorites', JSON.stringify(updated)).catch((err) => {
        console.warn('Failed to save favorites', err);
      });

      return updated;
    });
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        toggleFavorite,
        loading,
        refreshKey,
        refreshAll: () => setRefreshKey((k) => k + 1),
        isOnline,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
