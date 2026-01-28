"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Quote } from 'lucide-react';
import { useEffect } from 'react';

interface TipTapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    activeFont?: string;
    className?: string;
    editable?: boolean;
    onEditorReady?: (editor: Editor) => void;
}

export default function TipTapEditor({
    content,
    onChange,
    placeholder = "Write your legacy...",
    activeFont = "font-serif",
    className = "",
    editable = true,
    onEditorReady
}: TipTapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder: placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: content,
        editable: editable,
        editorProps: {
            attributes: {
                class: `prose prose-invert max-w-none focus:outline-none min-h-[50vh] text-lg text-white/90 leading-relaxed caret-[#D4AF37] ${className}`,
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    // Handle initial content updates if needed (e.g. if loaded async)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Be careful with cursor jumping here. Only update if empty or significantly different?
            // Actually, for a controlled component feel, we might want this, but TipTap is usually uncontrolled.
            // We'll rely on initial load for now.
            if (editor.isEmpty && content) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={`relative w-full h-full ${activeFont}`}>
            {editor && (
                <BubbleMenu
                    editor={editor}
                    className="flex items-center gap-1 p-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden"
                >
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'text-white bg-white/10' : 'text-white/60'}`}
                        title="Bold (Cmd+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'text-white bg-white/10' : 'text-white/60'}`}
                        title="Italic (Cmd+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('underline') ? 'text-white bg-white/10' : 'text-white/60'}`}
                        title="Underline (Cmd+U)"
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('blockquote') ? 'text-white bg-white/10' : 'text-white/60'}`}
                        title="Quote"
                    >
                        <Quote className="w-4 h-4" />
                    </button>
                </BubbleMenu>
            )}

            <EditorContent editor={editor} className="w-full h-full" />

            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: rgba(255, 255, 255, 0.2);
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .ProseMirror {
                    min-height: 100%;
                    outline: none;
                }
                /* Remove default typography margins if needed */
                .ProseMirror p {
                    margin-bottom: 0.5em; /* leading-relaxed handles line height, spacing between paragraphs needs minimal margin */
                }
            `}</style>
        </div>
    );
}
