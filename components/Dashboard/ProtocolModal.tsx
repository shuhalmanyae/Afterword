"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import PoppingText from "@/components/PoppingText";

// --- Swiss Icons (Inline for exact match) ---
const SwissShield = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
        <path d="M12 2L3 7V12C3 17 7 20 12 22C17 20 21 17 21 12V7L12 2Z" />
        <path d="M12 22V2" />
    </svg>
);

const SwissCheck = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12L11 14L15 10" />
    </svg>
);

const SwissLock = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
        <rect x="5" y="11" width="14" height="10" />
        <path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" />
    </svg>
);

const SwissArrow = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
        <path d="M5 12H19" />
        <path d="M12 5L19 12L12 19" />
    </svg>
);

interface ProtocolModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProtocolModal({ isOpen, onClose }: ProtocolModalProps) {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Inputs
    const [frequency, setFrequency] = useState("Monthly");
    const [keyholderName, setKeyholderName] = useState("");
    const [keyholderEmail, setKeyholderEmail] = useState("");
    const [isStrict, setIsStrict] = useState(true);

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleActivate = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep(5); // Success state
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md"
            />

            {/* Modal Container - Matches Verification Page aesthetic */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg min-h-[500px] flex flex-col justify-center items-center overflow-hidden z-10"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 p-4 text-white/20 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="w-full relative px-8 py-12">
                    <AnimatePresence mode="wait">

                        {/* Step 1: Frequency (The Heartbeat) */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-12 text-center"
                            >
                                <header className="space-y-4">
                                    <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
                                        <PoppingText text="The Heartbeat" />
                                    </h1>
                                    <div className="h-px bg-white/20 w-12 mx-auto" />
                                    <p className="text-white/60 font-sans font-light text-xs tracking-wide leading-relaxed max-w-xs mx-auto">
                                        How often should we check for a pulse? If you fail to respond, the protocol initiates.
                                    </p>
                                </header>

                                <div className="grid grid-cols-3 gap-4">
                                    {["Weekly", "Monthly", "Yearly"].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => setFrequency(opt)}
                                            className={`
                                                py-4 rounded-lg border transition-all duration-300 text-sm font-medium
                                                ${frequency === opt
                                                    ? "bg-white text-black border-white"
                                                    : "bg-transparent border-white/20 text-white/60 hover:border-white/50 hover:text-white"
                                                }
                                            `}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Keyholder (The Contact) */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-12 text-center"
                            >
                                <header className="space-y-4">
                                    <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
                                        <PoppingText text="The Keyholder" />
                                    </h1>
                                    <div className="h-px bg-white/20 w-12 mx-auto" />
                                    <p className="text-white/60 font-sans font-light text-xs tracking-wide leading-relaxed max-w-xs mx-auto">
                                        Who do we contact if you go silent?
                                    </p>
                                </header>

                                <div className="space-y-6 max-w-xs mx-auto">
                                    <div className="relative group">
                                        <SwissShield className="w-5 h-5 text-white/20 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white/60 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={keyholderName}
                                            onChange={(e) => setKeyholderName(e.target.value)}
                                            className="w-full bg-transparent border-b border-white/20 py-3 pl-10 text-white focus:outline-none focus:border-white transition-colors placeholder-white/20 text-center font-serif"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <SwissLock className="w-5 h-5 text-white/20 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white/60 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={keyholderEmail}
                                            onChange={(e) => setKeyholderEmail(e.target.value)}
                                            className="w-full bg-transparent border-b border-white/20 py-3 pl-10 text-white focus:outline-none focus:border-white transition-colors placeholder-white/20 text-center font-sans tracking-wider"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Verify (Strictness) */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-12 text-center"
                            >
                                <header className="space-y-4">
                                    <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
                                        <PoppingText text="Verification" />
                                    </h1>
                                    <div className="h-px bg-white/20 w-12 mx-auto" />
                                    <p className="text-white/60 font-sans font-light text-xs tracking-wide leading-relaxed max-w-xs mx-auto">
                                        Choose the rigorousness of the release process.
                                    </p>
                                </header>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setIsStrict(false)}
                                        className={`w-full p-4 border rounded-lg text-left transition-all ${!isStrict ? "bg-white/10 border-[#d4af37] text-white" : "border-white/10 text-white/50 hover:border-white/30"}`}
                                    >
                                        <div className="font-serif text-lg mb-1">Standard Trust</div>
                                        <div className="text-[10px] uppercase tracking-wider opacity-60">Release after 48h silence</div>
                                    </button>
                                    <button
                                        onClick={() => setIsStrict(true)}
                                        className={`w-full p-4 border rounded-lg text-left transition-all ${isStrict ? "bg-white/10 border-[#d4af37] text-white" : "border-white/10 text-white/50 hover:border-white/30"}`}
                                    >
                                        <div className="font-serif text-lg mb-1">Strict Certification</div>
                                        <div className="text-[10px] uppercase tracking-wider opacity-60">Requires Death Certificate</div>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: PROTOCOL (The Red Line Step) */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-12 text-center"
                            >
                                <header className="space-y-4">
                                    <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
                                        <PoppingText text="Protocol" />
                                    </h1>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: 48 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="h-px bg-red-500/50 mx-auto"
                                    />
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="text-red-200/60 font-serif italic text-lg max-w-md mx-auto"
                                    >
                                        "Once sent, these messages cannot be recalled."
                                    </motion.p>
                                </header>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 }}
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleActivate}
                                        className="w-full py-5 border border-white/20 transition-all duration-300 rounded-md uppercase tracking-[0.2em] text-xs font-bold"
                                    >
                                        Activate Release
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Step 5: Success */}
                        {step === 5 && (
                            <div className="text-center animate-in fade-in zoom-in duration-500 py-8">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                                    <SwissCheck className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h3 className="text-3xl font-light text-white mb-2">Protocol Armed.</h3>
                                <p className="text-white/50 max-w-md mx-auto text-sm mb-8">
                                    Your vault is secure. We are active and monitoring.
                                </p>
                                <button onClick={onClose} className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-colors">
                                    Return to Study
                                </button>
                            </div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Footer Controls (Hidden on Step 4/5) */}
                {step < 4 && (
                    <div className="w-full p-6 border-t border-white/5 flex justify-between items-center bg-transparent">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className="text-white/30 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest transition-colors disabled:opacity-0"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={nextStep}
                            className="text-white flex items-center gap-2 text-xs uppercase tracking-widest hover:text-[#d4af37] transition-colors"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
