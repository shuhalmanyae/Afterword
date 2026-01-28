"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RightPanelProps {
    flipped: boolean; // false = Media (Front), true = Connections (Back)
    front: ReactNode;
    back: ReactNode;
}

export default function RightPanel({ flipped, front, back }: RightPanelProps) {
    return (
        <div className="w-full h-full relative perspective-[1000px]">
            <motion.div
                className="w-full h-full relative"
                initial={false}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1] }} // smooth cubic-bezier
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Face (Media Panel) */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {front}
                </div>

                {/* Back Face (Connection Details) */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    {back}
                </div>
            </motion.div>
        </div>
    );
}
