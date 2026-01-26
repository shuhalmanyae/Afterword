"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Send, Check } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        setTimeout(() => {
            setStatus("success");
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-background text-foreground relative font-sans overflow-x-hidden selection:bg-foreground/10 pt-32 pb-24 px-6 md:px-12 transition-colors duration-500">

            {/* Background Overlay - Adjusted for Light/Dark */}
            <div className="fixed inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background z-0 pointer-events-none transition-colors duration-500" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-16">

                {/* 1. Hero Section */}
                <header className="text-center space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 70, damping: 15 }}
                        className="text-3xl md:text-5xl font-serif tracking-tight"
                    >
                        How may we be of service?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl md:text-2xl text-foreground/50 font-light tracking-wide uppercase font-serif"
                    >
                        Confidential. Human.
                    </motion.p>
                </header>

                {/* 2. Main Content (Single Column Swiss Layout) */}
                <div className="border-t border-border/50 pt-12">

                    {/* Centered Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="max-w-2xl mx-auto space-y-12"
                    >
                        <div className="space-y-8">
                            <h2 className="text-3xl font-sans font-light tracking-tighter text-foreground text-center">
                                Get In Touch.
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 block">Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-transparent border-b border-border/50 py-3 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors rounded-none font-light placeholder-foreground/10"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 block">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-transparent border-b border-border/50 py-3 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors rounded-none font-light placeholder-foreground/10"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 block">Topic</label>
                                    <div className="relative group">
                                        <select defaultValue="Privacy Question" className="w-full bg-transparent border-b border-border/50 py-3 text-sm text-foreground/70 focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer rounded-none font-light pr-10 hover:text-foreground">
                                            <option className="bg-background text-foreground">Technical Support</option>
                                            <option className="bg-background text-foreground">Billing Inquiry</option>
                                            <option className="bg-background text-foreground">Privacy Question</option>
                                            <option className="bg-background text-foreground">Other</option>
                                        </select>
                                        {/* Custom Arrow to appear clickable */}
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40 group-hover:text-foreground transition-colors">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 block">Message</label>
                                    <textarea
                                        rows={4}
                                        required
                                        className="w-full bg-transparent border-b border-border/50 py-3 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors resize-y rounded-none font-light placeholder-foreground/10 min-h-[100px]"
                                        placeholder="Type your message"
                                    />
                                </div>

                                <div className="flex justify-center pt-8">
                                    <button
                                        type="submit"
                                        disabled={status !== "idle"}
                                        className={`group relative flex items-center justify-center gap-3 px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden min-w-[160px] rounded-full border ${status === "success"
                                            ? "bg-transparent text-foreground border-foreground"
                                            : "bg-foreground text-background border-transparent hover:bg-foreground/90"
                                            }`}
                                    >
                                        <AnimatePresence mode="wait">
                                            {status === "idle" && (
                                                <motion.span
                                                    key="send"
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -20, opacity: 0 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    Send
                                                    <Send className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                                </motion.span>
                                            )}

                                            {status === "submitting" && (
                                                <motion.span
                                                    key="sending"
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -20, opacity: 0 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    Sending...
                                                </motion.span>
                                            )}

                                            {status === "success" && (
                                                <motion.span
                                                    key="sent"
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    Sent
                                                    <Check className="w-4 h-4" />
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
