import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getSession } from "../../lib/auth";
import "../globals.css";

export default function AuthLayout() {
  const [checked, setChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    getSession().then((s) => {
      setHasSession(!!s);
      setChecked(true);
    });
  }, []);

  if (!checked) return null;
  if (hasSession) return <Redirect href="/(tabs)/home" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
