"use client";

import { Link, Image as ImageIcon, Underline, Send, X, Type, Bold, Italic } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Editor } from '@tiptap/react';
import TipTapEditor from "./TipTapEditor";

interface MessageComposerProps {
    initialSubject?: string;
    initialBody?: string;
    onSave: (subject: string, body: string) => void;
    onSecure: () => void;
    onClose?: () => void; // Optional close handler for Zen Mode
    recipientName?: string;
    onConfirm?: () => void;
}

export default function MessageComposer({
    initialSubject = "",
    initialBody = "",
    onSave,
    onConfirm
}: MessageComposerProps) {
    const [subject, setSubject] = useState(initialSubject);
    const [body, setBody] = useState(initialBody);
    const [activeFont, setActiveFont] = useState("font-serif");
    const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
    const [hoverFont, setHoverFont] = useState<string | null>(null);
    const [editor, setEditor] = useState<Editor | null>(null);
    const [formats, setFormats] = useState({ bold: false, italic: false, underline: false });

    // Attachments State
    const [attachments, setAttachments] = useState<{ id: string; file: File; name: string; isDeleting: boolean; }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-Save State
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

    useEffect(() => {
        setSubject(initialSubject);
        setBody(initialBody);
    }, [initialSubject, initialBody]);

    useEffect(() => {
        setSaveStatus("saving");
        const timer = setTimeout(() => {
            onSave(subject, body);
            setSaveStatus("saved");
        }, 1000);
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



    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substring(7),
                file,
                name: file.name,
                isDeleting: false
            }));
            setAttachments(prev => [...prev, ...newFiles]);
        }
    };



    return (
        <div className="flex flex-col h-full relative">
            {/* Transparent Container - Integrated */}
            <div className="flex-1 flex flex-col h-full bg-white/[0.02] backdrop-blur-md rounded-xl border border-white/5 overflow-hidden relative">

                {/* Editor Area - Expansive */}
                <div className="flex-1 flex flex-col relative overflow-hidden">

                    {/* Subject Line */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
                        <input
                            type="text"
                            autoFocus
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-2xl font-light text-white placeholder-white/20 mr-4"
                            placeholder="Subject"
                        />
                        {/* Optional Security or Status Indicator */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase tracking-widest text-white/20">
                                {saveStatus === 'saving' ? 'Saving...' : 'Encrypted'}
                            </span>
                        </div>
                    </div>

                    {/* Editor Body */}
                    <div className="flex-1 relative min-h-0 p-6 overflow-y-auto custom-scrollbar">
                        <TipTapEditor
                            content={body}
                            onChange={setBody}
                            placeholder={animatedPlaceholder}
                            activeFont={hoverFont || activeFont}
                            onEditorReady={(editorInstance) => {
                                setEditor(editorInstance);
                                editorInstance.on('transaction', () => {
                                    setFormats({
                                        bold: editorInstance.isActive('bold'),
                                        italic: editorInstance.isActive('italic'),
                                        underline: editorInstance.isActive('underline')
                                    });
                                });
                            }}
                        />




                        {/* ... placeholder hint ... */}
                        {!body && isTypingComplete && (
                            <div className="absolute top-8 left-8 text-[10px] text-white/30 uppercase tracking-widest pointer-events-none animate-pulse">
                                Start Writing
                            </div>
                        )}

                        <div className="mt-8 flex flex-wrap gap-4">
                            {attachments.map((item) => (
                                <div key={item.id} className="relative group bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3 w-64 transition-all hover:border-white/20">
                                    {/* Icon */}
                                    <div className="p-2 bg-white/10 rounded-lg text-white/70">
                                        {item.file.type.startsWith('image') ? <ImageIcon className="w-5 h-5" /> : <Link className="w-5 h-5" />}
                                    </div>

                                    {/* Editable Name */}
                                    <div className="flex-1 min-w-0">
                                        <input
                                            value={item.name}
                                            onChange={(e) => {
                                                const newName = e.target.value;
                                                setAttachments(prev => prev.map(a => a.id === item.id ? { ...a, name: newName } : a));
                                            }}
                                            className="bg-transparent text-sm text-white/90 placeholder-white/30 outline-none w-full border-b border-transparent focus:border-white/30 transition-colors py-0.5 font-light"
                                        />
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{(item.file.size / 1024).toFixed(1)} KB</p>
                                    </div>

                                    {/* Delete Button (Hover Only) */}
                                    {!item.isDeleting && (
                                        <button
                                            onClick={() => setAttachments(prev => prev.map(a => a.id === item.id ? { ...a, isDeleting: true } : a))}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg z-10 opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}

                                    {/* Confirmation Overlay */}
                                    <AnimatePresence>
                                        {item.isDeleting && (
                                            <motion.div
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-xl flex items-center justify-center gap-3 z-20"
                                            >
                                                <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Delete?</span>
                                                <button onClick={() => setAttachments(prev => prev.filter(a => a.id !== item.id))} className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold hover:bg-red-600 uppercase tracking-wider">YES</button>
                                                <button onClick={() => setAttachments(prev => prev.map(a => a.id === item.id ? { ...a, isDeleting: false } : a))} className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-bold hover:bg-white/20 uppercase tracking-wider border border-white/10">NO</button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                        {/* ... video/audio players ... */}

                    </div>
                </div>

                {/* Subtle decoration */}
                {/* Subtle decoration - Swiss Cross Watermark */}
                <div className="absolute -right-12 -bottom-12 pointer-events-none opacity-[0.03] rotate-12">
                    <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-white">
                        <rect x="30" y="10" width="40" height="80" />
                        <rect x="10" y="30" width="80" height="40" />
                    </svg>
                </div>

                {/* Toolbar / Actions */}
                <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        {/* Basic Formatting Tools - Subtle */}
                        <div className="flex items-center gap-1">
                            {/* Font Menu Drop-Up */}
                            <div className="relative">
                                <AnimatePresence>
                                    {isFontMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsFontMenuOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute bottom-full left-0 mb-4 w-32 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 flex flex-col p-1"
                                            >
                                                {[
                                                    { label: 'Serif', value: 'font-serif' },
                                                    { label: 'Sans', value: 'font-sans' },
                                                    { label: 'Mono', value: 'font-mono' },
                                                    { label: 'Script', value: 'font-display' },
                                                    { label: 'Legacy', value: 'font-cinzel' },
                                                    { label: 'Modern', value: 'font-montserrat' }
                                                ].map((fontOption) => (
                                                    <button
                                                        key={fontOption.value}
                                                        onClick={() => { setActiveFont(fontOption.value); setIsFontMenuOpen(false); }}
                                                        onMouseEnter={() => setHoverFont(fontOption.value)}
                                                        onMouseLeave={() => setHoverFont(null)}
                                                        className={`px-3 py-2 text-left text-xs rounded-lg transition-colors ${activeFont === fontOption.value ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                                                            } ${fontOption.value}`}
                                                    >
                                                        {fontOption.label}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>

                                <button
                                    onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
                                    className={`p-2 transition-colors group relative ${isFontMenuOpen ? 'text-white' : 'text-white/40 hover:text-white'}`}
                                    title="Change Font"
                                >
                                    <Type className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="w-px h-4 bg-white/10 mx-2" />

                            {/* Formatting Controls */}
                            <button
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                className={`p-2 transition-colors ${formats.bold ? 'text-white bg-white/10 rounded' : 'text-white/40 hover:text-white'}`}
                                title="Bold"
                            >
                                <Bold className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                className={`p-2 transition-colors ${formats.italic ? 'text-white bg-white/10 rounded' : 'text-white/40 hover:text-white'}`}
                                title="Italic"
                            >
                                <Italic className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                className={`p-2 transition-colors ${formats.underline ? 'text-white bg-white/10 rounded' : 'text-white/40 hover:text-white'}`}
                                title="Underline"
                            >
                                <Underline className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="w-px h-4 bg-white/10 mx-2" />

                        <div className="relative group">
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-white/40 hover:text-white transition-colors" title="Attach"><Link className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {/* Divider and Button inside the toolbar */}
                    <div className="w-px h-8 bg-white/5 mx-4" />

                    {/* Main CTA: Save & Confirm */}
                    <button
                        onClick={onConfirm}
                        className="group flex items-center gap-3 text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-white hover:opacity-80 transition-opacity"
                    >
                        Save Message
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Send className="w-4 h-4 text-white transform -rotate-45 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
