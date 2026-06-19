const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4001" : "");

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export function getUserId() {
  if (typeof window === "undefined") return null;
  const storedId = localStorage.getItem("userId");
  if (storedId) return storedId;
  const token = localStorage.getItem("token");
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(atob(parts[1]));
    return payload?.id ?? null;
  } catch {
    return null;
  }
}

export function getUserEmail() {
  return typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
}

export async function authFetch(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers as HeadersInit | undefined);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...(init || {}), headers });
  return res;
}

export async function fetchPincode(code: string) {
  const res = await fetch(`${BASE_URL}/api/pincodes/${code}`);
  if (!res.ok) {
    throw new Error("Pincode not found");
  }
  return res.json();
}

export async function fetchStoriesByVillage(villageId: string) {
  const res = await fetch(`${BASE_URL}/api/stories/village/${villageId}`);
  if (!res.ok) {
    throw new Error("Failed to load stories");
  }
  return res.json();
}

export { BASE_URL };
