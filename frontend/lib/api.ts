export const API_URL = "https://liehhh.pythonanywhere.com/api";

export async function post<T = any>(path: string, body: any){
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as T;
}