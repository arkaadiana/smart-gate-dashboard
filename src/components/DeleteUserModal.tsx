"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { deleteUserAction } from "@/app/dashboard/actions/user.action";
import { toast } from "sonner";

interface Props {
    r: any;
    open: boolean;
    onClose: () => void;
}

export default function DeleteUserModal({ r, open, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pin, setPin] = useState(["", "", "", "", "", ""]);
    const [pinReady, setPinReady] = useState(false);

    const handlePinChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);
        setPinReady(newPin.every(d => d !== ""));
        if (value && index < 5) {
            document.getElementById(`pin-${r.id}-${index + 1}`)?.focus();
        }
    };

    const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            const newPin = [...pin];
            newPin[index - 1] = "";
            setPin(newPin);
            setPinReady(false);
            document.getElementById(`pin-${r.id}-${index - 1}`)?.focus();
        }
    };

    const handleClose = () => {
        setPin(["", "", "", "", "", ""]);
        setPinReady(false);
        setError("");
        onClose();
    };

    const handleDelete = async () => {
        const pinString = pin.join("");
        if (pinString.length < 6) {
            setError("PIN harus 6 angka");
            return;
        }
        setLoading(true);
        setError("");
        const result = await deleteUserAction(r.id, pinString);
        setLoading(false);
        if (result?.error) {
            setError(result.error);
            setPin(["", "", "", "", "", ""]);
            setPinReady(false);
            setTimeout(() => document.getElementById(`pin-${r.id}-0`)?.focus(), 50);
            toast.error("Gagal", { description: result.error });
        } else {
            toast.success("Berhasil", { description: "Data penghuni telah dihapus" });
            handleClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); }}>
            <DialogContent className="border-border/40 max-w-sm max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-sm text-red-400">Hapus Penghuni</DialogTitle>
                    <DialogDescription className="text-[10px]">
                        Tindakan ini tidak bisa dibatalkan
                    </DialogDescription>
                </DialogHeader>

                <div className="glass rounded-xl px-4 py-3">
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{r.email} — {r.pid}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider text-center">
                        Masukkan PIN 6 Digit
                    </label>
                    <div className="flex gap-2 justify-center">
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
                                className={`w-10 h-12 text-center text-lg font-mono font-bold bg-white/5 rounded-lg outline-none transition-all text-foreground caret-transparent border ${pinReady ? "border-red-500/70 bg-red-500/5" : digit ? "border-primary/60 bg-primary/5" : "border-border/50 focus:border-primary/60"}`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-1 justify-center mt-1">
                        {pin.map((digit, i) => (
                            <div key={i} className={`h-0.5 w-4 rounded-full transition-colors ${digit ? "bg-primary" : "bg-border/50"}`} />
                        ))}
                    </div>
                </div>

                {error && (
                    <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 text-center">
                        {error}
                    </p>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={handleDelete}
                        disabled={loading || !pinReady}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium hover:bg-red-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Hapus
                    </button>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2.5 rounded-xl bg-white/5 text-muted-foreground border border-border/50 text-sm hover:bg-white/10 transition-colors"
                    >
                        Batal
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}