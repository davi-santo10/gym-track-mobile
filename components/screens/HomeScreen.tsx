import { useRoutines } from '@/context/RoutinesContext';
import { useWorkoutLog } from '@/context/WorkoutLogContext';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Text, Button, List, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const DAY_OF_WEEK: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export function HomeScreen() {
  const { routines } = useRoutines()
  const { logs } = useWorkoutLog()
  const theme = useTheme()

  const today = DAY_OF_WEEK[new Date().getDay()]

  const todaysRoutine = routines.find(r => r.day === today)

  const lastLogForTodaysRoutine = todaysRoutine
    ? logs.find(log => log.routineName === todaysRoutine.name)
    : undefined;

  const mostRecentLogOverall = logs[0]

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Appbar.Header>
        <Appbar.Content
          title={
            <View>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                Gym Tracker
              </Text>
              <Text 
                variant="bodyMedium" 
                style={{ color: theme.colors.onSurfaceVariant, marginTop: -4 }}
              >
                {`Happy ${today}!`}
              </Text>
            </View>
          }
        />
      </Appbar.Header>

      <ScrollView>
        <Card style={styles.card}>
          <Card.Title title="Today's Plan" />
          {todaysRoutine ? (
            <View>
              <Card.Content>
                <Text variant="titleMedium">{todaysRoutine.name}</Text>
                <Text variant="bodyMedium">{todaysRoutine.exercises.length} exercises planned</Text>
              </Card.Content>
              <Card.Actions>
                <Button 
                  mode="contained" 
                  icon="play"
                  onPress={() => router.push({ pathname: '/routine/[id]', params: { id: todaysRoutine.id }})}
                >
                  Start Workout
                </Button>
              </Card.Actions>
            </View>
          ) : (
            <Card.Content>
              <Text variant="bodyMedium">
                You have no workouts scheduled for today. Rest is also progress!
              </Text>
            </Card.Content>
          )}
        </Card>
        {todaysRoutine ? (
          <Card style={styles.card}>
            <Card.Title title="Last Time" subtitle={`Performance for ${todaysRoutine.name}`} />
            <Card.Content>
              {lastLogForTodaysRoutine ? (
                <View>
                  <Text variant="bodySmall">
                    {new Date(lastLogForTodaysRoutine.date).toLocaleDateString()}
                  </Text>
                  {lastLogForTodaysRoutine.exercises.slice(0, 3).map((ex) => (
                    <List.Item
                      key={ex.details.id}
                      title={ex.details.name}
                      description={`${ex.progress.length} sets`}
                      left={props => <List.Icon {...props} icon="weight-lifter" />}
                    />
                  ))}
                  {lastLogForTodaysRoutine.exercises.length > 3 && (
                     <Text style={{textAlign: 'center', marginVertical: 8}}>...</Text>
                  )}
                </View>
              ) : (
                <Text variant="bodyMedium">
                  You haven't logged this workout before. Let's get it!
                </Text>
              )}
            </Card.Content>
          </Card>
        ) : (
           <Card style={styles.card}>
            <Card.Title title="Recent Activity" />
            <Card.Content>
              {mostRecentLogOverall ? (
                 <List.Item
                  title={mostRecentLogOverall.routineName}
                  description={`Completed on ${new Date(mostRecentLogOverall.date).toLocaleDateString()}`}
                  left={props => <List.Icon {...props} icon="history" />}
                  onPress={() => router.push({ pathname: '/log/[id]', params: { id: mostRecentLogOverall.id }})}
                />
              ) : (
                <Text variant="bodyMedium">No recent workouts logged.</Text>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { marginHorizontal: 16, marginTop: 16 },
});