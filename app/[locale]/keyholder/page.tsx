"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";

// Swiss Shield Icon
const SwissKey = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
    </svg>
);

export default function KeyholderPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden pt-32 pb-24 px-6 md:px-12 flex flex-col justify-center">
            {/* Background Overlay */}
            <div className="fixed inset-0 bg-gradient-to-b from-[#111] via-[#050505] to-[#000] z-0 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-12 text-center">
                <header className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <SwissKey className="w-6 h-6 text-white" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-serif tracking-tight"
                    >
                        The Keyholder
                    </motion.h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "60px" }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="h-px bg-white/30 mx-auto"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-white/60 font-light text-lg leading-relaxed max-w-lg mx-auto"
                    >
                        A Keyholder is a designated individual entrusted with the responsibility of confirming a user's status.
                    </motion.p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-lg text-left"
                >
                    <div className="space-y-2">
                        <h3 className="text-white font-serif text-xl">Designated Responsibility</h3>
                        <p className="text-white/50 text-sm leading-relaxed">
                            If you have been named a Keyholder, you play a critical role in the Afterword protocol. Your confirmation is required to unlock the Sovereign Vault and release encrypted messages to their intended recipients.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-white font-serif text-xl">Security Protocol</h3>
                        <p className="text-white/50 text-sm leading-relaxed">
                            For security reasons, verification cannot be initiated from this public page.
                        </p>
                        <p className="text-white/50 text-sm leading-relaxed mt-2">
                            Please check your secure communication channels (email or direct message) for your <strong>Unique Entry Token</strong>. This token is the only key that grants access to the Verification Portal.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <Link
                        href="/"
                        className="inline-block py-4 px-8 border border-white/20 hover:bg-white hover:text-black transition-all rounded-md uppercase tracking-[0.2em] text-xs font-bold"
                    >
                        Return Home
                    </Link>
                </motion.div>

                {/* Developer / Demo Access */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-16 pt-8 border-t border-white/5"
                >
                    <p className="text-white/20 text-xs uppercase tracking-widest mb-4">Developer Access</p>
                    <Link
                        href="/verify/test-token"
                        className="text-white/40 hover:text-white underline underline-offset-4 text-sm transition-colors"
                    >
                        Launch Mock Verification Portal
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
