"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, CreditCard, UserCircle, Edit, Trash2 } from "lucide-react";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

export default function ResidentRow({ r }: { r: any }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <TableRow
                className="border-border/20 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <TableCell className="text-[10px] py-1.5 font-mono text-muted-foreground truncate">{r.pid}</TableCell>
                <TableCell className="text-[10px] py-1.5 font-medium truncate">{r.name}</TableCell>
                <TableCell className="text-[10px] py-1.5 text-muted-foreground truncate">{r.email}</TableCell>
                <TableCell className="text-[10px] py-1.5 font-mono truncate">
                    {r.plateNumber?.[0] || "-"}{" "}
                    {r.plateNumber?.length > 1 && `(+${r.plateNumber.length - 1})`}
                </TableCell>
                <TableCell className="py-1.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full font-medium text-[9px] ${r.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                        {r.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                </TableCell>
                <TableCell className="py-1.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setShowEdit(true)} className="text-blue-400 hover:text-blue-300 transition-colors">
                            <Edit className="w-3 h-3" />
                        </button>
                        <button onClick={() => setShowDelete(true)} className="text-red-400 hover:text-red-300 transition-colors">
                            <Trash2 className="w-3 h-3" />
                        </button>
                        {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                    </div>
                </TableCell>
            </TableRow>

            {isExpanded && (
                <TableRow className="bg-white/2 border-border/10">
                    <TableCell colSpan={6} className="py-2 px-4">
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-1 text-[8px] uppercase text-muted-foreground tracking-tighter">
                                    <CreditCard className="w-2 h-2" /> Daftar TNKB Lengkap
                                </span>
                                <span className="text-[10px] font-mono text-emerald-400">
                                    {r.plateNumber?.join(" • ") || "-"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-1 text-[8px] uppercase text-muted-foreground tracking-tighter">
                                    <UserCircle className="w-2 h-2" /> Informasi Tambahan
                                </span>
                                <div className="flex gap-3 text-[9px]">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        ID: <span className="font-mono text-foreground">{r.id}</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        Role: <span className="text-foreground uppercase">{r.role}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}

            <EditUserModal r={r} open={showEdit} onClose={() => setShowEdit(false)} />
            <DeleteUserModal r={r} open={showDelete} onClose={() => setShowDelete(false)} />
        </>
    );
}