"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface UserProfile {
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  // Load user profile data
  useEffect(() => {
    if (session?.user) {
      loadProfile();
    }
  }, [session]);

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        // Update the session if name changed
        if (profile.name !== session?.user?.name) {
          await update();
        }
      } else {
        setError(data.error || "Failed to update profile");
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf6f1]">
        <div className="text-[#5c2e0f] text-lg font-serif">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf6f1]">
        <div className="text-center p-8 bg-[#fffefb] rounded-lg shadow-lg border border-yellow-800">
          <p className="text-[#5c2e0f] text-lg font-serif">
            You need to be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f1] p-8 font-serif">
      <div className="container mx-auto max-w-4xl">
        <h1
          className="text-4xl font-bold mb-8 text-center text-[#5c2e0f] tracking-wide"
          style={{ fontFamily: "'Tangerine', cursive" }}
        >
          My Profile
        </h1>

        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <Card className="bg-[#faf6f1] border-yellow-800 shadow-lg">
          <CardHeader className="border-b border-yellow-200">
            <CardTitle className="text-2xl text-[#5c2e0f] flex justify-between items-center">
              Profile Information
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="border-[#8b5c2c] text-[#8b5c2c] hover:bg-[#8b5c2c] hover:text-white"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-[#5c2e0f] font-semibold"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-[#fffdf6] border-[#c3a46e] disabled:opacity-60"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-[#5c2e0f] font-semibold"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-[#fffdf6] border-[#c3a46e] disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="border-t border-yellow-200 pt-6">
                <h3 className="text-xl text-[#5c2e0f] font-semibold mb-4">
                  Address Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="address.street"
                      className="text-[#5c2e0f] font-semibold"
                    >
                      Street Address
                    </Label>
                    <Input
                      id="address.street"
                      name="address.street"
                      type="text"
                      value={profile.address.street}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-[#fffdf6] border-[#c3a46e] disabled:opacity-60"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="address.city"
                        className="text-[#5c2e0f] font-semibold"
                      >
                        City
                      </Label>
                      <Input
                        id="address.city"
                        name="address.city"
                        type="text"
                        value={profile.address.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#fffdf6] border-[#c3a46e] disabled:opacity-60"
                        placeholder="Enter your city"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="address.state"
                        className="text-[#5c2e0f] font-semibold"
                      >
                        State/Province
                      </Label>
                      <Input
                        id="address.state"
                        name="address.state"
                        type="text"
                        value={profile.address.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#fffdf6] border-[#c3a46e] disabled:opacity-60"
                        placeholder="Enter your state"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="address.zipCode"
                        className="text-[#5c2e0f] font-semibold"
                      >
                        ZIP/Postal Code
                      </Label>
                      <Input
                        id="address.zipCode"
                        name="address.zipCode"
                        type="text"
                        value={profile.address.zipCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#fffdf6] border-[#c3a46e] disabled:opacity-60"
                        placeholder="Enter your ZIP code"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="address.country"
                        className="text-[#5c2e0f] font-semibold"
                      >
                        Country
                      </Label>
                      <Input
                        id="address.country"
                        name="address.country"
                        type="text"
                        value={profile.address.country}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#fffdf6] border-[#c3a46e] disabled:opacity-60"
                        placeholder="Enter your country"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-6 border-t border-yellow-200">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#8b5c2c] hover:bg-[#a56b34] text-white font-bold disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      loadProfile(); // Reset to original data
                    }}
                    className="border-[#8b5c2c] text-[#8b5c2c] hover:bg-[#8b5c2c] hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card
          className="mt-6 bg-[#faf6f1]
         border-yellow-800 shadow-lg"
        >
          <CardHeader>
            <CardTitle className="text-xl text-[#5c2e0f]">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ">
              <div>
                <span className="text-[#6b4e2f] font-semibold">
                  Account Email:
                </span>
                <p className="text-[#5c2e0f]">{session?.user?.email}</p>
              </div>
              <div>
                <span className="text-[#6b4e2f] font-semibold">
                  Account Name:
                </span>
                <p className="text-[#5c2e0f]">{session?.user?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
