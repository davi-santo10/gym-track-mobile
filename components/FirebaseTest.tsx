import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import {
  getFirebaseAuth,
  getFirebaseStatus,
  isFirebaseReady,
} from "../config/firebase";

export const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>("Checking...");
  const [details, setDetails] = useState<any>(null);

  const checkFirebase = async () => {
    try {
      console.log("Testing Firebase Auth...");

      // Check if Firebase is ready
      const ready = isFirebaseReady();
      console.log("Firebase ready:", ready);

      // Get status
      const statusInfo = getFirebaseStatus();
      console.log("Firebase status:", statusInfo);

      // Try to get auth instance
      const auth = await getFirebaseAuth();
      console.log("Firebase Auth instance:", !!auth);

      setStatus("✅ Firebase Working!");
      setDetails(statusInfo);
    } catch (error: any) {
      console.error("Firebase Test Error:", error);
      setStatus(`❌ Error: ${error.message}`);
      setDetails(getFirebaseStatus());
    }
  };

  useEffect(() => {
    checkFirebase();
  }, []);

  const retryTest = () => {
    setStatus("Retrying...");
    checkFirebase();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Test</Text>
      <Text style={styles.status}>{status}</Text>

      {details && (
        <View style={styles.details}>
          <Text style={styles.detailText}>
            Success: {details.success ? "✅" : "❌"}
          </Text>
          <Text style={styles.detailText}>Method: {details.method}</Text>
          {details.error && (
            <Text style={styles.errorText}>Error: {details.error}</Text>
          )}
        </View>
      )}

      <Button title="Retry Test" onPress={retryTest} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
  },
  details: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: 5,
  },
});
