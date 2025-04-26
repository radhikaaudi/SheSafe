import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>
        {subtitle} <Text style={{ fontWeight: 'bold' }}>SafeShe</Text> 🛡️
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#D63384',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 6,
  },
});
