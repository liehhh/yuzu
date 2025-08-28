import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "@auth";
export type Session = { userId:number; authToken:string; displayName:string; avatarUrl?:string|null; lastfmUsername:string; };
export async function saveSession(s: Session){ await AsyncStorage.setItem(KEY, JSON.stringify(s)); }
export async function getSession(): Promise<Session|null>{ const r=await AsyncStorage.getItem(KEY); return r?JSON.parse(r):null; }
export async function clearSession(){ await AsyncStorage.removeItem(KEY); }
