"use server";

import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/config/api";

export async function loginAction({ email, password }: { email: string; password: string }) {
  try {
    const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (!res.ok) {
      return { error: json.message || "Email atau password salah." };
    }

    const token = json.data?.access_token;
    if (!token) return { error: "Token tidak ditemukan dari server." };

    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return { success: true }; 
    
  } catch {
    return { error: "Gagal terhubung ke server." };
  }
}