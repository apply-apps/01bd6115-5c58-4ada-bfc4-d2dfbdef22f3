// Filename: index.js
// Combined code from all files

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Button, View, Image, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_URL = "http://apihub.p.appply.xyz:3300/chatgpt";

export default function App() {
  const [image, setImage] = useState(null);
  const [plantDetails, setPlantDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setPlantDetails(null); // Reset plant details after a new image is picked
    }
  };

  const identifyPlant = async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        messages: [
          { role: "system", content: "You are a helpful assistant specialized in identifying plants." },
          { role: "user", content: `Identify this plant: [Image URL: ${image}]` }
        ],
        model: "gpt-4o"
      });
      const { data } = response;
      const resultString = data.response;
      setPlantDetails(resultString);
    } catch (error) {
      console.error(error);
      setPlantDetails("An error occurred while identifying the plant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Plant Identification App</Text>
        <View style={styles.buttonContainer}>
          <Button title="Take Photo" onPress={pickImage} />
        </View>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        {image && !loading && (
          <View style={styles.buttonContainer}>
            <Button title="Identify Plant" onPress={identifyPlant} />
          </View>
        )}
        {loading && <ActivityIndicator size="large" color="#00ff00" />}
        {plantDetails && (
          <View style={styles.plantDetailsContainer}>
            <Text style={styles.plantDetailsText}>{plantDetails}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginVertical: 20,
  },
  plantDetailsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    alignItems: 'center',
  },
  plantDetailsText: {
    fontSize: 16,
  },
});