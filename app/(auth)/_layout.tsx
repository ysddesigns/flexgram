import { Stack } from "expo-router";

const AuthLayout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade", // Options: "slide_from_right", "slide_from_bottom", "fade"
      }}
    >
      <Stack.Screen name="Login" />
      <Stack.Screen name="Signup" />
      <Stack.Screen name="VerifyEmail" />
    </Stack>
  );
};

export default AuthLayout;
