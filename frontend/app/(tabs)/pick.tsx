import {
  View,
  Text,
  Alert,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useCallback, useMemo, useState } from "react";
import AeroBackground from "../../components/AeroBackground";
import { useFocusEffect } from "expo-router";
import Glass from "../../components/Glass";
import WaterDropsBackground from "../../components/WaterDropsBackground";
import { BlurView } from "expo-blur";
import { get, put } from "../../lib/http";

type Track = {
  id: string;
  name: string;
  artist: string;
  album?: string;
  image?: string;
  preview_url?: string;
  url?: string;
  uri?: string;
};

type Mode = "summary" | "picker";

export default function Picks() {
  const [mode, setMode] = useState<Mode>("summary");
  const [selected, setSelected] = useState<Track[]>([]);

  // picker state
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Track[]>([]);

  async function search() {
    const query = q.trim();
    if (!query) return;
    try {
      setLoading(true);
      const data = await get<{ results: Track[] }>("/search/", { q: query });
      setResults(data.results || []);
    } catch (err: any) {
      Alert.alert("Search failed...", err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  async function savePicks(tracks: Track[]) {
    await put<{ week_start: string; tracks: Track[] }>("/picks/current/", {
      tracks,
    });
  }

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const data = await get<{ week_start: string; tracks: Track[] }>(
            "/picks/current/"
          );
          if (!alive) return;
          setSelected(data.tracks || []);
        } catch (e) {}
      })();
      return () => {
        alive = false;
      };
    }, [])
  );

  function togglePick(t: Track) {
    const exists = selected.some((s) => s.id === t.id);
    if (exists) {
      setSelected((prev) => prev.filter((s) => s.id !== t.id));
    } else if (selected.length < 3) {
      setSelected((prev) => [...prev, t]);
    } else {
      Alert.alert("Limit reached", "You can only pick 3 tracks per week...");
    }
  }

  // remove by id (no math/indexes)
  function removeById(id: string) {
    setSelected((prev) => prev.filter((t) => t.id !== id));
  }

  // 3 placeholders when no picks yet
  const placeholders = useMemo(
    () => (selected.length ? [] : [0, 1, 2]),
    [selected.length]
  );

  return (
    <View className="flex-1 pt-10 px-4">
      <AeroBackground />
      {mode === "summary" ? (
        <>
          <Text className="text-[22px] font-semibold mb-3 mt-4">
            Your weekly picks
          </Text>
          <Pressable
            onPress={() => setMode("picker")}
            className="rounded-2xl bg-white/80 border border-white/70 py-3 items-center"
          >
            <Text className="font-medium text-neutral-900">Select tracks</Text>
            <Text className="text-xs text-neutral-500">
              {selected.length}/3 selected
            </Text>
          </Pressable>
          {/* Swipeable selected cards OR placeholders */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4 mt-4 h-60"
          >
            {selected.map((t) => (
              <View key={t.id} className="w-80 mr-3">
                <Glass className="">
                  <View className="p-4">
                    <View className="flex-row items-center gap-3">
                      {t.image ? (
                        <Image
                          source={{ uri: t.image }}
                          className="w-16 h-16 rounded-2xl"
                        />
                      ) : (
                        <View className="w-16 h-16 rounded-2xl bg-white/40" />
                      )}
                      <View className="flex-1">
                        <Text
                          numberOfLines={1}
                          className="text-lg font-semibold"
                        >
                          {t.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          className="text-neutral-600 mt-0.5"
                        >
                          {t.artist}
                        </Text>
                      </View>
                    </View>

                    {/* Remove button for this card */}
                    <Pressable
                      onPress={() => removeById(t.id)}
                      className="mt-3 rounded-xl bg-white/70 border border-white/60 py-2 items-center"
                    >
                      <Text className="text-neutral-900">Remove</Text>
                    </Pressable>
                  </View>
                </Glass>
              </View>
            ))}
            {placeholders.map((i) => (
              <View key={`ph-${i}`} className="w-72 mr-3">
                <Glass>
                  <View className="items-center justify-center h-28">
                    <Text className="text-neutral-500">
                      No pick yet — add one
                    </Text>
                  </View>
                </Glass>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        // ------------------ PICKER MODE ------------------
        <>
          <Text className="text-[22px] font-semibold mb-3 mt-4">
            Pick your tracks
          </Text>
          <Pressable
            onPress={() => setMode("summary")}
            className="mt-2 rounded-2xl bg-white/80 border border-white/70 py-3 items-center"
          >
            <Text className="font-medium text-neutral-900">Done</Text>
            <Text className="text-xs text-neutral-500">
              {selected.length} {selected.length === 1 ? "track" : "tracks"}{" "}
              selected
            </Text>
          </Pressable>

          {/* Selected chips */}
          <View className="flex-row gap-2 flex-wrap mb-2 items-center mt-2">
            {selected.map((s) => (
              <Pressable
                key={s.id}
                onPress={() => togglePick(s)}
                className="flex-row items-center bg-white/70 py-1.5 px-2.5 rounded-full"
              >
                {s.image ? (
                  <Image
                    source={{ uri: s.image }}
                    className="w-[18px] h-[18px] rounded-[2px] mr-1.5"
                  />
                ) : null}
                <Text numberOfLines={1} className="max-w-[140px] mr-1.5">
                  {s.name}
                </Text>
                <Text className="text-neutral-500">×</Text>
              </Pressable>
            ))}
            <Text className="text-neutral-500">{selected.length}/3</Text>
          </View>

          {/* Search row */}
          <View className="flex-row gap-2 mb-2.5">
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search tracks…"
              onSubmitEditing={search}
              returnKeyType="search"
              className="flex-1 bg-white/60 rounded-xl px-3 py-3 backdrop-blur-md"
            />
            <Pressable
              onPress={search}
              className="bg-white/60 px-4 rounded-xl justify-center border border-white/70"
            >
              <Text>Search</Text>
            </Pressable>
          </View>

          {/* Results */}
          {loading ? (
            <View className="my-2">
              <ActivityIndicator />
            </View>
          ) : null}

          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 65 }}
            renderItem={({ item }) => {
              const picked = selected.some((s) => s.id === item.id);
              return (
                <Glass>
                  <Pressable
                    onPress={() => togglePick(item)}
                    className={`${
                      picked ? "opacity-60" : "opacity-100"
                    } flex-row items-center py-2.5 gap-3`}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        className="w-12 h-12 rounded-lg"
                      />
                    ) : (
                      <View className="w-12 h-12 rounded-lg bg-neutral-200" />
                    )}
                    <View className="flex-1">
                      <Text numberOfLines={1} className="font-semibold">
                        {item.name}
                      </Text>
                      <Text numberOfLines={1} className="text-neutral-500">
                        {item.artist}
                      </Text>
                    </View>
                    <Text
                      className={picked ? "text-green-600" : "text-neutral-900"}
                    >
                      <Glass>
                        {picked ? <Text>Picked</Text> : <Text>Pick</Text>}
                      </Glass>
                    </Text>
                  </Pressable>
                </Glass>
              );
            }}
            ListEmptyComponent={
              !loading && q.trim() ? (
                <Text className="text-neutral-500 mt-3">No results.</Text>
              ) : null
            }
          />

          {/* Done button always visible at bottom of picker */}
        </>
      )}
    </View>
  );
}
