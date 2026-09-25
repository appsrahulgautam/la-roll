"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) router.push("/admin");
    else alert("Invalid credentials");
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-xl shadow-zinc-200/50 space-y-8">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Admin Portal
          </h1>
          <p className="text-zinc-400 text-sm font-medium">
            Restricted access for Admin
          </p>
        </div>

        {/* <form onSubmit={handleAdminLogin} className="space-y-4"> */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Admin Email
          </label>
          <Input
            type="email"
            placeholder="Enter email"
            className="h-14 rounded-xl border-zinc-100 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Admin Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-14 rounded-xl border-zinc-100 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          onClick={handleAdminLogin}
          type="submit"
          className="w-full h-14 rounded-xl font-black uppercase tracking-widest"
        >
          Enter Dashboard
        </Button>

        <div className="text-center">
          <Link
            href="/forgot-password/admin"
            className="text-sm  text-black hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
}
