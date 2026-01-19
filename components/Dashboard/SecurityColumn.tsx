"use client";

import { ShieldCheck, Clock, AlertTriangle, Key, ArrowRight } from "lucide-react";

interface SecurityColumnProps {
    onSubmitAll: () => void;
}

export default function SecurityColumn({ onSubmitAll }: SecurityColumnProps) {
    const nextCheck = "Nov 01, 2026";
    const userIsGuest = true; // Hardcoded for demo logic

    return (
        /* Activate Protocol Action - Button Only */
        <button
            onClick={onSubmitAll}
            className="w-64 py-4 bg-white text-black rounded-full font-bold tracking-wide shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
        >
            Activate Protocol
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
    );
}
