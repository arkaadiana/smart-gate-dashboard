"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DoorOpen, DoorClosed, Terminal } from "lucide-react";
import { useMqtt } from "./MqttProvider";
import { toast } from "sonner";
import { manualGateAction } from "@/app/dashboard/actions/gate.action";

export default function GateControl() {
    const { publish, logs, deviceStatus, isConnected } = useMqtt();
    const [isAuto, setIsAuto] = useState(false);
    const [threshold, setThreshold] = useState("");

    useEffect(() => {
        setIsAuto(deviceStatus.mode === "AUTO" || deviceStatus.mode === "auto");
        if (deviceStatus.threshold !== null && deviceStatus.threshold !== undefined) {
            setThreshold(deviceStatus.threshold.toString());
        }
    }, [deviceStatus.mode, deviceStatus.threshold]);

    const handleControl = async (servoAction: "open" | "close") => {
        publish(
            process.env.NEXT_PUBLIC_MQTT_TOPIC_CONTROL!,
            {
                servo: servoAction,
                auto_mode: isAuto ? "auto" : "manual",
                threshold: Number(threshold),
                ping: false
            },
            `servo:${servoAction}`
        );

        toast.success(`Perintah dikirim: Gerbang ${servoAction === "open" ? "dibuka" : "ditutup"}`);

        if (servoAction === "open") {
            try {
                const result = await manualGateAction(servoAction);
                if (result?.error) {
                    console.error(result.error);
                }
            } catch (error) {
                console.error("Gagal mencatat log manual:", error);
            }
        }
    };

    const handleSaveThreshold = () => {
        publish(
            process.env.NEXT_PUBLIC_MQTT_TOPIC_CONTROL!,
            {
                servo: deviceStatus.gate_status?.toLowerCase() || "closed",
                auto_mode: isAuto ? "auto" : "manual",
                threshold: Number(threshold),
                ping: true
            },
            `threshold:${threshold}`
        );
        toast.success(`Ambang batas disimpan: ${threshold} cm`);
    };

    const toggleMode = (checked: boolean) => {
        setIsAuto(checked);
        const newMode = checked ? "auto" : "manual";
        publish(
            process.env.NEXT_PUBLIC_MQTT_TOPIC_CONTROL!,
            {
                servo: deviceStatus.gate_status?.toLowerCase() || "closed",
                auto_mode: newMode,
                threshold: Number(threshold),
                ping: false
            },
            `mode:${newMode}`
        );
        toast.success(`Mode diubah: ${checked ? "Otomatis" : "Manual"}`);
    };

    return (
        <div className="glass rounded-xl p-4 flex flex-col gap-3 h-full transition-transform duration-200 ease-out hover:scale-[1.02] hover:z-10">
            <div className="flex gap-2 shrink-0">
                <Button
                    onClick={() => handleControl("open")}
                    disabled={!isConnected}
                    className="flex-1 gap-1.5 h-9 text-xs bg-green-500/15 hover:bg-green-500/25 text-green-500 border border-green-500/25 rounded-lg transition-transform hover:scale-[1.03]" variant="outline"
                >
                    <DoorOpen className="w-3.5 h-3.5" /> BUKA
                </Button>
                <Button
                    onClick={() => handleControl("close")}
                    disabled={!isConnected}
                    className="flex-1 gap-1.5 h-9 text-xs bg-red-500/15 hover:bg-red-500/25 text-red-500 border border-red-500/25 rounded-lg transition-transform hover:scale-[1.03]" variant="outline"
                >
                    <DoorClosed className="w-3.5 h-3.5" /> TUTUP
                </Button>
            </div>

            <div className="glass rounded-lg px-3 py-2.5 flex items-center justify-between shrink-0 transition-transform duration-200 hover:scale-[1.02]">
                <Label className="font-medium text-sm cursor-pointer">Mode Otomatis</Label>
                <Switch disabled={!isConnected} checked={isAuto} onCheckedChange={toggleMode} />
            </div>

            <div className="glass rounded-lg px-3 py-2.5 flex items-center gap-2 shrink-0 transition-transform duration-200 hover:scale-[1.02]">
                <Label className="text-sm font-medium whitespace-nowrap">Ambang Batas</Label>
                <Input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-16 h-7 text-center text-sm font-mono border-border/50 ml-auto"
                />
                <span className="text-xs text-muted-foreground">cm</span>
                <Button onClick={handleSaveThreshold} disabled={!isConnected} size="sm" className="h-7 px-3 text-xs">Simpan</Button>
            </div>

            <div className="flex flex-col gap-1.5 w-full h-80 max-h-80 overflow-hidden hover:scale-[1.02] transition-transform duration-200 hover:z-10">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
                    <Terminal className="w-3 h-3" />
                    Log PUB/SUB MQTT
                </div>

                <div className="glass rounded-lg p-2.5 flex-1 overflow-y-auto font-mono text-[10px] text-muted-foreground min-h-0 border border-white/5 shadow-inner">
                    {logs.length === 0 ? (
                        <p className="text-center opacity-50 mt-4 italic">Menunggu aktivitas...</p>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {logs.map((log, i) => {
                                let colorClass = "text-emerald-400/90";
                                if (log.includes("FAILED") || log.includes("Ditolak")) colorClass = "text-red-400";
                                else if (log.includes("PUB")) colorClass = "text-blue-400";
                                else if (log.includes("PID:")) colorClass = "text-yellow-400";

                                return (
                                    <p key={i} className={`${colorClass} break-all leading-tight border-l border-white/10 pl-2`}>
                                        {log}
                                    </p>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}