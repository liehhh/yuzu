import { View, Text, Pressable, Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import MD5 from "crypto-js/md5";
import { LASTFM_API_KEY, LASTFM_SHARED_SECRET } from "../../constants/lastfm";
import { post, API_URL } from "../../lib/api";
import { saveSession } from "../../lib/auth";

export default function ConnectLastFM() {
  const router = useRouter();

  // Generate the session-aware proxy redirect and log it
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true } as any);
  console.log("[Auth] redirectUri ->", redirectUri);

  const connect = async () => {
    try {
      // 1) Send to Last.fm
      const authUrl = `https://www.last.fm/api/auth/?api_key=${encodeURIComponent(
        LASTFM_API_KEY
      )}&cb=${encodeURIComponent(redirectUri)}`;
      console.log("[Auth] authUrl ->", authUrl);

      const res = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      console.log("[Auth] openAuthSessionAsync result ->", res);

      if (res.type !== "success" || !res.url) {
        console.log("[Auth] User cancelled or no URL returned");
        return;
      }

      // 2) Get token from callback URL (works for exp:// or https://)
      const token = new URL(res.url).searchParams.get("token");
      console.log("[Auth] token ->", token);
      if (!token) {
        Alert.alert("Auth error", "No token in callback");
        return;
      }

      // 3) auth.getSession → username
      console.log("[Auth] Exchanging token for session…");
      const sig = MD5(
        `api_key${LASTFM_API_KEY}methodauth.getSessiontoken${token}${LASTFM_SHARED_SECRET}`
      ).toString();

      const sessRes = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${LASTFM_API_KEY}&token=${token}&api_sig=${sig}&format=json`
      );
      const sess = await sessRes.json();
      console.log("[Auth] getSession response ->", sess);

      const username = sess?.session?.name;
      if (!username) {
        throw new Error("No username from Last.fm (getSession failed)");
      }

      // 4) user.getInfo → avatar (first image)
      console.log("[Auth] Fetching user.getInfo for ->", username);
      const infoRes = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getInfo&user=${encodeURIComponent(
          username
        )}&api_key=${LASTFM_API_KEY}&format=json`
      );
      const info = await infoRes.json();
      console.log("[Auth] user.getInfo response ->", info);

      const avatar = info?.user?.image?.[0]?.["#text"] || null;
      const display = info?.user?.realname || username;

      // 5) Create/update in Django, save session, go to tabs
      console.log("[API] POST /auth/lastfm ->", API_URL + "/auth/lastfm/");
      const created = await post("/auth/lastfm/", {
        lastfm_username: username,
        display_name: display,
        avatar_url: avatar,
      });
      console.log("[API] Django user created ->", created);

      await saveSession({
        userId: created.id,
        authToken: created.auth_token,
        displayName: created.display_name,
        avatarUrl: created.avatar_url,
        lastfmUsername: username,
      });
      console.log("[Nav] Redirecting to /(tabs)/home");
      router.replace("/(tabs)/home");
    } catch (e: any) {
      console.error("[Auth] Flow error ->", e);
      Alert.alert("Last.fm sign-in failed", e?.message ?? String(e));
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>
        Connect your Last.fm
      </Text>
      <Pressable
        onPress={connect}
        style={{ padding: 14, backgroundColor: "#fff", borderRadius: 16 }}
      >
        <Text>Connect with Last.fm</Text>
      </Pressable>
    </View>
  );
}
