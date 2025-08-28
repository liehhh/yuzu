import { API_URL } from "./api";

export async function get<T=any>(path: string, params?: Record<string,string>){
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await fetch(`${API_URL}${path}${qs}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<T>;
}