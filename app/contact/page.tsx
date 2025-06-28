"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trackContact } from "@/lib/facebook-pixel";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const contactItems = [
    {
      icon: <MapPin className="h-6 w-6 text-gray-700" />,
      title: "Address",
      content: "A 240 Basement okhla industrial area phase-1 new delhi 110020",
    },
    {
      icon: <Phone className="h-6 w-6 text-gray-700" />,
      title: "Call Us",
      content: "+91 88006 80473",
    },
    {
      icon: <Mail className="h-6 w-6 text-gray-700" />,
      title: "Emails",
      content: "rsfoods9268@gmail.com",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Track Contact event for Facebook Pixel
      trackContact();

      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <section className="relative top-24">
        <div className="container mx-auto px-6 bg-[#faf6f1] rounded-lg">
          <div className="flex flex-row gap-2 ">
            <div className="flex h-16 w-16 items-center justify-end">
              <p>Home /</p>
            </div>
            <div className="flex flex-col h-16 w-56 justify-center ">
              <p className="text-4xl ">Contact</p>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="flex flex-col gap-6 md:h-80 justify-center rounded-lg p-8">
            <div className="flex flex-col md:flex-row justify-around items-start md:items-center gap-10 p-6">
              {contactItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 max-w-xs">
                  <div className="rounded-full border border-dashed p-8">
                    {item.icon}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-700">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="py-12 px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="bg-white border-gray-300"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-semibold">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white border-gray-300"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject" className="text-gray-700 font-semibold">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Enter subject"
                    className="bg-white border-gray-300"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-gray-700 font-semibold">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Enter your message"
                    className="bg-white border-gray-300 min-h-[120px]"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8b5c2c] hover:bg-[#a56b34] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
