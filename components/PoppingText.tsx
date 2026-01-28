"use client";

import { motion } from "framer-motion";

export const PoppingText = ({ text, className = "" }: { text: string; className?: string }) => {
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

export default PoppingText;
