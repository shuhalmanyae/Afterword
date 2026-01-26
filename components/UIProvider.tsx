"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import ReferralModal from "./ReferralModal";

interface UIContextType {
    isNavOpen: boolean;
    isLangOpen: boolean;
    isReferralModalOpen: boolean;
    toggleNav: () => void;
    toggleLang: () => void;
    openReferralModal: () => void;
    closeReferralModal: () => void;
    closeAll: () => void;
    isGlobalNavForced: boolean;
    setGlobalNavForced: (forced: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const [isGlobalNavForced, setGlobalNavForced] = useState(false);

    const toggleNav = () => {
        if (!isNavOpen) {
            // Opening Nav -> Close Lang
            setIsLangOpen(false);
        }
        setIsNavOpen((prev) => !prev);
    };

    const toggleLang = () => {
        if (!isLangOpen) {
            // Opening Lang -> Close Nav
            setIsNavOpen(false);
        }
        setIsLangOpen((prev) => !prev);
    };

    const openReferralModal = () => {
        setIsNavOpen(false); // Close nav if opened from there
        setIsReferralModalOpen(true);
    };

    const closeReferralModal = () => {
        setIsReferralModalOpen(false);
    };

    const closeAll = () => {
        setIsNavOpen(false);
        setIsLangOpen(false);
        setIsReferralModalOpen(false);
    };

    return (
        <UIContext.Provider
            value={{
                isNavOpen,
                isLangOpen,
                isReferralModalOpen,
                toggleNav,
                toggleLang,
                openReferralModal,
                closeReferralModal,
                closeAll,
                isGlobalNavForced,
                setGlobalNavForced,
            }}
        >
            {children}
            <ReferralModal isOpen={isReferralModalOpen} onClose={closeReferralModal} />
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}
