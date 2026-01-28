"use client";

import { motion } from "framer-motion";
import { Plus, User } from "lucide-react";

interface Beneficiary {
    id: string;
    name: string;
    hasContent: boolean; // Simulating "if recipient has message"
}

interface LegacyMapProps {
    beneficiaries: Beneficiary[];
    onSelect: (id: string) => void;
    onAdd: () => void;
}

export default function LegacyMap({ beneficiaries, onSelect, onAdd }: LegacyMapProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full max-w-4xl mx-auto px-4"
        >
            <div className="flex flex-col space-y-4">
                {beneficiaries.map((b) => (
                    <motion.div
                        key={b.id}
                        variants={itemVariants}
                        onClick={() => onSelect(b.id)}
                        className={`
                            relative w-full h-14 rounded-lg flex items-center justify-start px-3 gap-3 cursor-pointer transition-all duration-300 group
                            ${b.hasContent
                                ? "bg-white/[0.03] border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.05)] hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/60"
                                : "bg-transparent border border-dashed border-white/10 hover:border-white/30 hover:bg-white/[0.02]"
                            }
                        `}
                    >
                        {/* Glow for Active */}
                        {b.hasContent && (
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}

                        {/* Icon */}
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all
                            ${b.hasContent ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "bg-white/5 text-white/30 group-hover:bg-white/10 group-hover:text-white/60"}
                        `}>
                            <User className="w-4 h-4" />
                        </div>

                        {/* Text Info */}
                        <div className="flex flex-col items-start flex-1 min-w-0">
                            <span className={`
                                text-sm font-medium font-serif tracking-wide truncate w-full text-left
                                ${b.hasContent ? "text-white" : "text-white/50 group-hover:text-white/80"}
                            `}>
                                {b.name}
                            </span>
                            <span className={`
                                text-[10px] uppercase tracking-widest mt-0.5
                                ${b.hasContent ? "text-[#D4AF37] opacity-80" : "text-white/20"}
                            `}>
                                {b.hasContent ? "Secured" : "Empty"}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {/* 'Add New' Placeholder */}
                <motion.div
                    variants={itemVariants}
                    onClick={onAdd}
                    className="w-full h-16 rounded-xl border border-dotted border-white/10 flex items-center justify-center gap-3 cursor-pointer hover:border-white/40 hover:bg-white/[0.02] group transition-all"
                >
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform text-white/40 group-hover:text-white">
                        <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-white/30 font-sans group-hover:text-white/70 transition-colors uppercase tracking-widest">Add Person</span>
                </motion.div>
            </div>
        </motion.div>
    );
}
