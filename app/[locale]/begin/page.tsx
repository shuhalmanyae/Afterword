"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ConstellationCanvas from "@/components/ConstellationCanvas";
import { useRouter } from "@/i18n/routing";
import ConnectionCard from "@/components/ConnectionCard";
import ConstellationSidebar from "@/components/ConstellationSidebar";

interface Node {
    id: string;
    text: string;
    x: number;
    y: number;
    size: number;
    delay: number;
}

export default function BeginPage() {
    const router = useRouter();
    const [state, setState] = useState<'threshold' | 'constellation' | 'portal_email' | 'portal_code'>('threshold');
    const [inputValue, setInputValue] = useState("");
    const [nodes, setNodes] = useState<Node[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");

    // Suggestion Autofocus Ref
    const inputRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);

    // Force focus logic
    useEffect(() => {
        if (state === 'constellation') {
            const timer = setTimeout(() => inputRef.current?.focus(), 500);
            return () => clearTimeout(timer);
        }
        if (state === 'portal_email') {
            const timer = setTimeout(() => emailRef.current?.focus(), 500);
            return () => clearTimeout(timer);
        }
        if (state === 'portal_code') {
            const timer = setTimeout(() => codeRef.current?.focus(), 500);
            return () => clearTimeout(timer);
        }
    }, [state]);

    // Threshold Interaction
    const handleThresholdEnter = () => {
        setState('constellation');
    };

    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const placeholders = [
        "The love of your life",
        "Your firstborn son",
        "A partner who shared your journey",
        "A friend you never got to thank",
        "A daughter who looks up to you",
        "The sibling who knows your history",
        "Your most trusted companion",
        "A mentor who changed your life",
        "The family that stays behind",
        "A lifelong friend"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Constellation Input Logic
    const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Calculate a random position on an orbit
        // Pushing radius out to 400+ to avoid overlapping the wider center text
        const angle = Math.random() * Math.PI * 2;
        const radius = 400 + Math.random() * 300;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const newNode: Node = {
            id: Date.now().toString(),
            text: inputValue.trim(),
            x,
            y,
            size: 1,
            delay: 0
        };

        setNodes(prev => [...prev, newNode]);
        setInputValue("");
    };

    const handleContinue = () => {
        setState('portal_email');
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setState('portal_code');
    };

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code) {
            // Persist nodes to localStorage for Dashboard retrieval
            localStorage.setItem('constellation_nodes', JSON.stringify(nodes));

            // Redirect
            router.push("/dashboard");
        }
    };

    const handleNodeClick = (id: string) => {
        setSelectedNodeId(id);
    };

    const handleNodeDelete = (id: string) => {
        setNodes(prev => prev.filter(n => n.id !== id));
        setSelectedNodeId(null);
    };

    const handleConnectionSave = (id: string, email: string, phone: string) => {
        // Mock save
        console.log("Saved details for", id, email, phone);
        setSelectedNodeId(null);
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    return (
        <main className="fixed inset-0 bg-black text-white overflow-hidden flex items-center justify-center">

            <AnimatePresence mode="wait">

                {/* STATE 1: THE THRESHOLD */}
                {state === 'threshold' && (
                    <motion.div
                        key="threshold"
                        className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 1.5 }}
                    >
                        {/* Quote */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-2xl md:text-4xl font-serif font-thin text-white leading-relaxed tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        >
                            <span className="opacity-80">Time is a thief, but words are immortal.</span>
                            <br />
                            <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">Who must hear yours?</span>
                        </motion.h1>

                        {/* Begin Button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2, duration: 1 }}
                            onClick={handleThresholdEnter}
                            className="mt-16 group relative px-8 py-3 overflow-hidden rounded-full hover:bg-white/5 transition-all text-sm font-light tracking-[0.3em] uppercase border border-white/10 hover:border-white/40"
                        >
                            <span className="relative z-10 flex items-center gap-4">
                                Begin the Naming
                            </span>
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
                        </motion.button>
                    </motion.div>
                )}

                {/* STATE 2: THE CONSTELLATION */}
                {state === 'constellation' && (
                    <motion.div
                        key="constellation"
                        className="fixed inset-0 w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        transition={{ duration: 2 }}
                    >
                        {/* Background Stars/Constellation Canvas - Ambient Only */}
                        <ConstellationCanvas nodes={[]} onNodeClick={() => { }} />

                        {/* Vertical Sidebar (Left) */}
                        <ConstellationSidebar
                            nodes={nodes}
                            onSelect={handleNodeClick}
                            onDelete={handleNodeDelete}
                        />

                        {/* Interactive Center Input */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">

                            {/* Input Form (Pointer events enabled) */}
                            <motion.form
                                onSubmit={handleInputSubmit}
                                className="pointer-events-auto flex flex-col items-center gap-8 w-full max-w-4xl px-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <h2 className="text-2xl md:text-3xl font-serif font-thin text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] mb-8">
                                    Who deserves the final truth?
                                </h2>

                                <div className="relative w-full flex flex-col items-center">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        autoFocus
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={placeholders[placeholderIndex]}
                                        className="bg-transparent border-b border-white text-center text-2xl md:text-3xl font-serif text-white placeholder-white/20 focus:outline-none py-4 w-full transition-colors duration-300"
                                    />

                                    {/* Enter Hint & Helper Text */}
                                    <div className={`mt-6 transition-all duration-500 flex flex-col items-center gap-2 ${inputValue ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-2'}`}>
                                        <div className={`flex items-center gap-2 transition-opacity duration-300 ${inputValue ? 'opacity-100' : 'opacity-0'}`}>
                                            <span className="text-[10px] uppercase tracking-widest text-white/40">Press Enter to add</span>
                                            <button type="submit" className="text-white/40 hover:text-white transition-colors">
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-white/20 uppercase tracking-widest font-light">
                                            You can always remove or add people later
                                        </p>
                                    </div>
                                </div>
                            </motion.form>

                            {/* Counter */}
                            <motion.div
                                className="absolute bottom-8 right-8 text-right pointer-events-auto"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-light">Recipients in your circle</p>
                                <p className="text-2xl font-serif text-white/60">{nodes.length}</p>
                            </motion.div>

                            {/* Seal Button (Bottom Center) - Only if 2+ nodes */}
                            <AnimatePresence>
                                {nodes.length >= 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="absolute bottom-12 z-30 pointer-events-auto"
                                    >
                                        <button
                                            onClick={handleContinue}
                                            className="group relative px-12 py-4 bg-transparent border border-white/20 hover:border-white/50 transition-all duration-500"
                                        >
                                            <span className="relative z-10 flex items-center gap-3 text-xs font-medium tracking-[0.3em] uppercase text-white">
                                                Protect their word
                                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500" />
                                            </span>
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Connection Card Modal */}
                            <AnimatePresence>
                                {selectedNode && (
                                    <ConnectionCard
                                        node={selectedNode}
                                        onClose={() => setSelectedNodeId(null)}
                                        onDelete={handleNodeDelete}
                                        onSave={handleConnectionSave}
                                    />
                                )}
                            </AnimatePresence>

                        </div>

                        {/* Top Right Exit */}
                        <button
                            onClick={handleContinue}
                            className="absolute top-8 right-8 z-50 text-white/20 hover:text-white/60 text-xs uppercase tracking-widest transition-colors"
                        >
                            Skip for now
                        </button>

                    </motion.div>
                )}

                {/* STATE 3: PORTAL EMAIL */}
                {state === 'portal_email' && (
                    <motion.div
                        key="portal_email"
                        className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1 }}
                    >
                        <div className="max-w-xl w-full text-center">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-white/60 font-serif text-lg md:text-xl leading-relaxed mb-12"
                            >
                                You’ve identified those who matter most. Let’s seal this portal with a key that only you hold and help us store your information securely.
                            </motion.p>

                            <motion.form
                                onSubmit={handleEmailSubmit}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="flex flex-col items-center"
                            >
                                <input
                                    ref={emailRef}
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-b border-white text-center text-3xl font-serif text-white placeholder-white/20 focus:outline-none py-4 mb-4"
                                />
                                <button type="submit" className="text-white/40 hover:text-white text-xs uppercase tracking-widest mt-8 flex items-center gap-2">
                                    Request Key <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.form>
                        </div>
                    </motion.div>
                )}

                {/* STATE 4: PORTAL CODE */}
                {state === 'portal_code' && (
                    <motion.div
                        key="portal_code"
                        className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="max-w-xl w-full text-center">
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-white/40 text-xs uppercase tracking-widest mb-8"
                            >
                                Key sent to {email}
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl md:text-3xl font-serif text-white mb-12"
                            >
                                Enter the Code
                            </motion.h2>

                            <motion.form
                                onSubmit={handleCodeSubmit}
                                className="flex flex-col items-center"
                            >
                                <input
                                    ref={codeRef}
                                    type="text"
                                    placeholder="• • • • • •"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full bg-transparent border-b border-white text-center text-4xl font-serif text-white placeholder-white/20 focus:outline-none py-4 mb-4 tracking-[1em]"
                                    maxLength={6}
                                />
                                <button type="submit" className="text-white/40 hover:text-white text-xs uppercase tracking-widest mt-8 flex items-center gap-2">
                                    Unlock Vault <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.form>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </main>
    );
}
