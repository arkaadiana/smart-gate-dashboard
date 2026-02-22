"use server";

import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/config/api";

export async function logoutAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (token) {
        try {
            await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Gagal memanggil API logout:", error);
        }
    }

    cookieStore.delete("auth-token");
    
    return { success: true };
}