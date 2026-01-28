"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface Node {
    id: string;
    text: string;
    x: number;
    y: number;
    size: number;
    delay: number;
}

interface ConstellationCanvasProps {
    nodes: Node[];
    onNodeClick: (id: string) => void;
}

export default function ConstellationCanvas({ nodes, onNodeClick }: ConstellationCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });

    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                w: containerRef.current.clientWidth,
                h: containerRef.current.clientHeight
            });
        }
    }, []);

    // Physics / Float Animation variants
    const floatTransition = {
        duration: 30,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number], // easeInOut cubic-bezier
        repeat: Infinity,
        repeatType: "mirror" as const
    };

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full z-0" />

            <AnimatePresence>
                {nodes.map((node) => (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }} // Start from center
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: node.x,
                            y: node.y,
                            transition: { duration: 3, type: "spring", stiffness: 20, damping: 20 }
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        style={{ position: 'absolute', top: '50%', left: '50%' }}
                        className="pointer-events-auto cursor-pointer"
                        onClick={() => onNodeClick(node.id)}
                    >
                        {/* Floating wrapper */}
                        <motion.div
                            animate={{
                                x: [0, (node.id.charCodeAt(0) % 30) - 15], // Deterministic pseudo-random based on ID
                                y: [0, (node.text.length % 30) - 15],
                            }}
                            transition={floatTransition}
                            className="flex flex-col items-center justify-center gap-2 group"
                        >
                            {/* Node Symbol (Initial) */}
                            <div className="w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:border-[#d4af37] group-hover:shadow-[0_0_20px_#d4af37] transition-all duration-500">
                                <span className="font-serif text-sm text-white group-hover:text-[#d4af37] transition-colors duration-500">
                                    {node.text.charAt(0).toUpperCase()}
                                </span>
                            </div>

                            {/* Node Label (Slow Pop-up) */}
                            <motion.span
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5, duration: 1.5 }}
                                className="text-white/80 font-serif text-sm tracking-wide whitespace-nowrap bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 group-hover:border-[#d4af37]/50 group-hover:text-[#d4af37] transition-colors"
                            >
                                {node.text}
                            </motion.span>

                            {/* Connection Line (SVG line to center) - Optional Polish, maybe skipped for clean floating look */}
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
