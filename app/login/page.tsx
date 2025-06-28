"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { signIn, isUserLoggedIn } = useAuth();

  useEffect(() => {
    if (isUserLoggedIn) {
      router.push("/");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signIn(email, password);
      toast.success("Login successful! Redirecting to home...");
      router.push("/");
    } catch (err: any) {
      const errorMessage = err?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f1e4] font-serif">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#fffefb] rounded-lg shadow-lg border border-yellow-800">
        <h1
          className="text-3xl font-bold text-center text-[#5c2e0f] tracking-wide"
          style={{ fontFamily: "'Tangerine', cursive" }}
        >
          Shaastrayog Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-[#5c2e0f] font-semibold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="bg-[#fffdf6] border-[#c3a46e]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-[#5c2e0f] font-semibold">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="bg-[#fffdf6] border-[#c3a46e]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm italic">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-[#8b5c2c] hover:bg-[#a56b34] text-white font-bold"
          >
            Login
          </Button>
        </form>
        <div className="text-center text-sm text-[#6b4e2f]">
          Don't have an account?{" "}
          <Link href="/register" className="underline text-[#8b5c2c]">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
