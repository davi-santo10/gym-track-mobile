import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Appbar, FAB, List, IconButton } from 'react-native-paper';
import { useRoutines } from '@/context/RoutinesContext';
import { router } from 'expo-router'; // We no longer need Href
import { SafeAreaView } from 'react-native-safe-area-context';

export function RoutinesScreen() {
  const { routines, deleteRoutine } = useRoutines();

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Appbar.Header>
        <Appbar.Content title="My Routines" />
      </Appbar.Header>
      
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.exercises.length} exercises ${item.day ? `• ${item.day}` : ''}`}
            left={(props) => <List.Icon {...props} icon="clipboard-list-outline" />}
            onPress={() => {
              router.push(`/routine/${item.id}`);
            }}
            right={() => (
              <>
                <IconButton
                  icon="pencil-outline"
                  onPress={() => {
                    router.push(`/edit-routine/${item.id}`);
                  }}
                />
                <IconButton
                  icon="delete-outline"
                  onPress={() => deleteRoutine(item.id)}
                />
              </>
            )}
          />
        )}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/add-routine')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, zIndex: 1 },
});