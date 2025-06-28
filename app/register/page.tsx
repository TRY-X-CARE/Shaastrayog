// app/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { trackCompleteRegistration } from "@/lib/facebook-pixel";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { isUserLoggedIn } = useAuth();

  useEffect(() => {
    if (isUserLoggedIn) {
      router.push("/");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");

        setError(data.error || "Registration failed");
      } else {
        // Track Complete Registration event for Facebook Pixel
        trackCompleteRegistration();
        
        setSuccess(true);
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-10 bg-[#f8f1e4] font-serif">
        <div className="w-full max-w-md p-8 space-y-6 bg-[#fffefb] rounded-lg shadow-lg border border-yellow-800">
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              Account created successfully! Redirecting to login...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center mt-10 bg-[#f8f1e4] font-serif">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#fffefb] rounded-lg shadow-lg border border-yellow-800">
        <h1
          className="text-3xl font-bold text-center text-[#5c2e0f] tracking-wide"
          style={{ fontFamily: "'Tangerine', cursive" }}
        >
          Shaastrayog Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[#5c2e0f] font-semibold">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              className="bg-[#fffdf6] border-[#c3a46e]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-[#5c2e0f] font-semibold"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="bg-[#fffdf6] border-[#c3a46e]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm italic">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8b5c2c] hover:bg-[#a56b34] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="text-center text-sm text-[#6b4e2f]">
          Already have an account?{" "}
          <Link href="/login" className="underline text-[#8b5c2c]">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
