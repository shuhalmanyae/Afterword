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

    useEffect(() => {
        setSubject(initialSubject);
        setBody(initialBody);
    }, [initialSubject, initialBody]);

    // Auto-save debounced or on blur could be here, but simple onSave call on change for now
    useEffect(() => {
        const timer = setTimeout(() => {
            onSave(subject, body);
        }, 500);
        return () => clearTimeout(timer);
    }, [subject, body, onSave]);


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
            {/* Glass Container - Scale to feel like a full workspace */}
            <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl min-h-[60vh]">

                {/* Top: Toolbar */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/5 shrink-0">
                    <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
                        {/* Media Tools */}
                        <div className="flex items-center gap-1">
                            <button className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Record Audio">
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
                    <button
                        onClick={onSecure}
                        className="px-6 py-2 bg-white/10 border border-white/20 rounded-full text-white font-medium hover:bg-white/20 hover:scale-105 transition-all text-sm flex items-center gap-2 backdrop-blur-md shadow-lg"
                    >
                        <span>Save Message</span>
                        <ArrowUp className="w-4 h-4" />
                    </button>
                </div>

                {/* Editor Area - Expansive */}
                <div className="flex-1 flex flex-col p-10 relative overflow-hidden">

                    {/* Subject Line */}
                    <div className="mb-8 border-b border-white/5">
                        <input
                            type="text"
                            autoFocus
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-3xl font-light text-white placeholder-white/20 pb-4"
                            placeholder="Subject"
                        />
                    </div>

                    {/* Editor Body */}
                    <div className="flex-1 relative h-full">
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
            </div>
        </div>
    );
}
