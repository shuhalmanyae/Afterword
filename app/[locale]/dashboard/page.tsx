"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MessageComposer from "@/components/Dashboard/MessageComposer";
import ProtocolModal from "@/components/Dashboard/ProtocolModal"; // Keep for "Secure" action
import ConstellationCanvas from "@/components/ConstellationCanvas";
import ConstellationSidebar from "@/components/ConstellationSidebar";
import ConnectionCard from "@/components/ConnectionCard";
import RightPanel from "@/components/Dashboard/RightPanel";
import MediaPanel from "@/components/Dashboard/MediaPanel";

// Mock Data Type mapping
interface Node {
    id: string;
    text: string;
    // Sidebar doesn't need x/y/size strictly if we don't render them on canvas, 
    // but TS might complain if we reuse the exact type. 
    // ConstellationSidebar expects Node { id, text }.
}

export default function Dashboard() {
    // View State
    const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
    const [isProtocolOpen, setIsProtocolOpen] = useState(false);
    // const [isConnectionCardOpen, setIsConnectionCardOpen] = useState(false); // No longer needed as explicit state if we use flip
    const [isRightPanelFlipped, setIsRightPanelFlipped] = useState(false);
    const [sendingStep, setSendingStep] = useState<'idle' | 'collapsing' | 'flying'>('idle');
    const [showValidationErrors, setShowValidationErrors] = useState(false);
    const [capturedMedia, setCapturedMedia] = useState<{ type: 'audio' | 'video', blob: Blob, name: string } | null>(null);
    const [livingRecords, setLivingRecords] = useState<{ id: string; file: File; name: string }[]>([]);

    // Data State
    const [beneficiaries, setBeneficiaries] = useState<any[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('constellation_nodes');
        if (saved) {
            try {
                const nodes = JSON.parse(saved);
                // Ensure nodes have email/phone fields even if loaded from old data
                const mapped = nodes.map((n: any) => ({
                    id: n.id,
                    name: n.text,
                    email: n.email || "",
                    phone: n.phone || ""
                }));
                setBeneficiaries(mapped);
            } catch (e) {
                console.error("Failed to parse saved nodes", e);
                setBeneficiaries([
                    { id: "1", name: "The Love of my Life", email: "", phone: "" },
                    { id: "2", name: "My Firstborn Son", email: "", phone: "" },
                    { id: "3", name: "A Partner in Journey", email: "", phone: "" }
                ]);
            }
        } else {
            // Fallback Mock with empty contacts
            setBeneficiaries([
                { id: "1", name: "The Love of my Life", email: "", phone: "" },
                { id: "2", name: "My Firstborn Son", email: "", phone: "" },
                { id: "3", name: "A Partner in Journey", email: "", phone: "" }
            ]);
        }
    }, []);

    // Map beneficiaries to Nodes for Sidebar
    const nodes = beneficiaries.map(b => ({ id: b.id, text: b.name }));

    // Handlers
    const handleSelectRecipient = (id: string) => {
        setSelectedRecipientId(id);
        setShowValidationErrors(false);
        setIsRightPanelFlipped(false);
        setCapturedMedia(null); // Reset media
    };

    const handleCloseComposer = () => {
        setSelectedRecipientId(null);
    };

    const handleSaveMessage = (subject: string, body: string) => {
        console.log("Saved for", selectedRecipientId, subject);
    };

    const handleFinalizeMessage = (contactOverride?: { email: string; phone: string }) => {
        const recipient = beneficiaries.find(b => b.id === selectedRecipientId);

        // Flip to back (Connection Details) for verification/confirmation
        if (!isRightPanelFlipped) {
            setIsRightPanelFlipped(true);
            return;
        }

        const email = contactOverride?.email || recipient?.email;
        const phone = contactOverride?.phone || recipient?.phone;

        // If flipped and validated, proceed
        // Mandatory Contact Verification
        if (!email || !phone) {
            setShowValidationErrors(true);
            return;
        }

        // Orchestrate Cinematic Exit
        setSendingStep('collapsing');

        // Log final payload
        console.log("Sending Message:", {
            recipientId: selectedRecipientId,
            email,
            phone,
            media: capturedMedia
        });

        // 1. Allow Writer to fold (0.6s)
        setTimeout(() => {
            setSendingStep('flying');

            // 2. Flight & Impact (1.2s)
            setTimeout(() => {
                setSelectedRecipientId(null);
                setSendingStep('idle');
                setCapturedMedia(null);
            }, 1200);
        }, 600);
    };

    const handleSaveConnection = (id: string, email: string, phone: string) => {
        // Update local state
        const updated = beneficiaries.map(b =>
            b.id === id ? { ...b, email, phone } : b
        );
        setBeneficiaries(updated);

        // After saving connection details, maybe flip back? Or just stay there?
        // User likely wants to click "Confirm" -> Which was the "Confirm" in ConnectionCard.
        // Wait, ConnectionCard's "Confirm" (previously Save) should TRIGGER the send?
        // Or just save data?

        // "Confirm" in ConnectionCard calls onSave. 
        // If we want that button to ACTUALLY send, we can check validation here and if good, proceed.
        // BUT, better UX: ConnectionCard saves data. Then they click "Confirm" (Send) again?
        // Actually, the request says: "click save message, then this same structure does a flip and the connection details appear... confirms message".
        // So ConnectionCard needs a "Send" action or we repurpose "Save" as "Confirm & Send"?

        // Let's assume onSave in ConnectionCard is "Confirm Details".
        // If valid, maybe we proceed to send flow?
        if (email && phone) {
            // Logic to proceed to flight?
            // For now, let's just save data.
        }
    };

    const selectedRecipient = beneficiaries.find(b => b.id === selectedRecipientId);

    return (
        <main className="fixed inset-0 bg-black text-white overflow-hidden font-sans selection:bg-[#D4AF37]/30">

            {/* 1. Background: The Constellation (Ambient) */}
            <div className="absolute inset-0 z-0">
                <ConstellationCanvas nodes={[]} onNodeClick={() => { }} />
            </div>

            {/* 2. Navigation: The Sidebar (Your Circle) */}
            <ConstellationSidebar
                nodes={nodes}
                onSelect={handleSelectRecipient}
                onDelete={() => { }}
                animatingNodeId={sendingStep === 'flying' ? selectedRecipientId : null}
            />

            {/* 3. Main Content Area - Offset by Sidebar */}
            {/* Reduced left padding to pull writer closer to sidebar (previously pl-80) */}
            <div className="relative z-10 h-full w-full pl-0 md:pl-72 transition-all duration-500 perspective-[2000px]">
                <AnimatePresence mode="wait">

                    {/* MODE A: IDLE / SELECTION View */}
                    {!selectedRecipientId ? (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.5 }}
                            className="h-full flex flex-col items-center justify-center pointer-events-none p-8"
                        >
                            <h1 className="text-2xl md:text-3xl font-serif font-thin text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] mb-8 text-center max-w-2xl leading-relaxed">
                                Who deserves the final truth?
                            </h1>
                            <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-light animate-pulse">
                                Select a soul from your circle
                            </p>
                        </motion.div>
                    ) : (
                        /* MODE B: WRITER / WORKING SPACE */
                        <motion.div
                            key="writer"
                            initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
                            animate={
                                sendingStep === 'collapsing' || sendingStep === 'flying'
                                    ? {
                                        opacity: 0,
                                        scale: 0.1,
                                        x: -200, // Move towards sidebar/center
                                        y: 0,
                                        rotateY: 90, // Full fold
                                        rotate: -15,
                                        filter: "blur(10px)",
                                        transition: { duration: 0.6, ease: "backIn" }
                                    }
                                    : {
                                        opacity: 1,
                                        scale: 1,
                                        x: 0,
                                        y: 0,
                                        rotateY: 0,
                                        rotate: 0,
                                        filter: "blur(0px)",
                                        transition: { duration: 0.6, ease: "easeOut" }
                                    }
                            }
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.3 } }}
                            className="h-full flex flex-col p-6 md:p-12 pt-24 md:pt-12"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <motion.h2
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xl md:text-2xl font-serif text-white"
                                >
                                    For <span className="text-[#D4AF37] italic">{selectedRecipient?.name}</span>
                                </motion.h2>

                                {/* Close / Deselect */}
                                {/* Distinguished CTA - Everything is said */}
                                <button
                                    onClick={handleCloseComposer}
                                    className="group relative px-6 py-2 bg-transparent overflow-hidden"
                                >
                                    <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-white/50 transition-colors duration-500" />
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-500 blur-md" />
                                    <span className="relative z-10 flex items-center gap-2 text-[10px] md:text-xs font-serif italic text-white/60 group-hover:text-white transition-colors duration-500">
                                        Everything is said
                                        <div className="w-1 h-1 bg-[#D4AF37] rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </span>
                                </button>
                            </div>

                            <div className="flex-1 min-h-0 w-full flex gap-6">
                                <div className="flex-1 min-w-0 h-full">
                                    <MessageComposer
                                        recipientName={selectedRecipient?.name}
                                        initialSubject=""
                                        initialBody=""
                                        onSave={handleSaveMessage}
                                        onConfirm={handleFinalizeMessage}
                                        onSecure={() => setIsProtocolOpen(true)}
                                    />
                                </div>
                                {/* Persistent Contact Panel (Flippable) */}
                                {selectedRecipient && (
                                    <div className="hidden md:block w-80 lg:w-96 shrink-0 h-full">
                                        <RightPanel
                                            flipped={isRightPanelFlipped}
                                            front={
                                                <MediaPanel
                                                    onAudioCapture={(blob, name) => setCapturedMedia({ type: 'audio', blob, name })}
                                                    onVideoCapture={(blob, name) => setCapturedMedia({ type: 'video', blob, name })}
                                                    onAttachmentsUpdate={(files) => setLivingRecords(files)}
                                                />
                                            }
                                            back={
                                                <ConnectionCard
                                                    variant="embedded"
                                                    node={{
                                                        id: selectedRecipient.id,
                                                        text: selectedRecipient.name || "",
                                                        email: selectedRecipient.email,
                                                        phone: selectedRecipient.phone
                                                    }}
                                                    onClose={() => { }}
                                                    onDelete={() => { }}
                                                    onSave={(id, e, p) => {
                                                        handleSaveConnection(id, e, p);
                                                        // Auto-trigger send with new data
                                                        if (e && p) {
                                                            handleFinalizeMessage({ email: e, phone: p });
                                                        }
                                                    }}
                                                    showValidationErrors={showValidationErrors}
                                                />
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Special Effects Layer: Flying Messenger */}
            <AnimatePresence>
                {sendingStep === 'flying' && (
                    <motion.div
                        initial={{ opacity: 0, left: "50%", top: "50%", x: "-50%", y: "-50%" }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            left: ["50%", "10%"], // Fly towards sidebar
                            scale: [1, 1, 0.5, 0],
                        }}
                        transition={{ duration: 1.2, times: [0, 0.1, 0.8, 1], ease: "easeInOut" }}
                        className="fixed z-50 pointer-events-none"
                    >
                        {/* The Flying Line */}
                        <motion.div
                            initial={{ width: 150, height: 2, background: "white" }}
                            animate={{ width: 40 }}
                            transition={{ duration: 1.2 }}
                            className="shadow-[0_0_20px_white] rounded-full"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            <AnimatePresence>
                {isProtocolOpen && (
                    <ProtocolModal isOpen={isProtocolOpen} onClose={() => setIsProtocolOpen(false)} />
                )}
            </AnimatePresence>

        </main>
    );
}
