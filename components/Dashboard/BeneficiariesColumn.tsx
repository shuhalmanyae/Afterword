"use client";

import { User, Plus, Trash2, X, Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useState } from "react";

interface Beneficiary {
    id: string;
    name: string;
    email: string;
}

interface BeneficiariesColumnProps {
    beneficiaries: Beneficiary[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onAdd: () => void;
    onDelete: (id: string) => void;
}

export default function BeneficiariesColumn({ beneficiaries, activeId, onSelect, onAdd, onDelete }: BeneficiariesColumnProps) {
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    return (
        <div className="flex flex-col h-full p-6 bg-black/40 backdrop-blur-md text-white">
            <div className="flex items-center justify-between mb-8 mt-4">
                <h2 className="text-xl font-light tracking-wide text-white/50 uppercase text-sm">Your Inner Circle</h2>
                <button
                    onClick={onAdd}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <Plus className="w-4 h-4 text-white" />
                </button>
            </div>

            <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
                {beneficiaries.map((b) => (
                    <div
                        key={b.id}
                        onClick={() => onSelect(b.id)}
                        className={`group relative p-4 rounded-lg border transition-all cursor-pointer ${activeId === b.id
                            ? "bg-white/10 border-white/30"
                            : "bg-neutral-900 border-white/5 hover:border-white/20"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all shrink-0 ${activeId === b.id
                                ? "bg-white/20 border-white/40"
                                : "bg-neutral-800 border-white/5 group-hover:border-white/30"
                                }`}>
                                <User className={`w-5 h-5 ${activeId === b.id ? "text-white" : "text-white/70"}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white truncate">{b.name}</p>
                            </div>
                        </div>

                        {/* Delete Action - Visible on Hover or if confirming */}
                        <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 ${confirmDeleteId === b.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}>
                            {confirmDeleteId === b.id ? (
                                <div className="flex items-center gap-1 bg-black/80 rounded-lg p-1 border border-white/20" onClick={(e) => e.stopPropagation()}>
                                    <span className="text-[10px] text-white/70 mr-1">Delete?</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(b.id); setConfirmDeleteId(null); }}
                                        className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <Check className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                                        className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(b.id); }}
                                    className="p-2 hover:bg-white/10 rounded-full text-white/30 hover:text-red-400 transition-colors"
                                    title="Delete Draft"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
                <button
                    onClick={onAdd}
                    className="w-full py-3 bg-white text-black rounded-full font-bold tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Contact</span>
                </button>
            </div>
        </div>
    );
}
