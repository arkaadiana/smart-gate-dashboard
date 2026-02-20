"use client";

import { useState } from "react";
import { Save, Loader2, Plus, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createUserAction } from "@/app/dashboard/actions/user.action";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreateUserModal({ open, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pid, setPid] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [plateNumber, setPlateNumber] = useState<string[]>([""]);

    const addPlate = () => setPlateNumber([...plateNumber, ""]);
    const removePlate = (i: number) => setPlateNumber(plateNumber.filter((_, idx) => idx !== i));
    const updatePlate = (i: number, val: string) => {
        const updated = [...plateNumber];
        updated[i] = val.toUpperCase();
        setPlateNumber(updated);
    };

    const resetForm = () => {
        setPid("");
        setName("");
        setEmail("");
        setIsActive(true);
        setPlateNumber([""]);
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        const emptyFields = [];
        if (!pid.trim()) emptyFields.push("PID");
        if (!name.trim()) emptyFields.push("Nama");
        if (!email.trim()) emptyFields.push("Email");

        if (emptyFields.length > 0) {
            setError(`${emptyFields.join(", ")} wajib diisi`);
            return;
        }

        if (!email.includes("@")) {
            setError("Format email tidak valid");
            return;
        }

        setLoading(true);
        setError("");

        const result = await createUserAction({
            pid: pid.trim(),
            name: name.trim(),
            email: email.trim(),
            isActive,
            plateNumber: plateNumber.filter(p => p.trim() !== ""),
        });

        setLoading(false);

        if (result?.error) {
            setError(result.error);
            toast.error("Gagal", { description: result.error });
        } else {
            toast.success("Berhasil", { description: "Penghuni baru telah ditambahkan" });
            handleClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); }}>
            <DialogContent className="bg-background/95 backdrop-blur-xl border border-border/60 shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-sm">Tambah Penghuni</DialogTitle>
                    <DialogDescription className="text-[10px]">Isi data dengan lengkap dan benar.</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-medium text-muted-foreground uppercase">PID <span className="text-red-400">*</span></label>
                        <input
                            autoFocus
                            value={pid}
                            onChange={(e) => setPid(e.target.value)}
                            placeholder="cth: arkalit111"
                            className="bg-white/5 border border-border/50 rounded-lg px-3 py-2 text-sm font-mono text-foreground outline-none focus:border-primary/60"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-medium text-muted-foreground uppercase">Nama <span className="text-red-400">*</span></label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nama lengkap"
                            className="bg-white/5 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-medium text-muted-foreground uppercase">Email <span className="text-red-400">*</span></label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@contoh.com"
                            className="bg-white/5 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-medium text-muted-foreground uppercase">Status</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsActive(true)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${isActive ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-white/5 text-muted-foreground border-border/50 hover:bg-white/10"}`}
                            >
                                Aktif
                            </button>
                            <button
                                onClick={() => setIsActive(false)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${!isActive ? "bg-red-500/20 text-red-400 border-red-500/40" : "bg-white/5 text-muted-foreground border-border/50 hover:bg-white/10"}`}
                            >
                                Nonaktif
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-medium text-muted-foreground uppercase">TNKB / Plat Nomor</label>
                            <button onClick={addPlate} className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80">
                                <Plus className="w-3 h-3" /> Tambah
                            </button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {plateNumber.map((plate, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input
                                        value={plate}
                                        onChange={(e) => updatePlate(i, e.target.value)}
                                        placeholder={`Plat ${i + 1}, cth: DK1234AB`}
                                        className="flex-1 bg-white/5 border border-border/50 rounded-lg px-3 py-1.5 text-xs font-mono text-foreground outline-none focus:border-primary/60 uppercase"
                                    />
                                    <button
                                        onClick={() => removePlate(i)}
                                        disabled={plateNumber.length === 1}
                                        className="text-red-400 hover:text-red-300 shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {error && (
                    <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="flex gap-2 mt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Simpan
                    </button>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2.5 rounded-xl bg-white/5 text-muted-foreground border border-border/50 text-sm hover:bg-white/10"
                    >
                        Batal
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}