"use client";

import { X, User, Mail, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (contact: { name: string; email: string }) => void;
}

export default function AddContactModal({ isOpen, onClose, onAdd }: AddContactModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = () => {
        if (name && email) {
            onAdd({ name, email });
            setName("");
            setEmail("");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
                    <h2 className="text-md font-medium text-white">Add Contact</h2>
                    <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs uppercase text-white/40 tracking-wider mb-2 flex items-center gap-2">
                            <User className="w-3 h-3" /> Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                            placeholder="e.g. John Doe"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-white/40 tracking-wider mb-2 flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                            placeholder="john@example.com"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 mt-2 text-sm"
                    >
                        <Save className="w-4 h-4" /> Add
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
