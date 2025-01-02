import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  CameraView,
  CameraType,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { useRouter } from "expo-router";

const CameraScreen = () => {
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<"photo" | "video">("photo");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  // Check for permissions
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to access the camera.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraType = () => {
    // setCameraType((current) =>
    // current === CameraType.back ? CameraType.front : CameraType.back
    setCameraType((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlashMode = () => {
    setFlashMode((current) =>
      current === "off" ? "on" : current === "on" ? "auto" : "off"
    );
  };

  const handleShutterPress = async () => {
    if (!cameraRef.current) return;

    if (mode === "photo") {
      const photo = await cameraRef.current.takePictureAsync();
      console.log("Photo captured:", photo);
    } else if (mode === "video") {
      if (isRecording) {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
        console.log("Video recording stopped.");
      } else {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        console.log("Video recorded:", video);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
        ref={cameraRef}
      >
        {/* Flash Toggle */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFlashMode}
          >
            <Text style={styles.text}>
              Flash:{" "}
              {flashMode === "off" ? "Off" : flashMode === "on" ? "On" : "Auto"}
            </Text>
          </TouchableOpacity>

          {/* Camera Flip */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleCameraType}
          >
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>

          {/* Mode Toggle */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() =>
              setMode((current) => (current === "photo" ? "video" : "photo"))
            }
          >
            <Text style={styles.text}>
              {mode === "photo" ? "Photo" : "Video"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Shutter Button */}
        <View style={styles.shutterContainer}>
          <TouchableOpacity
            style={[styles.shutterButton, isRecording && styles.recording]}
            onPress={handleShutterPress}
          />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 100,
    width: "100%",
  },
  controlButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: "#000",
    fontSize: 16,
  },
  shutterContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  shutterButton: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "#ddd",
  },
  recording: {
    backgroundColor: "red",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    margin: 10,
    color: "#fff",
  },
  button: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
});

export default CameraScreen;
