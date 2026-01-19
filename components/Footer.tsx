"use client";

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";
import { useState } from "react";
import { sendReferralEmail } from "@/app/actions";

export default function Footer() {
    const t = useTranslations('Footer'); // Still use basic footer keys
    const tAbout = useTranslations('About.Footer'); // Use About keys for specific company info
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <footer className="bg-black text-white py-12 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">

                    {/* Left Side - Company Info */}
                    <div className="space-y-2">
                        <h5 className="font-serif text-lg">{tAbout('company')}</h5>
                        <p className="text-white/40 text-sm font-light">{tAbout('address')}</p>
                        <a href="mailto:helloswitzerland@afterword.ch" className="text-white/40 text-sm font-light hover:text-white transition-colors block">
                            helloswitzerland@afterword.ch
                        </a>

                        {/* Legal Links (Merged from previous footer) */}
                        <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
                            <a href="#" className="text-xs text-white/30 hover:text-white transition-colors">{t('pledge')}</a>
                            <a href="#" className="text-xs text-white/30 hover:text-white transition-colors">{t('privacy')}</a>
                            <a href="#" className="text-xs text-white/30 hover:text-white transition-colors">{t('terms')}</a>
                        </div>
                        <p className="text-xs text-white/20 mt-2">
                            &copy; {new Date().getFullYear()} {t('copyright')}
                        </p>
                    </div>

                    {/* Right Side - Referral CTA */}
                    <div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-light px-4 py-2 border border-white/10 rounded-full hover:bg-white/5"
                        >
                            <span>{tAbout('referral_link')}</span>
                            <Send className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </footer>

            <ReferralModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

function ReferralModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const t = useTranslations("About.Modal");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    // Initialize message from translation if empty
    // We use a useEffect or just default it once.
    // However, hooks order matters.
    // Let's just set it on mount/open if empty.

    // Better yet, just use defaultValue
    const defaultMessage = t('message_card');

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-900/90 border border-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {status === "success" ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-serif text-white mb-2">{t('success')}</h3>
                            </motion.div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-serif text-white mb-2">{t('headline')}</h3>
                                <p className="text-white/60 font-light text-sm mb-6">
                                    {t('subtext')}
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Editable Message Area */}
                                    <div className="relative">
                                        <textarea
                                            value={message || defaultMessage}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-4 text-white/90 text-sm leading-relaxed resize-none focus:outline-none focus:border-white/30 transition-colors font-sans"
                                            placeholder="Your message..."
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            placeholder={t('input_placeholder')}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {status === "submitting" ? "Sending..." : t('button')}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
