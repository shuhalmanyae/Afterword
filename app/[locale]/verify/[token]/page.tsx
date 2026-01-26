"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { useRouter } from "@/i18n/routing";
import { useUI } from "@/components/UIProvider";

// --- Constants ---
const STRICT_VERIFICATION = true; // Feature Flag

// --- Swiss Icons ---
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

const SwissSmiley = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
        <circle cx="15" cy="9" r="1" fill="currentColor" />
    </svg>
);

const SwissScan = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1">
        <path d="M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
    </svg>
);

// --- Animation Components ---
const PoppingText = ({ text, className = "" }: { text: string; className?: string }) => {
    // Split text into words
    const words = text.split(" ");
    return (
        <span className={`inline-block ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="inline-block whitespace-nowrap mr-[0.2em] overflow-hidden">
                    <motion.span
                        className="inline-block"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: i * 0.05,
                            type: "spring",
                            stiffness: 100
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
};

// --- Main Component ---
export default function VerificationPage() {
    const { setGlobalNavForced } = useUI();
    const router = useRouter();
    const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [outcome, setOutcome] = useState<"false_alarm" | "protocol" | null>(null);
    const [showExitModal, setShowExitModal] = useState(false);

    // Smiley Animation State
    const [showSmiley, setShowSmiley] = useState(false);

    // Terms Loading State
    const [isRetrievingTerms, setIsRetrievingTerms] = useState(false);

    // IDV State (Identity Bridge)
    const [showIdv, setShowIdv] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [idvFile, setIdvFile] = useState<File | null>(null);

    // Certificate Upload State (Strict Verification)
    const [isVerifyingCert, setIsVerifyingCert] = useState(false);
    const [certFile, setCertFile] = useState<File | null>(null);

    // Acknowledgment Modal State
    const [showAcknowledgment, setShowAcknowledgment] = useState(false);
    const [isConsentChecked, setIsConsentChecked] = useState(false);

    // Global Nav Control
    useEffect(() => {
        if (step === 5) {
            setGlobalNavForced(true);
        }
        return () => setGlobalNavForced(false);
    }, [step, setGlobalNavForced]);

    // Icon Switch Timer
    useEffect(() => {
        if (step === 5 && outcome === "false_alarm") {
            // Sequence: Check (default) -> Smiley (after 1.5s) -> Check (after another 1.5s)

            // 1. Show Smiley after 1.5s
            const showTimer = setTimeout(() => {
                setShowSmiley(true);
            }, 1500);

            // 2. Hide Smiley (revert to Check) after 3.0s (1.5s + 1.5s)
            const hideTimer = setTimeout(() => {
                setShowSmiley(false);
            }, 3000);

            return () => {
                clearTimeout(showTimer);
                clearTimeout(hideTimer);
            };
        } else {
            setShowSmiley(false);
        }
    }, [step, outcome]);

    // Exit Guard - Browser Close
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (step < 5) { // Only guard if not finished? User said "Your progress... will not be saved".
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [step]);

    // Handlers
    const handleLogoClick = (e: React.MouseEvent) => {
        if (step < 5) {
            e.preventDefault();
            setShowExitModal(true);
        }
        // If step 5 (done), let them leave? User implies "progress... not saved". 
        // If done, it IS saved (recorded). So maybe allowed?
        // But for consistency let's just allow home click if done.
    };

    const handleExitConfirm = () => {
        router.push("/");
    };

    // Form Inputs
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(""); // For validation

    // Mock Data
    const userName = "Alexander";
    const keyholderName = "Sarah";
    const last2Digits = "88";
    const securityQuestion = "What was the name of your first childhood pet?";
    const correctParam = "test"; // Mock correct answer

    // Helper to simulate "Thinking"
    const processAndAdvance = (nextStep: 0 | 1 | 2 | 3 | 4 | 5) => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep(nextStep);
            setError(""); // Clear errors on step change
        }, 1500); // 1.5s thinking time
    };

    // Handlers
    const handlePulseSelection = (isSafe: boolean) => {
        if (isSafe) setOutcome("false_alarm");
        processAndAdvance(isSafe ? 5 : 1);
    };

    const handleSecuritySubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simulating validation
        if (securityAnswer.toLowerCase() !== correctParam) {
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                setError("That doesn't match the answer on file. Please try again.");
            }, 800);
            return;
        }

        processAndAdvance(2);
    };

    const handleMfaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        processAndAdvance(STRICT_VERIFICATION ? 3 : 4);
    };

    // IDV Handlers
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIdvFile(file);
            setIsScanning(true);

            // Simulate Analysis and Verification
            setTimeout(() => {
                setIsScanning(false);
                processAndAdvance(STRICT_VERIFICATION ? 3 : 4); // Advance to Protocol step
            }, 3500); // 3.5s scan time
        }
    };

    // Certificate Handlers
    const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCertFile(file);
            setIsVerifyingCert(true);

            // Simulate Validation
            setTimeout(() => {
                setIsVerifyingCert(false);
                processAndAdvance(4); // Advance to Protocol
            }, 3500);
        }
    };

    const handleAuthorize = () => {
        setOutcome("protocol");
        processAndAdvance(5);
    };

    const handleTermsClick = () => {
        setIsRetrievingTerms(true);
        setTimeout(() => {
            setIsRetrievingTerms(false);
            setShowAcknowledgment(true);
        }, 800);
    };

    return (
        <main className={`w-full h-full flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000 ${step < 5 ? "bg-[#050505]" : "bg-transparent"}`}>
            {/* Logo with Exit Guard - Hide when global nav returns (Step 5) */}
            {step < 5 && (
                <>
                    <div className="absolute top-6 left-6 z-50">
                        <Logo forceShow onClick={handleLogoClick} href="/" />
                    </div>
                    <button
                        className="absolute bottom-6 right-6 z-50 flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors group"
                        onClick={() => window.location.href = "mailto:hello@afterword.ch"}
                    >
                        <span>I need help</span>
                        <div className="w-4 h-4 border border-white/40 rounded-full flex items-center justify-center group-hover:border-white transition-colors">
                            <span className="font-serif italic text-[10px]">?</span>
                        </div>
                    </button>

                    {/* Terms Loading Overlay */}
                    <AnimatePresence>
                        {isRetrievingTerms && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-6"
                            >
                                <div className="w-64 h-px bg-white/10 relative overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-white"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
                                    />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 animate-pulse">
                                    Retrieving Protocol
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            {/* Subtle Gold Pulse Background - Very faint */}
            <div className={`absolute inset-0 bg-gradient-radial from-[#d4af37]/5 via-transparent to-transparent pointer-events-none opacity-50 transition-opacity duration-1000 ${step < 5 ? "opacity-50" : "opacity-0"}`} />

            {/* Content Container */}
            <motion.div
                layout
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative z-10 min-h-[400px] flex flex-col justify-center"
            >
                <AnimatePresence mode="wait">

                    {/* LOADING STATE (The Thinking Line) */}
                    {isProcessing ? (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
                        >
                            {/* The Line */}
                            <div className="w-full h-px bg-white/10 relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-white"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                                />
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 animate-pulse">
                                Verifying
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {/* STEP 0: PULSE FILTER */}
                            {step === 0 && (
                                <motion.div
                                    key="step0"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-12"
                                >
                                    <header className="space-y-4 text-center">
                                        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight overflow-hidden">
                                            <PoppingText text="Silent Pulse" />
                                        </h1>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: 48 }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                            className="h-px bg-white/20 mx-auto"
                                        />
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.8 }}
                                            className="text-white/60 font-sans font-light text-xs md:text-sm tracking-wide leading-relaxed max-w-md mx-auto"
                                        >
                                            Hello {keyholderName}. <strong className="text-white font-semibold">{userName}</strong> has gone silent. Awaiting status confirmation.
                                        </motion.p>
                                    </header>

                                    <div className="grid gap-6">
                                        <motion.button
                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.7)", color: "#000" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handlePulseSelection(true)}
                                            className="group w-full py-6 px-8 border border-white/20 transition-all duration-300 flex items-center justify-between rounded-md"
                                        >
                                            <div className="text-left">
                                                <span className="block text-xs uppercase tracking-[0.2em] mb-1 opacity-50 group-hover:opacity-100 transition-opacity">Status</span>
                                                <span className="text-xl font-serif">False Alarm</span>
                                            </div>
                                            <SwissCheck className="w-6 h-6 opacity-30 group-hover:opacity-100 transition-opacity" />
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02, borderColor: "rgba(239,68,68,0.5)", backgroundColor: "rgba(69,10,10,0.3)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handlePulseSelection(false)}
                                            className="group w-full py-6 px-8 border border-white/20 transition-all duration-300 flex items-center justify-between rounded-md"
                                        >
                                            <div className="text-left">
                                                <span className="block text-xs uppercase tracking-[0.2em] mb-1 opacity-50 group-hover:opacity-100 group-hover:text-red-400 transition-opacity">Status</span>
                                                <span className="text-xl font-serif group-hover:text-red-200 transition-colors">Confirm Passing</span>
                                            </div>
                                            <SwissShield className="w-6 h-6 opacity-30 group-hover:opacity-100 group-hover:text-red-400 transition-all" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 1: SECURITY QUESTION (EMPATHY & SECURITY) */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-10"
                                >
                                    <header className="space-y-6 text-center">
                                        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight leading-tight">
                                            <PoppingText text="We are truly sorry for your loss." />
                                        </h1>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: 48 }}
                                            transition={{ delay: 1.5, duration: 0.5 }}
                                            className="h-px bg-white/10 mx-auto"
                                        />
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 2 }}
                                            className="text-white/60 font-light text-sm md:text-base leading-relaxed max-w-sm mx-auto"
                                        >
                                            To protect the legacy <strong className="text-white">{userName}</strong> left behind, they assigned a personal security question for you to answer.
                                        </motion.p>
                                    </header>

                                    <form onSubmit={handleSecuritySubmit} className="space-y-10 max-w-sm mx-auto w-full pt-4">
                                        <motion.div
                                            className="space-y-4"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 2.2 }}
                                        >
                                            <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2 text-center">
                                                Security Question from {userName}
                                            </label>
                                            <p className="block text-center text-lg md:text-xl font-serif text-[#d4af37] mb-6">
                                                {securityQuestion}
                                            </p>

                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={securityAnswer}
                                                    onChange={(e) => {
                                                        setSecurityAnswer(e.target.value);
                                                        if (error) setError("");
                                                    }}
                                                    placeholder="Your answer..."
                                                    className={`w-full bg-transparent border-b py-4 text-center text-lg text-white focus:outline-none transition-colors rounded-md placeholder-white/20 ${error ? "border-amber-500/50" : "border-white/20 focus:border-white"}`}
                                                    autoFocus
                                                />
                                            </div>

                                            {/* Error Message */}
                                            <AnimatePresence>
                                                {error && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="text-amber-400/80 text-xs text-center font-light mt-2"
                                                    >
                                                        {error}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        <motion.button
                                            type="submit"
                                            disabled={!securityAnswer}
                                            whileHover={{ scale: 1.05, color: "#d4af37" }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full group flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] disabled:opacity-30 transition-all font-bold"
                                        >
                                            Proceed
                                            <SwissArrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}

                            {/* STEP 2: MFA OR IDV */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-12"
                                >
                                    <AnimatePresence mode="wait">
                                        {!showIdv ? (
                                            /* DEFAULT MFA VIEW */
                                            <motion.div
                                                key="mfa"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-12"
                                            >
                                                <header className="space-y-4 text-center">
                                                    <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
                                                        <PoppingText text="Identity" />
                                                    </h1>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: 48 }}
                                                        transition={{ delay: 0.5, duration: 0.5 }}
                                                        className="h-px bg-white/20 mx-auto"
                                                    />
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.8 }}
                                                        className="text-white/60 font-sans font-light text-xs md:text-sm tracking-wide"
                                                    >
                                                        Enter the code sent to mobile device ending in ••{last2Digits}.
                                                    </motion.p>
                                                </header>

                                                <form onSubmit={handleMfaSubmit} className="space-y-12 max-w-xs mx-auto w-full">
                                                    <motion.div
                                                        className="relative"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 1 }}
                                                    >
                                                        <SwissLock className="w-6 h-6 text-white/20 absolute left-0 top-1/2 -translate-y-1/2" />
                                                        <input
                                                            type="text"
                                                            value={otp}
                                                            onChange={(e) => setOtp(e.target.value)}
                                                            placeholder="• • • • • •"
                                                            maxLength={6}
                                                            className="w-full bg-transparent border-b border-white/20 py-4 text-center text-3xl tracking-[0.5em] text-white focus:outline-none focus:border-white transition-colors rounded-md placeholder-white/10 font-mono pl-6"
                                                            autoFocus
                                                        />
                                                    </motion.div>

                                                    <div className="space-y-6">
                                                        <motion.button
                                                            type="submit"
                                                            disabled={otp.length < 6}
                                                            whileHover={{ scale: 1.05, color: "#d4af37" }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="w-full group flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] disabled:opacity-30 transition-all font-bold"
                                                        >
                                                            Verify
                                                            <SwissArrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                        </motion.button>

                                                        {/* IDV Fallback Trigger */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowIdv(true)}
                                                            className="block w-full text-center text-[10px] text-[#d4af37]/60 hover:text-[#d4af37] transition-colors uppercase tracking-widest font-sans"
                                                        >
                                                            No longer have access to this mobile number?
                                                        </button>
                                                    </div>
                                                </form>
                                            </motion.div>
                                        ) : (
                                            /* IDENTITY BRIDGE (IDV) VIEW */
                                            <motion.div
                                                key="idv"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="space-y-10"
                                            >
                                                <header className="space-y-4 text-center">
                                                    <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
                                                        Verify Identity via Document Scan
                                                    </h1>
                                                    <p className="text-white/40 font-sans font-light text-xs leading-relaxed max-w-xs mx-auto">
                                                        To protect Alexander's vault, we require a one-time automated scan of your government-issued ID to continue.
                                                    </p>
                                                </header>

                                                {/* Upload Zone */}
                                                <div className="relative max-w-sm mx-auto w-full group">
                                                    <input
                                                        type="file"
                                                        onChange={handleFileUpload}
                                                        accept="image/*,.pdf"
                                                        className="absolute inset-0 z-20 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                                        disabled={isScanning}
                                                    />

                                                    <div className={`
                                                        w-full h-48 border border-dashed rounded-lg flex flex-col items-center justify-center gap-4 transition-all duration-500 bg-white/5 overflow-hidden relative
                                                        ${isScanning ? "border-[#d4af37]/50" : "border-white/20 group-hover:border-white/40 group-hover:bg-white/10"}
                                                    `}>
                                                        {/* SCANNING LASER */}
                                                        {isScanning && (
                                                            <motion.div
                                                                className="absolute inset-x-0 h-[2px] bg-[#d4af37] shadow-[0_0_15px_#d4af37] z-10"
                                                                initial={{ top: "0%" }}
                                                                animate={{ top: "100%" }}
                                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                            />
                                                        )}

                                                        {/* Icon / File Display */}
                                                        {isScanning ? (
                                                            <div className="text-center space-y-2 relative z-0">
                                                                <SwissScan className="w-8 h-8 text-[#d4af37] mx-auto opacity-80" />
                                                                <p className="text-[#d4af37] text-xs uppercase tracking-widest animate-pulse">
                                                                    Analyzing document authenticity...
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center space-y-2 text-white/30 group-hover:text-white/60 transition-colors">
                                                                <SwissScan className="w-8 h-8 mx-auto" />
                                                                <p className="text-[10px] uppercase tracking-widest">
                                                                    Tap to Upload Passport / ID
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setShowIdv(false)}
                                                    className="w-full text-center text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest"
                                                    disabled={isScanning}
                                                >
                                                    Cancel
                                                </button>

                                                <p className="text-[9px] text-center text-white/20 italic font-serif max-w-xs mx-auto border-t border-white/5 pt-4">
                                                    Afterword uses bank-level encryption. Your document is processed securely and deleted immediately after verification.
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            {/* STEP 3: CERTIFICATE UPLOAD (Strict Verification) */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-10"
                                >
                                    <header className="space-y-4 text-center">
                                        <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
                                            Formal Authorization Required
                                        </h1>
                                        <p className="text-white/40 font-sans font-light text-xs leading-relaxed max-w-xs mx-auto">
                                            <strong className="text-white/80">{userName}</strong> has requested that an official document be provided to authorize the release of this vault.
                                        </p>
                                    </header>

                                    {/* Certificate Upload Zone */}
                                    <div className="relative max-w-sm mx-auto w-full group">
                                        <input
                                            type="file"
                                            onChange={handleCertificateUpload}
                                            accept="image/*,.pdf"
                                            className="absolute inset-0 z-20 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                            disabled={isVerifyingCert}
                                        />

                                        <div className={`
                                            w-full h-48 border border-dashed rounded-lg flex flex-col items-center justify-center gap-4 transition-all duration-500 bg-white/5 overflow-hidden relative
                                            ${isVerifyingCert ? "border-[#d4af37]/50" : "border-white/20 group-hover:border-white/40 group-hover:bg-white/10"}
                                        `}>
                                            {/* SCANNING LASER */}
                                            {isVerifyingCert && (
                                                <motion.div
                                                    className="absolute inset-x-0 h-[2px] bg-[#d4af37] shadow-[0_0_15px_#d4af37] z-10"
                                                    initial={{ top: "0%" }}
                                                    animate={{ top: "100%" }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                />
                                            )}

                                            {/* Icon / File Display */}
                                            {isVerifyingCert ? (
                                                <div className="text-center space-y-2 relative z-0">
                                                    <SwissScan className="w-8 h-8 text-[#d4af37] mx-auto opacity-80" />
                                                    <p className="text-[#d4af37] text-xs uppercase tracking-widest animate-pulse">
                                                        Validating official documentation...
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-2 text-white/30 group-hover:text-white/60 transition-colors">
                                                    <SwissScan className="w-8 h-8 mx-auto" />
                                                    <p className="text-[10px] uppercase tracking-widest">
                                                        Tap to Upload Death Certificate (Photo or PDF)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            // There is no fallback logic defined here, user must provide it.
                                            // Maybe we could allow stepping back? For now we keep it strict.
                                        }}
                                        className="w-full text-center text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest cursor-default"
                                    >

                                    </button>

                                    <p className="text-[9px] text-center text-white/20 italic font-serif max-w-xs mx-auto border-t border-white/5 pt-4">
                                        This document is for authorization purposes only. It is processed securely and deleted immediately following verification.
                                    </p>
                                </motion.div>
                            )}

                            {/* STEP 4: PROTOCOL (Was 3) */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center space-y-12"
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
                                        className="max-w-xs mx-auto"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.2 }}
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleTermsClick}
                                            className="w-full py-5 border border-white/20 transition-all duration-300 rounded-md uppercase tracking-[0.2em] text-xs font-bold"
                                        >
                                            Activate Release
                                        </motion.button>

                                    </motion.div>
                                </motion.div>
                            )}

                            {/* STEP 5: SUCCESS (Was 4) */}
                            {step === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-center space-y-8"
                                >
                                    <div className="relative w-24 h-24 mx-auto">
                                        <AnimatePresence mode="wait">
                                            {showSmiley ? (
                                                <motion.div
                                                    key="smiley"
                                                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                    className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center absolute inset-0"
                                                >
                                                    <SwissSmiley className="w-8 h-8 text-white" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="check"
                                                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                                    exit={{ scale: 0, rotate: 45, opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center absolute inset-0"
                                                >
                                                    <SwissCheck className="w-8 h-8 text-white" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <h2 className="text-3xl font-serif tracking-wide">
                                        <PoppingText text={outcome === "false_alarm" ? "The best possible outcome." : "The final dispatch is complete."} />
                                    </h2>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-white/50 text-sm max-w-lg mx-auto whitespace-pre-line leading-relaxed"
                                    >
                                        {outcome === "false_alarm"
                                            ? `We have notified ${userName} and reset the security protocols.\n\nThank you for your actions!\nAfterword Team`
                                            : `Alexander’s words are now on their way to their recipients including your own, should there be one waiting for you.\n\nPlease accept our deepest condolences during this difficult time. We thank you for your service and for honoring this pledge.\n\nThe Afterword Team`
                                        }
                                    </motion.p>
                                </motion.div>
                            )}
                        </>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ACKNOWLEDGMENT MODAL */}
            <AnimatePresence>
                {showAcknowledgment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-lg overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            {/* Header */}
                            <div className="p-6 md:p-8 border-b border-white/10 bg-[#0A0A0A] sticky top-0 z-10">
                                <h3 className="text-2xl font-serif text-white mb-2">Final Acknowledgment</h3>
                                <p className="text-white/40 text-xs uppercase tracking-widest">
                                    Please read carefully before activation
                                </p>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs md:text-sm leading-relaxed text-neutral-300 font-sans custom-scrollbar">

                                {/* Prominent Warning */}
                                <div className="p-6 border border-red-500/10 bg-gradient-to-b from-red-500/10 to-transparent rounded-xl text-center">
                                    <p className="text-red-500/80 font-bold uppercase tracking-widest text-[10px] mb-2">Warning</p>
                                    <p className="text-white font-serif text-lg tracking-wide">This delivery cannot be retracted once authorized.</p>
                                </div>

                                <p className="text-white/60">
                                    As the designated Keyholder for <strong className="text-white">{userName}</strong>, I hereby affirm and agree to the following:
                                </p>

                                {/* Clean List */}
                                <ul className="space-y-4 list-disc pl-4 marker:text-white/30">
                                    <li>
                                        <strong className="text-white">Affirmation of Status:</strong><br />
                                        I solemnly declare, under penalty of perjury, that {userName} has passed away. This request to unlock the Sovereign Vault is based on verified fact, not assumption.
                                    </li>
                                    <li>
                                        <strong className="text-white">Sole Responsibility:</strong><br />
                                        I acknowledge that Afterword acts exclusively as a technical execution service. The decision to trigger the release protocol is my sole legal and ethical responsibility.
                                    </li>
                                    <li>
                                        <strong className="text-white">Indemnification:</strong><br />
                                        I agree to indemnify, defend, and hold harmless Afterword and its providers from any legal claims arising from the release of data based on my authorization.
                                    </li>
                                    <li>
                                        <strong className="text-white">Penalties for Fraud:</strong><br />
                                        I understand that any attempt to access private data through false or misleading claims is a criminal offense punishable under Swiss and International laws.
                                    </li>
                                </ul>

                            </div>

                            {/* Footer / Actions */}
                            <div className="p-6 md:p-8 border-t border-white/10 bg-[#0A0A0A] space-y-8">
                                {/* Consent Checkbox */}
                                <label className="flex items-start gap-4 cursor-pointer group p-4 border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="relative pt-1">
                                        <input
                                            type="checkbox"
                                            checked={isConsentChecked}
                                            onChange={(e) => setIsConsentChecked(e.target.checked)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 border border-white/30 rounded bg-transparent peer-checked:bg-white peer-checked:border-white transition-all" />
                                        <SwissCheck className="w-3 h-3 text-black absolute top-2 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-xs md:text-sm text-white/70 group-hover:text-white transition-colors">
                                        I accept the Terms of Service and assume full legal responsibility for this action.
                                    </span>
                                </label>

                                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                                    <button
                                        onClick={() => setShowAcknowledgment(false)}
                                        className="w-full md:w-auto px-8 py-4 border border-white/10 text-white/40 font-bold uppercase tracking-widest text-[10px] md:text-xs hover:text-white hover:border-white/30 transition-all rounded-full hover:bg-white/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAcknowledgment(false);
                                            handleAuthorize();
                                        }}
                                        disabled={!isConsentChecked}
                                        className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] md:text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    >
                                        Execute Sovereign Protocol
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EXIT MODAL */}
            <AnimatePresence>
                {showExitModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            className="w-full max-w-md bg-[#0A0A0A] border border-white/10 p-8 rounded-lg text-center space-y-8"
                        >
                            <div className="space-y-2">
                                <h3 className="text-xl font-serif text-white">Are you sure you want to leave?</h3>
                                <p className="text-white/50 text-sm">
                                    Your progress in this verification session will not be saved.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setShowExitModal(false)}
                                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-colors rounded"
                                >
                                    Continue Verification
                                </button>
                                <button
                                    onClick={handleExitConfirm}
                                    className="w-full py-4 border border-white/20 text-white/50 font-bold uppercase tracking-widest text-xs hover:text-white hover:border-white transition-all rounded"
                                >
                                    Exit Portal
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
