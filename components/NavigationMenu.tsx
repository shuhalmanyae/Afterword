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
        { label: "The Pledge", href: "/pledge" },
        { label: "How It Works", href: "/about" },
    ];

    const buttonStyle = "group relative rounded-full bg-transparent px-8 py-4 text-sm font-light text-white border border-white/30 hover:border-white/80 transition-all duration-500 flex items-center gap-3 overflow-hidden backdrop-blur-sm w-full";

    return (
        <>
            {/* Floating Toggle Button */}
            <div className="fixed top-8 right-8 z-[100]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 bg-transparent backdrop-blur-md border border-white/30 rounded-full text-white hover:border-white/80 transition-all duration-500 group"
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
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-24 right-8 z-[95] min-w-[200px]"
                        >
                            <div className="space-y-4">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={buttonStyle}
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <span className="tracking-widest uppercase text-xs w-full text-center">{item.label}</span>
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
