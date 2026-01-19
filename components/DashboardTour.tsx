"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";

export default function DashboardTour() {
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const hasSeen = localStorage.getItem("hasSeenTour_v1");
        if (!hasSeen) {
            // Short delay to let animations settle
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleNext = () => {
        setStep((prev) => prev + 1);
    };

    const handleFinish = () => {
        setIsVisible(false);
        localStorage.setItem("hasSeenTour_v1", "true");
    };

    const handleSkip = () => {
        setIsVisible(false);
        localStorage.setItem("hasSeenTour_v1", "true");
    };

    if (!isVisible) return null;

    // Step Configurations
    const steps = [
        {
            // Step 1: The Editor (Center)
            id: 0,
            position: "top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2", // Approx center of editor area
            tooltipPosition: "top-12 left-0 -translate-x-1/2", // Below beacon
            text: "Write your story.",
            subtext: "Draft your letters, record voice notes, or attach videos here.",
            action: "Next",
            beaconColor: "bg-white",
        },
        {
            // Step 2: The Recipients (Sidebar)
            id: 1,
            position: "top-32 left-[9%] -translate-x-1/2", // Center of 18% sidebar
            tooltipPosition: "top-0 left-12", // Right of beacon
            text: "Assign the Heirs.",
            subtext: "Choose exactly who receives this specific entry.",
            action: "Next",
            beaconColor: "bg-white",
        },
        {
            // Step 3: The Protocol (CTA)
            id: 2,
            position: "bottom-12 right-12", // Near the FAB
            tooltipPosition: "bottom-16 right-0", // Above/Left of beacon
            text: "Seal the Vault.",
            subtext: "When you are ready, lock everything behind the Swiss Protocol.",
            action: "Finish",
            beaconColor: "bg-red-500", // Special color for Protocol
        },
    ];

    const currentStep = steps[step];

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Dimmed Background */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-[60] pointer-events-none" // pointer-events-none to allow clicking through? No, we want to block interaction usually. But user asked for "focus attention". Let's block to force tour interaction.
                        // Actually, if we block pointer events, we can't click the "real" buttons. 
                        // But the tour has its own Next buttons.
                        style={{ pointerEvents: 'auto' }}
                    />

                    {/* Step Container */}
                    <div className="fixed inset-0 z-[70] pointer-events-none">
                        {/* Render current step elements */}
                        <div className={`absolute ${currentStep.position} pointer-events-auto`}>

                            {/* Pulse Beacon */}
                            <div className="relative">
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className={`absolute inset-0 rounded-full ${currentStep.beaconColor} blur-md`}
                                />
                                <div className={`relative w-4 h-4 rounded-full ${currentStep.beaconColor} shadow-[0_0_10px_rgba(255,255,255,0.5)] border border-white/20`} />
                            </div>

                            {/* Tooltip */}
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={`absolute ${currentStep.tooltipPosition} w-80 p-5 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl mt-4`}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-white font-serif text-lg">{currentStep.text}</h4>
                                    <button
                                        onClick={handleSkip}
                                        className="text-white/20 hover:text-white transition-colors text-xs uppercase tracking-wider"
                                    >
                                        Skip
                                    </button>
                                </div>

                                {/* Body */}
                                <p className="text-white/60 text-sm font-light mb-6 leading-relaxed">
                                    {currentStep.subtext}
                                </p>

                                {/* Footer / Actions */}
                                <div className="flex justify-between items-center">
                                    {/* Step Indicator */}
                                    <div className="flex gap-1">
                                        {steps.map((s) => (
                                            <div
                                                key={s.id}
                                                className={`h-1 rounded-full transition-all duration-300 ${s.id === step ? "w-6 bg-white" : "w-1 bg-white/20"}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={step === steps.length - 1 ? handleFinish : handleNext}
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                                    >
                                        {currentStep.action}
                                        {step === steps.length - 1 ? <Check className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
