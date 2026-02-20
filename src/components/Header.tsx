"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { logoutAction } from "@/app/auth/logout/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface HeaderProps {
    name: string;
    role: string;
}

export default function Header({ name, role }: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        const result = await logoutAction();
        
        if (result?.success) {
            toast.success("Sesi Berakhir", { description: "Anda telah berhasil logout." });
            
            setTimeout(() => {
                router.push("/auth/login");
            }, 500);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <p className="font-semibold text-sm leading-none">{name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{role}</p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <ThemeToggle />
                
                <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    <LogOut className="w-4 h-4" />
                </Button>
                
            </div>
        </header>
    );
}