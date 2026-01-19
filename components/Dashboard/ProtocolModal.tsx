"use client";

import { useState } from "react";
import { X, Heart, Shield, FileText, CreditCard, ChevronRight, ChevronLeft, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ProtocolModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProtocolModal({ isOpen, onClose }: ProtocolModalProps) {
    const [step, setStep] = useState(1);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success'>('idle');

    const steps = [
        { id: 1, title: "Timing", icon: Heart },
        { id: 2, title: "Contact", icon: Shield },
        { id: 3, title: "Verify", icon: FileText },
        { id: 4, title: "Confirm", icon: CheckCircle },
        { id: 5, title: "Payment", icon: CreditCard },
    ];

    const nextStep = () => setStep(s => Math.min(s + 1, 5));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handlePayment = () => {
        // Simulate Stripe
        setTimeout(() => {
            setPaymentStatus('success');
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            {step === 1 && <Heart className="w-4 h-4 text-rose-500" />}
                            {step === 2 && <Shield className="w-4 h-4 text-emerald-500" />}
                            {step === 3 && <FileText className="w-4 h-4 text-amber-500" />}
                            {step === 4 && <CheckCircle className="w-4 h-4 text-blue-500" />}
                            {step === 5 && <CreditCard className="w-4 h-4 text-indigo-500" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-white">Protocol Configuration</h2>
                            <div className="flex gap-1 mt-1">
                                {steps.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`h-1 rounded-full transition-all duration-300 ${s.id <= step ? 'w-6 bg-white' : 'w-2 bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 flex-1 overflow-y-auto">
                    {/* Step 1: Timing */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-light text-white">How often should we check for a heartbeat?</h3>
                            <p className="text-white/50 text-sm">If you fail to respond to a heartbeat check, the strict verification protocol will initiate.</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                <button className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-left group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10">
                                        <Calendar className="w-5 h-5 text-white/70" />
                                    </div>
                                    <span className="block text-white font-medium mb-1">Weekly</span>
                                    <span className="text-xs text-white/40">Every Sunday</span>
                                </button>
                                <button className="p-6 rounded-xl border border-white/30 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all text-left relative overflow-hidden">
                                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="block text-white font-medium mb-1">Monthly</span>
                                    <span className="text-xs text-white/60">Recommended</span>
                                </button>
                                <button className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-left group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10">
                                        <Calendar className="w-5 h-5 text-white/70" />
                                    </div>
                                    <span className="block text-white font-medium mb-1">Yearly</span>
                                    <span className="text-xs text-white/40">Select Date</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Contact */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-light text-white">Who do we contact if you go silent?</h3>
                            <p className="text-white/50 text-sm">We will reach out to this person only after you miss a scheduled heartbeat check.</p>

                            <div className="space-y-4 max-w-md mt-8">
                                <div>
                                    <label className="block text-xs uppercase text-white/40 tracking-wider mb-2">Full Name</label>
                                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30" placeholder="e.g. Sarah Jenkins" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-white/40 tracking-wider mb-2">Email Address</label>
                                    <input type="email" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30" placeholder="sarah@example.com" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Verification */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-light text-white">Verification Strictness Level</h3>
                            <p className="text-white/50 text-sm">How rigorous should our confirmation process be before releasing the vault?</p>

                            <div className="space-y-4 mt-8">
                                <label className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-all">
                                    <input type="radio" name="strictness" className="mt-1" />
                                    <div>
                                        <span className="block text-white font-medium mb-1">Standard Trust Protocol</span>
                                        <p className="text-sm text-white/50 leading-relaxed">Release vault if Keyholder confirms + You remain silent for 48 hours after confirmation request.</p>
                                    </div>
                                </label>
                                <label className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-all">
                                    <input type="radio" name="strictness" className="mt-1" defaultChecked />
                                    <div>
                                        <span className="block text-white font-medium mb-1">Strict Documentation</span>
                                        <p className="text-sm text-white/50 leading-relaxed">Keyholder MUST upload a valid Death Certificate. Review process takes 24h. You have 7 days to override.</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-light text-white">Confirm Protocol Details</h3>
                            <p className="text-white/50 text-sm">Please review your settings before we seal your envelope.</p>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8 space-y-4">
                                <div className="flex justify-between border-b border-white/5 pb-4">
                                    <span className="text-white/50 uppercase text-xs tracking-wider">Heartbeat</span>
                                    <span className="text-white font-medium">Monthly</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-4">
                                    <span className="text-white/50 uppercase text-xs tracking-wider">Keyholder</span>
                                    <span className="text-white font-medium">Sarah Jenkins</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/50 uppercase text-xs tracking-wider">Verification</span>
                                    <span className="text-white font-medium">Strict (Death Cert)</span>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
                                <p className="text-sm text-blue-300">
                                    Upon confirmation, we will generate your unique encryption keys. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Payment */}
                    {step === 5 && (
                        <div className="space-y-6 text-center py-8">
                            {paymentStatus === 'idle' ? (
                                <>
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                                        <CreditCard className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-light text-white">Finalize & Seal</h3>
                                    <p className="text-white/50 max-w-md mx-auto">
                                        Secure your legacy for just $9.99/year.
                                    </p>

                                    <button
                                        onClick={handlePayment}
                                        className="mt-8 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-neutral-200 transition-colors w-full max-w-sm mx-auto shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                                    >
                                        <Shield className="w-4 h-4" />
                                        Lock your secret forever
                                    </button>
                                    <button onClick={onClose} className="block mx-auto mt-4 text-sm text-white/30 hover:text-white transition-colors">
                                        Cancel & Save Draft
                                    </button>
                                </>
                            ) : (
                                <div className="text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                                        <CheckCircle className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <h3 className="text-3xl font-light text-white">Legacy Secured.</h3>
                                    <p className="text-white/50 max-w-md mx-auto mt-2">
                                        We have sent a confirmation email to you. Your vault is now active and monitoring.
                                    </p>
                                    <button onClick={onClose} className="mt-8 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors">
                                        Return to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {paymentStatus === 'idle' && (
                    <div className="p-6 border-t border-white/5 bg-black/40 flex justify-between items-center">
                        {step > 1 ? (
                            <button onClick={prevStep} className="text-white/50 hover:text-white flex items-center gap-2 text-sm transition-colors">
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>
                        ) : <div></div>}

                        {step < 5 && (
                            <button onClick={nextStep} className="text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2">
                                {step === 4 ? "Confirm & Proceed" : "Next Step"} <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
