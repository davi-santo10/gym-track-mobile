import i18n from '@/lib/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Appbar, SegmentedButtons, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const I18N_STORAGE_KEY = 'my-gym-tracker-i18n-locale';

export function SettingsScreen() {
  const [locale, setLocale] = React.useState(i18n.locale);

  const handleLanguageChange = async (newLocale: string) => {
    if (!newLocale || newLocale === locale) {
      return;
    }

    Alert.alert(
      String(i18n.t('language')),
      String(i18n.t('languageChangeMessage')),
      [
        { text: String(i18n.t('cancel')), style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.setItem(I18N_STORAGE_KEY, newLocale);
            await Updates.reloadAsync();
          },
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Appbar.Header>
        <Appbar.Content title={String(i18n.t('settings'))} />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant='titleMedium' style={styles.label}>
          {String(i18n.t('language'))}
        </Text>
        <SegmentedButtons
          value={locale}
          onValueChange={handleLanguageChange}
          buttons={[
            { value: 'en', label: 'English' },
            { value: 'pt', label: 'Português' },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  label: {
    marginBottom: 8,
  }
});