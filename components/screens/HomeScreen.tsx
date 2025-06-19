// In components/screens/HomeScreen.tsx

import { StyleSheet } from 'react-native';
import { Appbar, Card, Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
  return (
    // --- ADD THE `edges` PROP HERE ---
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Appbar.Header>
        <Appbar.Content title="Gym Tracker" subtitle="Welcome back!" />
      </Appbar.Header>

      <Card style={styles.card}>
        <Card.Title title="Today's Plan" />
        <Card.Content>
          <Text variant="bodyMedium">
            You have no workouts scheduled for today. Ready to start one?
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Start Empty Workout</Button>
        </Card.Actions>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="Recent Activity" />
        <Card.Content>
          <Text variant="bodyMedium">No recent workouts logged.</Text>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { margin: 16 },
});