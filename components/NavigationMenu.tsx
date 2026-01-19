"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom Dashes Icon (Stylish Hamburger)
function DashesIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="4" y1="8" x2="20" y2="8" />
            <line x1="4" y1="16" x2="20" y2="16" />
        </svg>
    );
}

export default function NavigationMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Dashboard", href: "/dashboard" },
    ];

    return (
        <>
            {/* Floating Toggle Button */}
            <div className="fixed top-8 right-8 z-[100]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors group"
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                            >
                                <X className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, rotate: 90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: -90 }}
                            >
                                <DashesIcon className="w-6 h-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Menu Dropdown - Floating Capsule Style */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-[90]"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // Apple-style spring
                            className="fixed top-24 right-8 z-[95] w-64 bg-black/60 backdrop-blur-xl border border-white/20 rounded-[32px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                        >
                            <div className="p-4 space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 px-6 py-4 text-white/80 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
                                    >
                                        <span className="text-white/30 group-hover:text-white/60 transition-colors text-lg tracking-tighter">
                                            —
                                        </span>
                                        <span className="font-serif italic tracking-wide text-lg">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
