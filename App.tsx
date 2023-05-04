import MapView, { Marker } from "react-native-maps";
import { View, Text } from "react-native";
import { useState, useEffect, useRef } from "react";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";

import { styles } from "./styles";

export default function App() {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<LocationObject | null>(null);

  async function requestLocationPermission() {
    // ask user for permission
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();

      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    // to observe the location
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);

        // to center map
        mapRef?.current?.animateCamera({
          pitch: 20,
          center: response.coords,
        });
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            }}
          />
        </MapView>
      ) : (
        <Text style={styles.text}>Você ainda não tem uma localização</Text>
      )}
    </View>
  );
}
