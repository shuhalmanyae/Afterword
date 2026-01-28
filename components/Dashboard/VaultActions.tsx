"use client";

import { motion } from "framer-motion";
import { PenTool, Mic, Key } from "lucide-react";

interface VaultActionsProps {
    onWrite: () => void;
    onRecord: () => void;
    onProtocol: () => void;
    keyholderName?: string;
}

export default function VaultActions({ onWrite, onRecord, onProtocol, keyholderName = "Not Set" }: VaultActionsProps) {
    const cards = [
        {
            id: "write",
            label: "Write a Letter",
            icon: PenTool,
            action: onWrite,
            desc: "Compose your thoughts.",
            delay: 0.2
        },
        {
            id: "record",
            label: "Record a Message",
            icon: Mic,
            action: onRecord,
            desc: "Leave your voice.",
            delay: 0.3
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto px-4 mt-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Action Cards */}
                {cards.map((card) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: card.delay, duration: 0.6 }}
                        onClick={card.action}
                        className="group relative h-40 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md overflow-hidden"
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <card.icon className="w-5 h-5 text-white/70 group-hover:text-white" />
                        </div>
                        <h3 className="relative z-10 text-lg font-serif text-white mb-1">{card.label}</h3>
                        <p className="relative z-10 text-xs text-white/40 font-sans tracking-wide">{card.desc}</p>
                    </motion.div>
                ))}

                {/* Keyholder Status Card (Now Clickable) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    onClick={onProtocol}
                    className="group relative h-40 bg-[#D4AF37]/[0.05] border border-[#D4AF37]/20 rounded-2xl flex flex-col items-center justify-center transition-all backdrop-blur-md cursor-pointer hover:bg-[#D4AF37]/[0.1] hover:border-[#D4AF37]/40"
                >
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Key className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-serif text-[#D4AF37] mb-1">The Keyholder</h3>
                        <p className="text-xs text-[#D4AF37]/60 font-sans tracking-widest uppercase">{keyholderName}</p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
