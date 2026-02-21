"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Clock, Car, Info } from "lucide-react";

export default function AccessLogRow({ log }: { log: any }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const isGranted = log.status === "GRANTED";
    const vehicleType = log.vehicle === "CAR" ? "Mobil" : log.vehicle === "MOTORCYCLE" ? "Motor" : log.vehicle;

    const formatTime = (isoString: string) => {
        if (!isoString) return "-";
        const date = new Date(isoString);

        return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/\./g, ':');
    };

    return (
        <>
            <TableRow
                className="border-border/20 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <TableCell className="text-[10px] py-1.5 text-muted-foreground truncate">
                    {formatTime(log.timestamp)}
                </TableCell>

                <TableCell className="text-[10px] py-1.5 font-mono truncate">
                    {log.isManual ? (
                        <span className="bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider">
                            MANUAL
                        </span>
                    ) : (
                        log.pid || "-"
                    )}
                </TableCell>

                <TableCell className="text-[10px] py-1.5 font-medium truncate">{log.user?.name || "Guest"}</TableCell>
                <TableCell className="text-[10px] py-1.5 font-mono font-semibold truncate">{log.plateNumber || "-"}</TableCell>
                <TableCell className="py-1.5 text-center">
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${isGranted ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" : "text-red-400 border-red-400/30 bg-red-400/10"}`}>
                        {isGranted ? "Diterima" : "Ditolak"}
                    </Badge>
                </TableCell>
                <TableCell className="py-1.5 text-center">
                    <div className="flex justify-center">
                        {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                    </div>
                </TableCell>
            </TableRow>

            {isExpanded && (
                <TableRow className="bg-white/2 border-border/10">
                    <TableCell colSpan={6} className="py-2 px-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="flex items-center gap-1 text-[8px] uppercase text-muted-foreground"><Car className="w-2 h-2" /> Kendaraan</span>
                                <span className="text-[10px] truncate">{vehicleType || "-"} {log.isManual ? "(Operator)" : "(Sistem)"}</span>
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="flex items-center gap-1 text-[8px] uppercase text-muted-foreground"><Info className="w-2 h-2" /> Alasan</span>
                                <span className="text-[10px] text-muted-foreground italic wrap-break-word whitespace-normal">{log.reason || "Tidak ada keterangan"}</span>
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="flex items-center gap-1 text-[8px] uppercase text-muted-foreground"><Clock className="w-2 h-2" /> ID Transaksi</span>
                                <span className="text-[10px] font-mono text-muted-foreground truncate" title={log.id}>{log.id}</span>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}