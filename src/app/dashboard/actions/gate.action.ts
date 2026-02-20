"use server";

import { revalidatePath } from "next/cache";
import { API_ENDPOINTS } from "@/config/api";
import { fetchWithAuth } from "@/lib/auth";

export async function manualGateAction(action: "open" | "close") {
    try {
        const res = await fetchWithAuth(API_ENDPOINTS.ACCESS_LOGS.MANUAL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ action }),
        });

        if (!res.ok) {
            return { error: "Gagal mencatat log" };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { error: "Terjadi kesalahan sistem" };
    }
}