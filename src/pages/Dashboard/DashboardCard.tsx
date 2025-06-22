import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

interface Props {
  title: string;
  children?: React.ReactNode;
  loading?: boolean;
  onPress?: () => void;
  flex?: number; 
}

export const DashboardCard: React.FC<Props> = ({ title, children, loading, onPress, flex = 1 }) => {
  return (
    <TouchableOpacity style={[styles.card, { flex }]} onPress={onPress} disabled={!onPress}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        {loading ? <ActivityIndicator color="#1B4332" /> : children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    marginVertical: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});