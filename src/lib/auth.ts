export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { cookies } = await import("next/headers");
  const token = (await cookies()).get("auth-token")?.value;

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}