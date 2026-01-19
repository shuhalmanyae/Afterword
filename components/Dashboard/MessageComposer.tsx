"use client";

import { Mic, Video, Bold, Italic, Link, Image as ImageIcon, Sparkles, Underline, List, Send, ArrowUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";

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

    // Audio Logic
    const handleToggleRecording = async () => {
        if (isRecording) {
            // Stop Recording
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
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
                        <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex items-center gap-4">
                                <span className="text-xs uppercase tracking-widest text-white/50">Voice Note</span>
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
                    <div className="flex-1 relative h-full min-h-0">
                        <textarea
                            ref={textareaRef}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full h-full bg-transparent border-none outline-none text-lg text-white/90 placeholder-white/30 resize-none font-light leading-relaxed custom-textarea"
                            placeholder="Start writing..."
                        />

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
