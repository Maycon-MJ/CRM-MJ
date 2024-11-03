import { useState, useEffect } from 'react';
import { mockAuth } from '../config/firebase';

export function useFirestore<T extends { id?: string }>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load data from localStorage
    try {
      const storedData = localStorage.getItem(collectionName);
      if (storedData) {
        setData(JSON.parse(storedData));
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data");
      setLoading(false);
    }
  }, [collectionName]);

  const add = async (item: Omit<T, 'id'>) => {
    try {
      const newItem = {
        ...item,
        id: crypto.randomUUID(),
      } as T;
      const newData = [...data, newItem];
      setData(newData);
      localStorage.setItem(collectionName, JSON.stringify(newData));
      return newItem.id;
    } catch (error) {
      console.error("Error adding document:", error);
      throw error;
    }
  };

  const update = async (id: string, item: Partial<T>) => {
    try {
      const newData = data.map(d => d.id === id ? { ...d, ...item } : d);
      setData(newData);
      localStorage.setItem(collectionName, JSON.stringify(newData));
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  };

  const remove = async (id: string) => {
    try {
      const newData = data.filter(d => d.id !== id);
      setData(newData);
      localStorage.setItem(collectionName, JSON.stringify(newData));
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  };

  const query = async (constraints: any[]) => {
    // Simple mock query that returns all data
    // In a real app, you would implement the constraints
    return data;
  };

  return {
    data,
    loading,
    error,
    add,
    update,
    remove,
    query,
  };
}