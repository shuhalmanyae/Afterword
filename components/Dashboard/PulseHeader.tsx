"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl"; // Assuming internationalization support
// Fallback if useTranslations is not set up contextually yet, user can replace text later.

interface PulseHeaderProps {
    userName?: string;
}

export default function PulseHeader({ userName = "Keyholder" }: PulseHeaderProps) {
    // Animation for the pulse line
    const pulseVariants = {
        initial: { pathLength: 0, opacity: 0 },
        animate: {
            pathLength: 1,
            opacity: 1,
            transition: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop" as const,
                repeatDelay: 1
            }
        }
    };

    return (
        <header className="w-full flex flex-col items-center justify-center space-y-6 pt-8 pb-4">
            {/* The Pulse Line - Minimalist Heartbeat */}
            <div className="w-full max-w-xs md:max-w-sm h-12 relative flex items-center justify-center">
                <svg viewBox="0 0 200 50" className="w-full h-full text-[#D4AF37] opacity-80">
                    {/* Static Line */}
                    <path
                        d="M0 25 H80 L90 5 L100 45 L110 25 H200"
                        className="stroke-current stroke-[0.5] fill-none opacity-20"
                    />
                    {/* Active Pulse */}
                    <motion.path
                        d="M0 25 H80 L90 5 L100 45 L110 25 H200"
                        className="stroke-current stroke-2 fill-none filter drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                        transition={{
                            duration: 2.5,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 0.5
                        }}
                    />
                </svg>
            </div>

            {/* Greeting */}
            <div className="text-center space-y-2">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl md:text-3xl font-serif text-white tracking-wide"
                >
                    Good evening, <span className="text-white/80 border-b border-[#D4AF37]/30 pb-0.5">{userName}</span>.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-white/40 font-sans text-xs uppercase tracking-[0.2em]"
                >
                    Your pulse is active. Your legacy is secure.
                </motion.p>
            </div>
        </header>
    );
}
