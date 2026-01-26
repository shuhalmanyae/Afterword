"use client";

import { motion } from "framer-motion";
import { usePathname } from "@/i18n/routing";
import { useUI } from "@/components/UIProvider";

export default function BackgroundVideo() {
    const pathname = usePathname();
    const { isGlobalNavForced } = useUI();

    if (pathname && pathname.includes("/verify") && !isGlobalNavForced) return null;

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-50 bg-black">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-50"
            >
                <source src="/videos/background.mp4" type="video/mp4" />
            </video>

            {/* Global Overlay Gradient - ensures clear text reading everywhere */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0" />

            {/* Optional: Global grain or texture could go here */}
        </div>
    );
}
