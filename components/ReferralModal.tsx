"use client";

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { sendReferralEmail } from "@/app/actions";

export default function ReferralModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const t = useTranslations("About.Modal");
    const defaultMessage = t('message_card');

    // State
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    // Typewriter effect for default message
    useEffect(() => {
        if (isOpen && !message) {
            let i = 0;
            const text = defaultMessage;
            setMessage(""); // Reset
            setIsTypingComplete(false);

            const interval = setInterval(() => {
                setMessage((prev) => text.substring(0, i + 1));
                i++;
                if (i === text.length) {
                    clearInterval(interval);
                    setIsTypingComplete(true);
                }
            }, 30); // Speed of typing

            return () => clearInterval(interval);
        }
    }, [isOpen, defaultMessage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("submitting");
        try {
            await sendReferralEmail(email, message || defaultMessage);
            setStatus("success");
            setTimeout(() => {
                onClose();
                setStatus("idle");
                setEmail("");
                setMessage("");
            }, 3000);
        } catch (error) {
            console.error("Failed to send referral", error);
            setStatus("idle");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0a0a0a] border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)] z-50 overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors p-2"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <>
                            <div className="mb-8">
                                <h3 className="text-3xl font-serif text-white mb-3">{t('headline')}</h3>
                                <p className="text-white/50 font-light text-sm">
                                    {t('subtext')}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Recipient Email */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 block">Recipient Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={status !== "idle"}
                                        className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors rounded-none font-light placeholder-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder={t('input_placeholder')}
                                    />
                                </div>

                                {/* Message Textarea - Increased Height (12 rows/240px) */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 block">Note</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={7}
                                        autoFocus
                                        disabled={status !== "idle"}
                                        className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors resize-y rounded-none font-light placeholder-white/10 min-h-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Add a personal note..."
                                    />
                                </div>

                                {/* Animated Button */}
                                <div className="flex justify-center pt-4">
                                    <button
                                        type="submit"
                                        disabled={status !== "idle"}
                                        className={`group relative flex items-center justify-center gap-3 px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden min-w-[160px] rounded-full border ${status === "success"
                                            ? "bg-transparent text-white border-white"
                                            : "bg-white text-black border-transparent hover:bg-white/90"
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
                                                    {t('button')}
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
                        </>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
