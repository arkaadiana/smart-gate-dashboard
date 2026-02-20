"use server";

import { revalidatePath } from "next/cache";
import { API_ENDPOINTS } from "@/config/api";
import { fetchWithAuth } from "@/lib/auth";

export async function createUserAction(data: {
    pid: string;
    name: string;
    email: string;
    isActive?: boolean;
    plateNumber?: string[];
}) {
    try {
        const res = await fetchWithAuth(API_ENDPOINTS.USERS.GET_ALL, {
            method: "POST",
            body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) {
            const errorMsg = Array.isArray(json.message) ? json.message[0] : json.message;
            return { error: errorMsg || "Gagal tambah penghuni" };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        return { error: "Terjadi kesalahan sistem. Cek koneksi server." };
    }
}

export async function updateUserAction(id: string, data: {
    pid: string;
    name: string;
    email: string;
    isActive: boolean;
    plateNumber: string[];
}) {
    try {
        const res = await fetchWithAuth(API_ENDPOINTS.USERS.UPDATE(id), {
            method: "PATCH",
            body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) {
            const errorMsg = Array.isArray(json.message) ? json.message[0] : json.message;
            return { error: errorMsg || "Gagal update penghuni" };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        return { error: "Terjadi kesalahan sistem. Cek koneksi server." };
    }
}

export async function deleteUserAction(id: string, pin: string) {
    try {
        const res = await fetchWithAuth(API_ENDPOINTS.USERS.DELETE(id), {
            method: "DELETE",
            body: JSON.stringify({ pin }),
        });

        const json = await res.json();
        if (!res.ok) {
            return { error: json.message || "Gagal menghapus penghuni" };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        return { error: "Terjadi kesalahan sistem. Cek koneksi server." };
    }
}