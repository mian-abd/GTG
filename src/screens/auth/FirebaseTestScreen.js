import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import FirebaseTest from '../../components/FirebaseTest';

const FirebaseTestScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FirebaseTest />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default FirebaseTestScreen; 