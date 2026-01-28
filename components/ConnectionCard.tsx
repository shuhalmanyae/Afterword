"use client";

import { motion } from "framer-motion";
import { X, Mail, Phone, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ConnectionCardProps {
    node: { id: string; text: string; email?: string; phone?: string };
    onClose: () => void;
    onDelete: (id: string) => void;
    onSave: (id: string, email: string, phone: string) => void;
    variant?: 'modal' | 'embedded';
    showValidationErrors?: boolean;
}

export default function ConnectionCard({ node, onClose, onDelete, onSave, variant = 'modal', showValidationErrors = false }: ConnectionCardProps) {

    const [email, setEmail] = useState(node.email || "");
    const [phone, setPhone] = useState(node.phone || "");
    const isModal = variant === 'modal';

    useEffect(() => {
        // Sync local state when node changes
        if (node.email !== email) setEmail(node.email || "");
        if (node.phone !== phone) setPhone(node.phone || "");
        // We suppress the exhaustive-deps warning because we specifically want to
        // update ONLY when the node ID changes or the incoming node data updates,
        // but we don't want to loop on 'email'/'phone' local state changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node.id, node.email, node.phone]);

    const handleSave = () => {
        onSave(node.id, email, phone);
        if (isModal) onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={isModal
                ? "fixed inset-y-0 right-0 z-[60] w-full md:w-[400px] bg-[#050505]/95 backdrop-blur-2xl border-l border-white/10 p-8 md:p-12 flex flex-col pointer-events-auto"
                : "relative w-full md:w-[24rem] border-l border-white/5 p-8 flex flex-col h-full bg-white/[0.01]"
            }
        >
            {/* Close - Only for Modal */}
            {isModal && (
                <button onClick={onClose} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            )}

            {/* Header */}
            <div className={isModal ? "mt-20 mb-12" : "mt-0 mb-8"}>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-4">Connection Details</p>
                <h3 className="text-3xl md:text-4xl font-serif text-white">{node.text}</h3>
            </div>

            {/* Fields */}
            <div className="space-y-12 flex-1">
                <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-white/30 group-focus-within:text-white/70 mb-2 transition-colors">
                        Email Address
                    </label>
                    <div className="relative flex items-center">
                        <Mail className="w-4 h-4 text-white/30 mr-4" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className={`w-full bg-transparent border-b py-3 text-white text-lg placeholder-white/20 focus:outline-none focus:border-white/60 transition-colors font-light ${showValidationErrors && !email ? 'border-red-500/50' : 'border-white/10'
                                }`}
                        />
                        {showValidationErrors && !email && (
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-red-500 uppercase tracking-wider font-bold">Required</span>
                        )}
                    </div>
                </div>

                <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-white/30 group-focus-within:text-white/70 mb-2 transition-colors">
                        Mobile Number
                    </label>
                    <div className="relative flex items-center">
                        <Phone className="w-4 h-4 text-white/30 mr-4" />
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className={`w-full bg-transparent border-b py-3 text-white text-lg placeholder-white/20 focus:outline-none focus:border-white/60 transition-colors font-light ${showValidationErrors && !phone ? 'border-red-500/50' : 'border-white/10'
                                }`}
                        />
                        {showValidationErrors && !phone && (
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-red-500 uppercase tracking-wider font-bold">Required</span>
                        )}
                    </div>
                </div>

                <p className="text-xs text-white/50 leading-relaxed font-light mt-8">
                    We require these details solely to ensure delivery when the time comes. Under no circumstances will this person be notified of your plans until the vault is opened.
                </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-6 border-t border-white/10 pt-8">

                <button
                    onClick={handleSave}
                    className="group flex items-center gap-3 text-sm font-medium tracking-[0.2em] uppercase text-white hover:opacity-80 transition-opacity"
                >
                    Confirm
                    <div className="w-8 h-px bg-white group-hover:w-12 transition-all duration-300" />
                </button>
            </div>
        </motion.div>
    );
}
