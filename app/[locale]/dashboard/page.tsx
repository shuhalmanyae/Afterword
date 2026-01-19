"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BeneficiariesColumn from "@/components/Dashboard/BeneficiariesColumn";
import MessageComposer from "@/components/Dashboard/MessageComposer";
import SecurityColumn from "@/components/Dashboard/SecurityColumn";
import ProtocolModal from "@/components/Dashboard/ProtocolModal";
import RecipientModal from "@/components/Dashboard/RecipientModal";
import AddContactModal from "@/components/Dashboard/AddContactModal";

export default function Dashboard() {
    const [isProtocolOpen, setIsProtocolOpen] = useState(false);
    const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
    // Removed isAddContactOpen since we just add a new draft directly

    // State: Entries (Drafts)
    // We track IDs. The display name is derived from the draft subject.
    const [entryIds, setEntryIds] = useState<string[]>(["1"]);

    // Drafts: Keyed by Entry ID -> { subject, body }
    const [drafts, setDrafts] = useState<Record<string, { subject: string; body: string }>>({
        "1": { subject: "", body: "" }
    });

    const [activeEntryId, setActiveEntryId] = useState<string>("1");

    const activeDraft = drafts[activeEntryId] || { subject: "", body: "" };

    const handleSelectEntry = (id: string) => {
        setActiveEntryId(id);
    };

    const handleAddEntry = () => {
        const newId = Date.now().toString();
        setEntryIds([...entryIds, newId]);
        setDrafts({ ...drafts, [newId]: { subject: "", body: "" } });
        setActiveEntryId(newId);
    };

    const handleDeleteEntry = (id: string) => {
        const newEntryIds = entryIds.filter((eid) => eid !== id);

        // If we deleted the last one, create a new fresh one
        if (newEntryIds.length === 0) {
            const newId = Date.now().toString();
            setEntryIds([newId]);
            setDrafts({ [newId]: { subject: "", body: "" } });
            setActiveEntryId(newId);
            return;
        }

        setEntryIds(newEntryIds);

        // Remove draft data to clean up
        const { [id]: deleted, ...remainingDrafts } = drafts;
        setDrafts(remainingDrafts);

        // If we deleted the active one, switch to the first available
        if (id === activeEntryId) {
            setActiveEntryId(newEntryIds[0]);
        }
    };

    const handleSaveDraft = (subject: string, body: string) => {
        setDrafts(prev => ({
            ...prev,
            [activeEntryId]: { subject, body }
        }));
    };

    // Derived list for the sidebar
    const sidebarList = entryIds.map(id => ({
        id,
        name: drafts[id]?.subject || "Start writing your message",
        email: "" // Not used anymore
    }));

    return (
        <main className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden relative">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
            >
                <source src="/videos/background.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0" />

            <div className="relative z-10 flex flex-col md:flex-row w-full h-full pt-6">
                {/* Column 1: Inner Circle (18%) */}
                <aside className="hidden md:block w-[18%] min-w-[220px] max-w-[280px] h-full border-r border-white/10">
                    <BeneficiariesColumn
                        beneficiaries={sidebarList}
                        activeId={activeEntryId}
                        onSelect={handleSelectEntry}
                        onAdd={handleAddEntry}
                        onDelete={handleDeleteEntry}
                    />
                </aside>

                {/* Column 2: Message Composer (Expanded to fill) */}
                <section className="flex-1 h-full overflow-hidden relative">
                    <MessageComposer
                        key={activeEntryId}
                        initialSubject={activeDraft.subject}
                        initialBody={activeDraft.body}
                        onSave={handleSaveDraft}
                        onSecure={() => setIsRecipientModalOpen(true)}
                    />
                </section>
            </div>

            {/* Floating Action: Activate Protocol (Bottom Right) */}
            <div className="absolute bottom-6 right-6 z-50">
                <SecurityColumn onSubmitAll={() => setIsProtocolOpen(true)} />
            </div>

            {/* Mobile Fallback (Simplified) */}
            <div className="md:hidden relative z-10 p-4 text-center text-white/50 w-full flex-1 h-full">
                <p className="mb-4 text-xs">Please view on a larger screen for the full specialized vault experience.</p>
                <MessageComposer
                    onSecure={() => setIsRecipientModalOpen(true)}
                    onSave={() => { }}
                />
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isProtocolOpen && (
                    <ProtocolModal isOpen={isProtocolOpen} onClose={() => setIsProtocolOpen(false)} />
                )}
                {isRecipientModalOpen && (
                    <RecipientModal isOpen={isRecipientModalOpen} onClose={() => setIsRecipientModalOpen(false)} />
                )}
            </AnimatePresence>
        </main>
    );
}
