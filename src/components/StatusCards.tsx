"use client";

import { Activity, CheckCircle, XCircle, Wifi, Radio, DoorOpen, DoorClosed } from "lucide-react";
import { useMqtt } from "./MqttProvider";

export default function StatusCards({ initialSummary }: { initialSummary: any }) {
    const { isConnected, isDeviceOnline, deviceStatus } = useMqtt();

    const isGateOpen = deviceStatus.gate_status?.toUpperCase() === "OPEN";

    const stats = [
        { label: "Total Akses", value: initialSummary.total, icon: Activity, color: "text-blue-400", highlight: true },
        { 
            label: "Status Gerbang", 
            value: isGateOpen ? "Terbuka" : "Tertutup", 
            icon: isGateOpen ? DoorOpen : DoorClosed, 
            color: isGateOpen ? "text-yellow-400" : "text-emerald-400", 
            highlight: false 
        },
        { label: "Total Ditolak", value: initialSummary.denied, icon: XCircle, color: "text-red-400", highlight: true },
        { 
            label: "Status Device", 
            value: isDeviceOnline ? "Online" : "Offline", 
            icon: Wifi, 
            color: isDeviceOnline ? "text-emerald-400" : "text-red-400", 
            highlight: false 
        },
        { label: "Total Diterima", value: initialSummary.granted, icon: CheckCircle, color: "text-green-400", highlight: true },
        { 
            label: "Status MQTT", 
            value: isConnected ? "Tersambung" : "Terputus", 
            icon: Radio, 
            color: isConnected ? "text-emerald-400" : "text-red-400", 
            highlight: false 
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-2.5 h-full">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div key={stat.label} className="glass rounded-xl p-3 flex flex-col justify-between cursor-default transition-transform duration-200 ease-out hover:scale-[1.04] hover:z-10">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${stat.color}`} />
                            <span className="truncate">{stat.label}</span>
                        </div>
                        <p className={`font-bold leading-none tracking-tight mt-2 ${stat.highlight ? "text-4xl" : "text-2xl"}`}>
                            {stat.value}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}