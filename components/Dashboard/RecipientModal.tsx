"use client";

import { X, User, Phone, Mail, MapPin, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface RecipientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RecipientModal({ isOpen, onClose }: RecipientModalProps) {
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        // Simulate API call
        setTimeout(() => {
            setIsSaved(true);
            setTimeout(onClose, 2000); // Close after showing success
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-xl font-light text-white tracking-wide">Recipient Details</h2>
                    <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    {!isSaved ? (
                        <>
                            <div>
                                <label className="block text-xs uppercase text-white/60 tracking-wider mb-2 flex items-center gap-2 font-medium">
                                    <User className="w-3 h-3" /> Full Name
                                </label>
                                <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all shadow-inner" placeholder="e.g. Sarah Jenkins" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase text-white/60 tracking-wider mb-2 flex items-center gap-2 font-medium">
                                        <Phone className="w-3 h-3" /> Phone Number
                                    </label>
                                    <input type="tel" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all shadow-inner" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-white/60 tracking-wider mb-2 flex items-center gap-2 font-medium">
                                        <Mail className="w-3 h-3" /> Email Address
                                    </label>
                                    <input type="email" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all shadow-inner" placeholder="sarah@example.com" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-white/60 tracking-wider mb-2 flex items-center gap-2 font-medium">
                                    <MapPin className="w-3 h-3" /> Location / Address <span className="text-white/30 normal-case tracking-normal ml-auto text-[10px]">(Optional)</span>
                                </label>
                                <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all shadow-inner" placeholder="e.g. 123 Main St, New York, NY" />
                            </div>

                            <div className="pt-2">
                                <p className="text-[10px] text-white/30 leading-relaxed text-center">
                                    Disclaimer: We want all ways to deliver your message. This data is not to be used for any other purposes.
                                </p>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full py-4 bg-white text-black rounded-xl font-bold hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <Save className="w-4 h-4" /> Save Entry
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
                                <Save className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-medium text-white">Entry Saved</h3>
                            <p className="text-white/50 text-sm mt-2">Access this draft anytime from your dashboard.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
