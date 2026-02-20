"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginAction({ email, password });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      toast.error("Gagal Login", { description: result.error });
    } else if (result?.success) {
      toast.success("Login Berhasil", { description: "Mengarahkan ke dashboard..." });

      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    }
  };

  return (
    <div className="glass rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="font-bold text-xl tracking-tight">Smart Gate</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Dashboard Monitoring System</p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 h-10 text-sm border-border/50 bg-white/5"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-9 h-10 text-sm border-border/50 bg-white/5"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" className="h-10 mt-1 active:scale-95 transition-transform" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Masuk...
            </span>
          ) : "Masuk"}
        </Button>
      </form>
    </div>
  );
}