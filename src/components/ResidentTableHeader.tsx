"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import CreateUserModal from "./CreateUserModal";

export default function ResidentTableHeader() {
    const [showCreate, setShowCreate] = useState(false);

    return (
        <>
            <div className="px-3 py-2 border-b border-border/30 flex items-center justify-between">
                <div className="w-5" />
                <h3 className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">Penghuni</h3>
                <button
                    onClick={() => setShowCreate(true)}
                    className="text-primary hover:text-primary/80 transition-colors"
                    title="Tambah Penghuni"
                >
                    <UserPlus className="w-3.5 h-3.5" />
                </button>
            </div>

            <CreateUserModal open={showCreate} onClose={() => setShowCreate(false)} />
        </>
    );
}