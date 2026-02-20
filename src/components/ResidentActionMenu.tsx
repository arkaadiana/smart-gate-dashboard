"use client";

import { useState } from "react";
import { Edit, Trash2, X, Save, Loader2 } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import { fetchWithAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Props {
    r: any;
}

export default function ResidentActionMenu({ r }: Props) {
    const router = useRouter();
    const [mode, setMode] = useState<"idle" | "edit" | "delete">("idle");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [name, setName] = useState(r.name);
    const [email, setEmail] = useState(r.email);
    const [isActive, setIsActive] = useState(r.isActive);

    const [pin, setPin] = useState(["", "", "", "", "", ""]);

    const handlePinChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);
        if (value && index < 5) {
            document.getElementById(`pin-${r.id}-${index + 1}`)?.focus();
        }
    };

    const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            document.getElementById(`pin-${r.id}-${index - 1}`)?.focus();
        }
    };

    const resetDelete = () => {
        setPin(["", "", "", "", "", ""]);
        setError("");
        setMode("idle");
    };

    const handleUpdate = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchWithAuth(API_ENDPOINTS.USERS.UPDATE(r.id), {
                method: "PATCH",
                body: JSON.stringify({ name, email, isActive }),
            });
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.message || "Gagal update");
            }
            setMode("idle");
            router.refresh();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const pinString = pin.join("");
        if (pinString.length < 6) {
            setError("PIN harus 6 angka");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetchWithAuth(API_ENDPOINTS.USERS.DELETE(r.id), {
                method: "DELETE",
                body: JSON.stringify({ pin: pinString }),
            });
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.message || "PIN salah atau gagal hapus");
            }
            resetDelete();
            router.refresh();
        } catch (e: any) {
            setError(e.message);
            setPin(["", "", "", "", "", ""]);
            document.getElementById(`pin-${r.id}-0`)?.focus();
        } finally {
            setLoading(false);
        }
    };

    if (mode === "edit") {
        return (
            <div className="py-2 px-1">
                <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                        Edit Penghuni
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] text-muted-foreground">Nama</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-white/5 border border-border/50 rounded px-2 py-1 text-[10px] text-foreground outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] text-muted-foreground">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/5 border border-border/50 rounded px-2 py-1 text-[10px] text-foreground outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] text-muted-foreground">Status</label>
                            <select
                                value={isActive ? "true" : "false"}
                                onChange={(e) => setIsActive(e.target.value === "true")}
                                className="bg-white/5 border border-border/50 rounded px-2 py-1 text-[10px] text-foreground outline-none focus:border-primary/50 transition-colors"
                            >
                                <option value="true">Aktif</option>
                                <option value="false">Nonaktif</option>
                            </select>
                        </div>
                    </div>
                    {error && <p className="text-[9px] text-red-400">{error}</p>}
                    <div className="flex gap-2 mt-1">
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] hover:bg-blue-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <Save className="w-3 h-3" />}
                            Simpan
                        </button>
                        <button
                            onClick={() => { setMode("idle"); setError(""); }}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-white/5 text-muted-foreground border border-border/50 text-[10px] hover:bg-white/10 transition-colors"
                        >
                            <X className="w-3 h-3" /> Batal
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === "delete") {
        return (
            <div className="py-2 px-1">
                <div className="flex flex-col gap-2.5">
                    <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                        Hapus Penghuni
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        Masukkan PIN 6 digit untuk hapus{" "}
                        <span className="text-white font-medium">{r.name}</span>
                    </p>

                    <div className="flex gap-1.5">
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                id={`pin-${r.id}-${index}`}
                                type="password"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handlePinChange(index, e.target.value)}
                                onKeyDown={(e) => handlePinKeyDown(index, e)}
                                className="w-7 h-8 text-center text-sm font-mono font-bold bg-white/5 border border-border/50 rounded outline-none focus:border-red-500/70 focus:bg-red-500/5 transition-colors text-foreground caret-transparent"
                            />
                        ))}
                    </div>

                    {error && <p className="text-[9px] text-red-400">{error}</p>}

                    <div className="flex gap-2">
                        <button
                            onClick={handleDelete}
                            disabled={loading || pin.join("").length < 6}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] hover:bg-red-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <Trash2 className="w-3 h-3" />}
                            Hapus
                        </button>
                        <button
                            onClick={resetDelete}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-white/5 text-muted-foreground border border-border/50 text-[10px] hover:bg-white/10 transition-colors"
                        >
                            <X className="w-3 h-3" /> Batal
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => setMode("edit")}
                className="text-blue-400 hover:text-blue-300 transition-colors"
            >
                <Edit className="w-3 h-3" />
            </button>
            <button
                onClick={() => setMode("delete")}
                className="text-red-400 hover:text-red-300 transition-colors"
            >
                <Trash2 className="w-3 h-3" />
            </button>
        </div>
    );
}