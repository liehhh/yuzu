// app/_layout.tsx
import { Slot } from "expo-router";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession(); // <-- REQUIRED on iOS

export default function RootLayout() {
  return <Slot />;
}
