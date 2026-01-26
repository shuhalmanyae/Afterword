"use client";

import { Mic, Video, Bold, Italic, Link, Image as ImageIcon, Sparkles, Underline, List, Send, ArrowUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageComposerProps {
    initialSubject?: string;
    initialBody?: string;
    onSave: (subject: string, body: string) => void;
    onSecure: () => void;
}

export default function MessageComposer({ initialSubject = "", initialBody = "", onSave, onSecure }: MessageComposerProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [subject, setSubject] = useState(initialSubject);
    const [body, setBody] = useState(initialBody);

    // Audio Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [recordingName, setRecordingName] = useState("Voice Note");
    const [showVoiceGuide, setShowVoiceGuide] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        setSubject(initialSubject);
        setBody(initialBody);
    }, [initialSubject, initialBody]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSave(subject, body);
        }, 500);
        return () => clearTimeout(timer);
    }, [subject, body, onSave]);

    // Random Placeholder Logic
    const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    useEffect(() => {
        const examples = [
            "If you are reading this, you probably just graduated. I am so incredibly proud of the woman you have become.",
            "I have attached a secured PDF below containing the seed phrase for my hardware wallet. The password is your birthday.",
            "To my darling Sarah: I loved you from the moment we met until my very last breath. Thank you for the best years of my life.",
            "Don't be sad that I'm gone. Be happy that I didn't spend all the inheritance. (Check the safe in the basement).",
            "The access keys to my digital estate are in the encrypted file attached. Please hold onto them for the grandkids.",
            "My only regret is working so hard on weekends. Take the trip. Buy the shoes. Kiss the boy.",
            "I forgive you for what happened back then. Let it go. Live your life without that weight on your shoulders.",
            "The code to the safe is not lost. It is hidden inside the copy of 'Moby Dick' in my study, page 42.",
            "Please get married again. I don't want you to be lonely. Just don't marry Dave.",
            "I had a wonderful life. Thank you for being the best part of it."
        ];

        // Initial setup for cycling
        let loopNum = Math.floor(Math.random() * examples.length);
        let isDeleting = false;
        let txt = '';
        let timer: NodeJS.Timeout;

        const tick = () => {
            // Stop if user typed
            if (body) {
                setAnimatedPlaceholder("");
                return;
            }

            const i = loopNum % examples.length;
            const fullText = examples[i];

            // Update text: typing or deleting
            if (isDeleting) {
                txt = fullText.substring(0, txt.length - 1);
            } else {
                txt = fullText.substring(0, txt.length + 1);
            }

            setAnimatedPlaceholder(txt);

            let delta = 40; // Typing speed

            if (isDeleting) {
                delta /= 2; // Deleting speed
            }

            if (!isDeleting && txt === fullText) {
                // Finished typing sentence
                delta = 3000; // Pause for reading
                isDeleting = true;
                setIsTypingComplete(true);
            } else if (isDeleting && txt === '') {
                // Finished deleting sentence
                isDeleting = false;
                loopNum++;
                delta = 500; // Pause before next
                setIsTypingComplete(false);
            } else {
                setIsTypingComplete(false);
            }

            timer = setTimeout(tick, delta);
        };

        // Start loop
        timer = setTimeout(tick, 500);

        return () => clearTimeout(timer);
    }, [body]);

    // Audio Logic
    const handleToggleRecording = async () => {
        if (isRecording) {
            // Stop Recording
            mediaRecorderRef.current?.stop();
            setIsRecording(false);

            // Check for first-time guide
            const hasSeenGuide = localStorage.getItem('hasSeenVoiceGuide');
            if (!hasSeenGuide) {
                setShowVoiceGuide(true);
                localStorage.setItem('hasSeenVoiceGuide', 'true');
                // Auto-hide after 5 seconds
                setTimeout(() => setShowVoiceGuide(false), 5000);
            }
        } else {
            // Start Recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const url = URL.createObjectURL(audioBlob);
                    setAudioUrl(url);

                    // Stop all tracks to release microphone
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Could not access microphone. Please check permissions.");
            }
        }
    };

    const insertFormat = (prefix: string, suffix: string) => {
        if (!textareaRef.current) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = textareaRef.current.value;
        const selectedText = text.substring(start, end);

        const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);

        setBody(newText);

        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length);
            }
        }, 0);
    };

    return (
        <div className="flex flex-col h-full relative p-6 pt-0">
            {/* Glass Container - Forced Height and Layout */}
            <div className="flex-1 flex flex-col h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl">

                {/* Top: Toolbar */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/5 shrink-0">
                    <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
                        {/* Media Tools */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleToggleRecording}
                                className={`p-2 rounded-lg transition-all ${isRecording
                                    ? "bg-red-500/20 text-red-500 animate-pulse"
                                    : "text-white/50 hover:text-white hover:bg-white/10"
                                    }`}
                                title={isRecording ? "Stop Recording" : "Record Audio"}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Record Video">
                                <Video className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="w-px h-6 bg-white/10 mx-2" />

                        {/* Formatting Tools */}
                        <div className="flex items-center gap-1">
                            <button onClick={() => insertFormat("**", "**")} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Bold className="w-5 h-5" /></button>
                            <button onClick={() => insertFormat("_", "_")} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Italic className="w-5 h-5" /></button>
                            <button onClick={() => insertFormat("__", "__")} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Underline className="w-5 h-5" /></button>
                        </div>
                        <div className="w-px h-6 bg-white/10 mx-2" />
                        <div className="flex items-center gap-1">
                            <button onClick={() => insertFormat("[", "](url)")} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Link className="w-5 h-5" /></button>
                            <button onClick={() => insertFormat("![](", ")")} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><ImageIcon className="w-5 h-5" /></button>
                            <button onClick={() => insertFormat("- ", "")} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><List className="w-5 h-5" /></button>
                        </div>
                    </div>
                    {/* Toolbar Right Side Actions (formerly Save Message, now potentially empty or status) */}
                </div>

                {/* Editor Area - Expansive */}
                <div className="flex-1 flex flex-col p-10 relative overflow-hidden">

                    {/* Subject Line */}
                    <div className="mb-4 border-b border-white/5 pb-4">
                        <input
                            type="text"
                            autoFocus
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-3xl font-light text-white placeholder-white/20"
                            placeholder="Subject"
                        />
                    </div>

                    {/* Audio Player (if recorded) */}
                    {audioUrl && (
                        <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10 relative">
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={recordingName}
                                        onChange={(e) => setRecordingName(e.target.value)}
                                        className="bg-transparent border-b border-white/10 focus:border-white/50 outline-none text-xs uppercase tracking-widest text-white/70 focus:text-white w-32 transition-colors py-1"
                                    />
                                    {/* Tooltip Guide */}
                                    <AnimatePresence>
                                        {showVoiceGuide && (
                                            <>
                                                {/* Pulse Beacon */}
                                                <div className="absolute -top-1 -right-1 pointer-events-none">
                                                    <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                </div>

                                                {/* Glass Tooltip */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute bottom-full left-0 mb-4 w-72 p-5 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50"
                                                >
                                                    <h4 className="text-white font-serif text-lg mb-2">Name your story.</h4>
                                                    <p className="text-white/60 text-sm font-light leading-relaxed mb-4">
                                                        Give your voice note a title so your heirs know exactly what to listen to.
                                                    </p>
                                                    <button
                                                        onClick={() => setShowVoiceGuide(false)}
                                                        className="text-xs font-bold uppercase tracking-widest text-white hover:text-white/80 transition-colors"
                                                    >
                                                        Got it
                                                    </button>
                                                    {/* Arrow */}
                                                    <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-black border-r border-b border-white/10 rotate-45"></div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <audio controls src={audioUrl} className="h-8 w-64 accent-white" />
                                <button
                                    onClick={() => setAudioUrl(null)}
                                    className="p-1 text-white/30 hover:text-red-400 transition-colors"
                                >
                                    <span className="sr-only">Delete Recording</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Editor Body */}
                    <div className="flex-1 relative h-full min-h-0 group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm pointer-events-none" />
                        <div className="relative h-full bg-white/5 border border-white/10 rounded-xl p-6 transition-colors focus-within:bg-white/10 focus-within:border-white/30">
                            <textarea
                                ref={textareaRef}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="w-full h-full bg-transparent border-none outline-none text-lg text-white/90 placeholder-white/30 resize-none font-light leading-relaxed custom-textarea font-serif tracking-wide"
                                placeholder={animatedPlaceholder}
                            />
                            {/* Editable Hint */}
                            {!body && isTypingComplete && (
                                <div className="absolute bottom-4 right-4 text-[10px] text-white/30 uppercase tracking-widest pointer-events-none animate-pulse">
                                    Start Writing
                                </div>
                            )}
                        </div>

                        {/* Subtle decoration */}
                        <div className="absolute right-0 bottom-0 pointer-events-none opacity-5">
                            <Sparkles className="w-32 h-32 text-white" />
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Action Protocol */}
                <div className="p-6 border-t border-white/5 flex justify-center bg-black/20">
                    <button
                        onClick={onSecure}
                        className="px-8 py-3 bg-white text-black border border-white rounded-full font-bold tracking-widest hover:bg-white/90 hover:scale-105 transition-all text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        <span>SAVE MESSAGE</span>
                        <ArrowUp className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
