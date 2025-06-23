import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import i18n from "../lib/i18n";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: i18n.t("oops") }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">{i18n.t("screenNotFound")}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">{i18n.t("goToHome")}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
