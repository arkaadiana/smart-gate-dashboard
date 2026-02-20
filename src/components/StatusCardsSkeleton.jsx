import { Skeleton } from "@/components/ui/skeleton";
import { Activity, CheckCircle, XCircle, Wifi, Radio, DoorOpen } from "lucide-react";

export default function StatusCardsSkeleton() {
    const skeletonStats = [
        { label: "Total Akses", icon: Activity, color: "text-blue-400/50" },
        { label: "Status Gerbang", icon: DoorOpen, color: "text-yellow-400/50" },
        { label: "Total Ditolak", icon: XCircle, color: "text-red-400/50" },
        { label: "Status Device", icon: Wifi, color: "text-emerald-400/50" },
        { label: "Total Diterima", icon: CheckCircle, color: "text-green-400/50" },
        { label: "Status MQTT", icon: Radio, color: "text-emerald-400/50" },
    ];

    return (
        <div className="grid grid-cols-2 gap-2.5 h-full">
            {skeletonStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={i}
                        className="glass rounded-xl p-3 flex flex-col justify-between h-full"
                    >
                        <div className="flex items-center gap-1.5 text-muted-foreground/50 text-[11px]">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${stat.color}`} />
                            <span className="truncate">{stat.label}</span>
                        </div>

                        <Skeleton className="h-9 w-16 mt-2 opacity-30" />
                    </div>
                );
            })}
        </div>
    );
}