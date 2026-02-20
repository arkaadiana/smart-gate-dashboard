import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/config/api";
import Header from "./Header";

export default async function HeaderInfo() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    let name = "User";
    let role = "OPERATOR";

    if (token) {
        try {
            const res = await fetch(API_ENDPOINTS.AUTH.ME, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });
            const json = await res.json();
            name = json.data?.name || "User";
            role = json.data?.role || "OPERATOR";
        } catch {}
    }

    return <Header name={name} role={role} />;
}