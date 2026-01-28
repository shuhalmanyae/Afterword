"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Edit2, Trash2 } from "lucide-react";

interface Node {
    id: string;
    text: string;
}

interface ConstellationSidebarProps {
    nodes: Node[];
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    animatingNodeId?: string | null;
}

export default function ConstellationSidebar({ nodes, onSelect, onDelete, animatingNodeId }: ConstellationSidebarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed left-0 top-0 h-full w-64 md:w-80 z-40 pt-32 pl-8 pb-8 flex flex-col pointer-events-none"
        >
            {/* Header */}
            <div className="mb-6 pointer-events-auto">
                <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-light mb-2">Your Circle</h3>
                <div className="w-8 h-px bg-white/20" />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-4 pointer-events-auto pr-4 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {nodes.map((node, index) => {
                        const isAnimating = node.id === animatingNodeId;

                        return (
                            <motion.div
                                key={node.id}
                                layout
                                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    scale: 1,
                                    borderColor: isAnimating ? "white" : "rgba(255,255,255,0.1)"
                                }}
                                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className={`group relative pl-4 py-3 border-l hover:border-white/50 transition-all duration-300 cursor-pointer flex items-center gap-4 ${isAnimating ? "bg-white/5" : ""}`}
                                onClick={() => onSelect(node.id)}
                            >
                                {/* Cadre Effect (Full Border appearing) */}
                                {isAnimating && (
                                    <motion.div
                                        layoutId="cadre"
                                        className="absolute inset-0 border border-white opacity-0"
                                        animate={{ opacity: [0, 1, 1, 0], scale: [1.05, 1, 1, 1.05] }}
                                        transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
                                    />
                                )}

                                <div>
                                    <h4 className={`font-serif text-lg transition-colors ${isAnimating ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                                        {node.text}
                                    </h4>
                                    <p className="text-white/30 text-[10px] uppercase tracking-wider group-hover:text-white/50 transition-colors">
                                        Validating
                                    </p>
                                </div>

                                {/* Delete Action (Close to name) */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
                                    className="p-2 -ml-2 text-white/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {nodes.length === 0 && (
                    <div className="text-white/20 text-xs font-light italic mt-4">
                        The circle is empty...
                    </div>
                )}
            </div>

            {/* Footer gradient */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </motion.div>
    );
}
