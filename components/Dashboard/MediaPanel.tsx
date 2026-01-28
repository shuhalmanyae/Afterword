"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Video, Pause, Play, Square, Trash2, Loader2, ArrowLeft, Upload, FileText, Image as ImageIcon, X, Plus, MonitorPlay } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Custom Swiss Icons ---
const SwissMic = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10C5 13.866 8.13401 17 12 17C15.866 17 19 13.866 19 10" />
        <path d="M12 17V21M12 21H9M12 21H15" />
    </svg>
);

const SwissLens = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2V4" />
        <path d="M12 20V22" />
        <path d="M22 12H20" />
        <path d="M4 12H2" />
    </svg>
);

const SwissFile = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" />
        <path d="M14 2V8H20" />
        <path d="M12 18V12" />
        <path d="M9 15H15" />
    </svg>
);

interface MeasuredAttachment {
    id: string;
    file: File;
    name: string;
}

interface VoiceNote {
    id: string;
    blob: Blob;
    url: string;
    name: string;
    duration: number;
    date: Date;
}

interface VideoNote {
    id: string;
    blob: Blob;
    url: string;
    name: string;
    duration: number;
    date: Date;
}

interface MediaPanelProps {
    onAudioCapture: (blob: Blob, name: string) => void;
    onVideoCapture: (blob: Blob, name: string) => void;
    onAttachmentsUpdate: (attachments: MeasuredAttachment[]) => void;
}

export default function MediaPanel({ onAudioCapture, onVideoCapture, onAttachmentsUpdate }: MediaPanelProps) {
    const [mode, setMode] = useState<'idle' | 'voice' | 'video' | 'attachments'>('idle');
    const [mediaName, setMediaName] = useState("");

    // --- Audio State ---
    const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const [isPausedAudio, setIsPausedAudio] = useState(false);

    // Active Audio Recording State
    const [currentAudioTime, setCurrentAudioTime] = useState(0);
    const [audioData, setAudioData] = useState<number[]>(new Array(20).fill(10));

    const audioRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioTimerRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Audio Playback State
    const [playingNoteId, setPlayingNoteId] = useState<string | null>(null);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(0);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

    // --- Video State ---
    const [videoNotes, setVideoNotes] = useState<VideoNote[]>([]);
    // Video Sub-views: 'library' (list) | 'recording' (live camera) | 'playback' (viewing a note)
    const [videoViewMode, setVideoViewMode] = useState<'library' | 'recording' | 'playback'>('library');
    const [isRecordingVideo, setIsRecordingVideo] = useState(false);
    const [isPausedVideo, setIsPausedVideo] = useState(false);

    // Active Video Recording State
    const [videoTime, setVideoTime] = useState(0);

    const videoRecorderRef = useRef<MediaRecorder | null>(null);
    const videoChunksRef = useRef<Blob[]>([]);
    const videoTimerRef = useRef<NodeJS.Timeout | null>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);

    // Video Playback State
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

    // --- Attachments State ---
    const [attachments, setAttachments] = useState<MeasuredAttachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Guidance State
    const [showGuidance, setShowGuidance] = useState(false);

    // Check Guidance on Mount (Client-side only)
    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenVoiceNamingGuidance');
        if (!hasSeen) {
            setShowGuidance(true);
        }
    }, []);

    const dismissGuidance = () => {
        setShowGuidance(false);
        localStorage.setItem('hasSeenVoiceNamingGuidance', 'true');
    };

    // Helpers
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // --- Delete Confirmation State ---
    const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'voice' | 'video' | 'attachment' } | null>(null);

    const checkDeleteVoiceNote = (id: string) => setItemToDelete({ id, type: 'voice' });
    const checkDeleteVideoNote = (id: string) => setItemToDelete({ id, type: 'video' });
    const checkDeleteAttachment = (id: string) => setItemToDelete({ id, type: 'attachment' });

    const confirmDelete = () => {
        if (!itemToDelete) return;
        const { id, type } = itemToDelete;

        if (type === 'voice') {
            setVoiceNotes(prev => prev.filter(n => n.id !== id));
            if (playingNoteId === id) {
                setPlayingNoteId(null);
                setPlaybackTime(0);
                if (audioPlayerRef.current) {
                    audioPlayerRef.current.pause();
                    audioPlayerRef.current.src = "";
                }
            }
        } else if (type === 'video') {
            setVideoNotes(prev => prev.filter(n => n.id !== id));
            if (playingVideoId === id) {
                setPlayingVideoId(null);
                setVideoViewMode('library');
            }
        } else if (type === 'attachment') {
            const updated = attachments.filter(a => a.id !== id);
            setAttachments(updated);
            onAttachmentsUpdate(updated);
        }
        setItemToDelete(null);
    };

    // --- Audio Handlers ---
    const startAudioRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Visualizer Setup
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 64;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            sourceRef.current = source;

            const updateVisualizer = () => {
                if (!analyser) return;
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);
                const sampledData = Array.from(dataArray).slice(0, 20).map(value => Math.max(10, (value / 255) * 50));
                while (sampledData.length < 20) sampledData.push(10);
                setAudioData(sampledData);
                animationFrameRef.current = requestAnimationFrame(updateVisualizer);
            };
            updateVisualizer();

            const mediaRecorder = new MediaRecorder(stream);
            audioRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const duration = currentAudioTime;
                const timestamp = new Date();
                const name = `Voice Note ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                const newNote: VoiceNote = {
                    id: Math.random().toString(36).substr(2, 9),
                    blob,
                    url: URL.createObjectURL(blob),
                    name,
                    duration,
                    date: timestamp
                };

                setVoiceNotes(prev => [newNote, ...prev]);
                onAudioCapture(blob, name); // Legacy/Single connection update

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecordingAudio(true);
            setIsPausedAudio(false);
            setCurrentAudioTime(0);

            audioTimerRef.current = setInterval(() => {
                setCurrentAudioTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Mic access denied", err);
        }
    };

    const pauseResumeAudio = () => {
        if (!audioRecorderRef.current) return;
        if (isPausedAudio) {
            audioRecorderRef.current.resume();
            setIsPausedAudio(false);
            audioTimerRef.current = setInterval(() => {
                setCurrentAudioTime(prev => prev + 1);
            }, 1000);
        } else {
            audioRecorderRef.current.pause();
            setIsPausedAudio(true);
            if (audioTimerRef.current) clearInterval(audioTimerRef.current);
        }
    };

    const stopAudioRecording = () => {
        if (audioRecorderRef.current) {
            audioRecorderRef.current.stop();
            setIsRecordingAudio(false);
            setIsPausedAudio(false);
            if (audioTimerRef.current) clearInterval(audioTimerRef.current);

            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (sourceRef.current) sourceRef.current.disconnect();
            if (analyserRef.current) analyserRef.current.disconnect();
            if (audioContextRef.current) audioContextRef.current.close();

            setAudioData(new Array(20).fill(10));
        }
    };

    const deleteVoiceNote = (id: string) => checkDeleteVoiceNote(id);

    const renameVoiceNote = (id: string, newName: string) => {
        setVoiceNotes(prev => prev.map(n => n.id === id ? { ...n, name: newName } : n));
        dismissGuidance();
    };

    const playNote = (note: VoiceNote) => {
        if (playingNoteId === note.id) {
            if (audioPlayerRef.current?.paused) {
                audioPlayerRef.current.play();
            } else {
                audioPlayerRef.current?.pause();
            }
        } else {
            setPlayingNoteId(note.id);
            setPlaybackTime(0);
            setPlaybackDuration(note.duration);
            if (audioPlayerRef.current) {
                audioPlayerRef.current.src = note.url;
                audioPlayerRef.current.load();
                audioPlayerRef.current.play();
            }
        }
    };

    // --- Video Handlers ---
    const startCameraPreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = stream;
                videoPreviewRef.current.muted = true;
                videoPreviewRef.current.play();
            }
        } catch (err) {
            console.error("Camera access denied", err);
        }
    };

    const stopCameraPreview = () => {
        if (videoPreviewRef.current && videoPreviewRef.current.srcObject) {
            const stream = videoPreviewRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoPreviewRef.current.srcObject = null;
        }
    };

    // Effect to handle camera stream based on view mode
    useEffect(() => {
        if (mode === 'video' && videoViewMode === 'recording') {
            startCameraPreview();
        }
        return () => {
            // Cleanup on unmount or mode change
            if (mode !== 'video' || videoViewMode !== 'recording') {
                stopCameraPreview();
            }
        };
    }, [mode, videoViewMode]);

    const enterVideoRecordingMode = () => {
        setVideoViewMode('recording');
    }

    const startVideoRecording = async () => {
        let stream = videoPreviewRef.current?.srcObject as MediaStream;
        if (!stream || !stream.active) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoPreviewRef.current) {
                    videoPreviewRef.current.srcObject = stream;
                    videoPreviewRef.current.play();
                }
            } catch (err) {
                console.error("Camera error", err);
                return;
            }
        }

        const mediaRecorder = new MediaRecorder(stream);
        videoRecorderRef.current = mediaRecorder;
        videoChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) videoChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
            const duration = videoTime;
            const timestamp = new Date();
            const name = `Video Message ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            const newNote: VideoNote = {
                id: Math.random().toString(36).substr(2, 9),
                blob,
                url: URL.createObjectURL(blob),
                name,
                duration,
                date: timestamp
            };

            setVideoNotes(prev => [newNote, ...prev]);
            onVideoCapture(blob, name);

            // Note: We don't stop the tracks here if we want to keep preview?
            // Actually, we are going back to library mode, so we SHOULD stop tracks to clean up.
            // The useEffect will handle stopping when view mode changes.
            stream.getTracks().forEach(track => track.stop());

            // Navigate back to Library
            setVideoViewMode('library');
        };

        mediaRecorder.start();
        setIsRecordingVideo(true);
        setIsPausedVideo(false);

        setVideoTime(0);
        videoTimerRef.current = setInterval(() => {
            setVideoTime(prev => prev + 1);
        }, 1000);
    };

    const pauseResumeVideo = () => {
        if (!videoRecorderRef.current) return;
        if (isPausedVideo) {
            videoRecorderRef.current.resume();
            setIsPausedVideo(false);
            if (videoPreviewRef.current) videoPreviewRef.current.play();
            videoTimerRef.current = setInterval(() => {
                setVideoTime(prev => prev + 1);
            }, 1000);
        } else {
            videoRecorderRef.current.pause();
            setIsPausedVideo(true);
            if (videoPreviewRef.current) videoPreviewRef.current.pause();
            if (videoTimerRef.current) clearInterval(videoTimerRef.current);
        }
    };

    const stopVideoRecording = () => {
        if (videoRecorderRef.current) {
            videoRecorderRef.current.stop();
            setIsRecordingVideo(false);
            setIsPausedVideo(false);
            if (videoTimerRef.current) clearInterval(videoTimerRef.current);
        }
    };

    const deleteVideoNote = (id: string) => checkDeleteVideoNote(id);

    const renameVideoNote = (id: string, newName: string) => {
        setVideoNotes(prev => prev.map(n => n.id === id ? { ...n, name: newName } : n));
        dismissGuidance();
    };


    // --- Attachments Handlers ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name.split('.')[0]
            }));
            const updated = [...attachments, ...newFiles];
            setAttachments(updated);
            onAttachmentsUpdate(updated);
        }
    };

    const removeAttachment = (id: string) => checkDeleteAttachment(id);

    const renameAttachment = (id: string, newName: string) => {
        const updated = attachments.map(a => a.id === id ? { ...a, name: newName } : a);
        setAttachments(updated);
        onAttachmentsUpdate(updated);
        dismissGuidance();
    };

    const handleBack = () => {
        // Hierarchy: Playback -> Library -> Main
        if (mode === 'video') {
            if (videoViewMode === 'playback') {
                setVideoViewMode('library');
                setPlayingVideoId(null);
                return;
            }
            if (videoViewMode === 'recording') {
                if (isRecordingVideo) stopVideoRecording(); // Save if recording? Or discard?
                // If user clicks back while recording, ideally we should probably stop and save or asking.
                // For now let's cancel/discard if back is clicked mid-recording, or just stop (save).
                // Let's stop (which saves) then go back.
                if (isRecordingVideo) {
                    stopVideoRecording(); // This will trigger onstop -> sets Library
                } else {
                    setVideoViewMode('library');
                }
                return;
            }
            // If in library, go to idle
            setMode('idle');
            return;
        }

        // Voice/Attachments hierarchical back
        if (isRecordingAudio) stopAudioRecording();

        setMode('idle');
    };

    return (
        <div className="w-full h-full flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 relative overflow-hidden font-sans">

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {itemToDelete && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
                        >
                            {/* Ambient Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 blur-[50px] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                                    <Trash2 className="w-5 h-5 text-red-400" />
                                </div>
                                <h3 className="text-white font-serif text-2xl mb-3 tracking-wide">Permanently Delete?</h3>
                                <p className="text-white/40 text-xs font-light tracking-wide leading-relaxed mb-8 max-w-[240px] mx-auto">
                                    This action cannot be undone. This record will be lost forever.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setItemToDelete(null)}
                                        className="flex-1 py-3 text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors border border-white/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 py-3 text-xs uppercase tracking-widest bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors border border-red-500/20"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hidden Audio Element for Global Playback */}
            <audio
                ref={audioPlayerRef}
                onTimeUpdate={() => {
                    if (audioPlayerRef.current) setPlaybackTime(audioPlayerRef.current.currentTime);
                }}
                onEnded={() => {
                    setPlayingNoteId(null);
                    setPlaybackTime(0);
                }}
            />

            {/* Header / Back Button */}
            {mode !== 'idle' && (
                <div className="absolute top-4 left-4 z-50">
                    <button onClick={handleBack} className="p-2 text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Branding Header - Visible in IDLE */}
            {mode === 'idle' && (
                <div className="w-full text-center mt-12 mb-4 px-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide mb-2">The Living Records</h2>
                    <p className="text-xs text-white/40 font-light leading-relaxed max-w-sm mx-auto">
                        Your story, in sight and sound. Upload the videos, voices, and records that will ensure your presence is felt, long after the silence begins.
                    </p>
                </div>
            )}

            {/* Content Area */}
            <div className={`flex-1 relative p-6 flex flex-col items-center ${mode === 'idle' ? 'justify-start pt-8' : 'justify-center'}`}>

                {/* IDLE MODE: Selection */}
                {mode === 'idle' && (
                    <div className="w-full flex-1 flex flex-col justify-center max-w-sm mx-auto gap-4">
                        {[
                            { id: 'voice', label: 'Record Audio', icon: SwissMic, desc: 'Capture your voice.' },
                            { id: 'video', label: 'Record Video', icon: SwissLens, desc: 'Leave a visual message.' },
                            { id: 'attachments', label: 'Upload Records', icon: SwissFile, desc: 'Attach important files.' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setMode(item.id as any)}
                                className="group relative h-32 w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 backdrop-blur-md overflow-hidden text-center"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                    <item.icon className="w-5 h-5 text-white/70 group-hover:text-white" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-lg font-serif text-white mb-1">{item.label}</h3>
                                    <p className="text-[10px] text-white/40 font-sans tracking-widest uppercase">{item.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* VOICE MODE */}
                {mode === 'voice' && (
                    <div className="w-full h-full flex flex-col items-center animate-in fade-in zoom-in duration-300 relative">
                        {isRecordingAudio ? (
                            <div key="audio-recording-view" className="w-full flex-1 flex flex-col items-center justify-center gap-8">
                                <div className="w-full h-32 flex items-center justify-center gap-1">
                                    {isPausedAudio ? (
                                        <div className="text-xs font-mono text-white/50 tracking-widest">PAUSED</div>
                                    ) : (
                                        audioData.map((height, i) => (
                                            <motion.div key={i} animate={{ height }} transition={{ duration: 0.1, ease: "linear" }} className="w-1 bg-[#D4AF37] rounded-full" />
                                        ))
                                    )}
                                </div>
                                <div className="text-xs font-mono text-[#D4AF37] tracking-widest">{formatTime(currentAudioTime)}</div>

                                <div className="flex items-center gap-8 mt-4">
                                    <button onClick={pauseResumeAudio} className="group flex items-center gap-3 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-white hover:opacity-80 transition-opacity">
                                        {isPausedAudio ? "Resume" : "Pause"}
                                    </button>
                                    <button onClick={stopAudioRecording} className="group flex items-center gap-3 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-white hover:opacity-80 transition-opacity">
                                        Done
                                        <div className="w-8 h-px bg-white group-hover:w-12 transition-all duration-300" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div key="audio-library-view" className="w-full h-full flex flex-col pt-4">
                                <div className="text-center mb-6 flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Voice Library</span>
                                    <button onClick={startAudioRecording} className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white hover:text-[#D4AF37] transition-colors">
                                        <Plus className="w-3 h-3" />
                                        New Recording
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-3">
                                    {voiceNotes.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center opacity-50">
                                            <Mic className="w-8 h-8 text-white/20 mb-3" />
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest text-center">No Voice Notes Yet</p>
                                            <button onClick={startAudioRecording} className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors text-white">Start Recording</button>
                                        </div>
                                    ) : (
                                        voiceNotes.map(note => (
                                            <div key={note.id} className="relative bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col gap-2 group transition-colors hover:bg-white/10">
                                                <div className="flex items-center justify-between relative z-10">
                                                    <div className="relative">
                                                        <input
                                                            value={note.name}
                                                            onChange={(e) => renameVoiceNote(note.id, e.target.value)}
                                                            className="bg-transparent text-xs text-white border-b border-transparent focus:border-white/20 outline-none w-48 transition-colors font-medium"
                                                            placeholder="Name this note..."
                                                            onClick={dismissGuidance}
                                                        />
                                                        {/* Guidance Tooltip */}
                                                        <AnimatePresence>
                                                            {showGuidance && voiceNotes[0].id === note.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 5 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0 }}
                                                                    className="absolute top-full left-0 mt-2 w-48 p-2 bg-[#D4AF37] text-black text-[10px] rounded shadow-lg z-50 pointer-events-none"
                                                                >
                                                                    <div className="absolute -top-1 left-4 w-2 h-2 bg-[#D4AF37] rotate-45" />
                                                                    You can customize the name of the content
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                    <button onClick={() => deleteVoiceNote(note.id)} className="text-white/20 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => playNote(note)} className="p-2 bg-white/10 rounded-full text-[#D4AF37] hover:bg-white/20 transition-colors shrink-0">
                                                        {playingNoteId === note.id && !audioPlayerRef.current?.paused ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                                                    </button>
                                                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden relative">
                                                        {playingNoteId === note.id && (
                                                            <motion.div className="absolute top-0 left-0 h-full bg-[#D4AF37]" style={{ width: `${(playbackTime / playbackDuration) * 100}%` }} transition={{ ease: "linear", duration: 0.1 }} />
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-mono text-white/50 w-12 text-right">
                                                        {playingNoteId === note.id ? formatTime(playbackTime) : formatTime(note.duration)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* VIDEO MODE */}
                {mode === 'video' && (
                    <div className="w-full h-full flex flex-col items-center animate-in fade-in zoom-in duration-300">

                        {/* 1. Recording View (Live Camera) */}
                        {videoViewMode === 'recording' && (
                            <div key="video-recording-view" className="w-full h-full flex flex-col items-center">
                                {/* Recording Preview - Ensure this is visible */}
                                <div className="flex-1 w-full relative bg-black rounded-lg overflow-hidden border border-white/10 mb-20">
                                    <video ref={videoPreviewRef} className="w-full h-full object-cover" autoPlay playsInline muted />

                                    {isRecordingVideo ? (
                                        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-mono text-white shadow-black drop-shadow-md">{formatTime(videoTime)}</span>
                                        </div>
                                    ) : (
                                        // "Ready" state overlay before click
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="px-4 py-2 bg-black/50 rounded-full backdrop-blur text-[10px] uppercase tracking-widest text-white/80">Ready to Record</div>
                                        </div>
                                    )}
                                </div>

                                {/* Controls */}
                                <div className="w-full h-20 bg-black/80 backdrop-blur-md absolute bottom-0 left-0 flex items-center justify-between px-8 border-t border-white/10">
                                    <div className="flex-1" />
                                    <div className="flex items-center gap-8">
                                        {isRecordingVideo ? (
                                            <>
                                                <button onClick={pauseResumeVideo} className="group flex items-center gap-3 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-white hover:opacity-80 transition-opacity">
                                                    {isPausedVideo ? "Resume" : "Pause"}
                                                </button>
                                                <button onClick={stopVideoRecording} className="group flex items-center gap-3 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-white hover:opacity-80 transition-opacity">
                                                    Done
                                                    <div className="w-8 h-px bg-white group-hover:w-12 transition-all duration-300" />
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={startVideoRecording} className="group flex items-center gap-3 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-white hover:opacity-80 transition-opacity">
                                                Record Video
                                                <div className="w-8 h-px bg-white group-hover:w-12 transition-all duration-300" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-1" />
                                </div>
                            </div>
                        )}

                        {/* 2. Playback View (Full Screen Player) */}
                        {videoViewMode === 'playback' && playingVideoId && (
                            <div key="video-playback-view" className="absolute inset-0 z-20 bg-black flex flex-col">
                                {videoNotes.map(n => n.id === playingVideoId && (
                                    <div key={n.id} className="w-full h-full flex flex-col relative">
                                        {/* Note: Back button header handles the navigation back to library */}
                                        <video src={n.url} controls className="w-full h-full object-contain" autoPlay />
                                        <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none">
                                            <span className="text-sm font-medium text-white shadow-black drop-shadow-md">{n.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 3. Library View (Default List) */}
                        {videoViewMode === 'library' && (
                            <div key="video-library-view" className="w-full h-full flex flex-col pt-4">
                                <div className="text-center mb-6 flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Video Library</span>
                                    <button onClick={enterVideoRecordingMode} className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white hover:text-[#D4AF37] transition-colors">
                                        <Plus className="w-3 h-3" />
                                        New Recording
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-3">
                                    {videoNotes.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center opacity-50">
                                            <Video className="w-8 h-8 text-white/20 mb-3" />
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest text-center">No Video Notes Yet</p>
                                            <button onClick={enterVideoRecordingMode} className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors text-white">Start Recording</button>
                                        </div>
                                    ) : (
                                        videoNotes.map(note => (
                                            <div key={note.id} className="relative bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col gap-2 group transition-colors hover:bg-white/10">
                                                <div className="flex items-center justify-between relative z-10">
                                                    <div className="relative">
                                                        <input
                                                            value={note.name}
                                                            onChange={(e) => renameVideoNote(note.id, e.target.value)}
                                                            className="bg-transparent text-xs text-white border-b border-transparent focus:border-white/20 outline-none w-48 transition-colors font-medium"
                                                            placeholder="Name this note..."
                                                            onClick={dismissGuidance}
                                                        />
                                                        {/* Guidance Tooltip (re-use logic) */}
                                                        <AnimatePresence>
                                                            {showGuidance && videoNotes[0].id === note.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 5 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0 }}
                                                                    className="absolute top-full left-0 mt-2 w-48 p-2 bg-[#D4AF37] text-black text-[10px] rounded shadow-lg z-50 pointer-events-none"
                                                                >
                                                                    <div className="absolute -top-1 left-4 w-2 h-2 bg-[#D4AF37] rotate-45" />
                                                                    You can customize the name of the content
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                    <button onClick={() => deleteVideoNote(note.id)} className="text-white/20 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setPlayingVideoId(note.id);
                                                            setVideoViewMode('playback');
                                                        }}
                                                        className="p-2 bg-white/10 rounded-full text-[#D4AF37] hover:bg-white/20 transition-colors shrink-0"
                                                    >
                                                        <MonitorPlay className="w-3 h-3" />
                                                    </button>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                            <div className="h-full w-full bg-white/20" />
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-white/50 w-12 text-right">
                                                        {formatTime(note.duration)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ATTACHMENTS MODE */}
                {mode === 'attachments' && (
                    <div className="w-full h-full flex flex-col pt-4 animate-in fade-in zoom-in duration-300">
                        <div className="text-center mb-6 flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Attachments</span>
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white hover:text-[#D4AF37] transition-colors">
                                <Plus className="w-3 h-3" />
                                Add New
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-3">
                            <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} />

                            {attachments.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-50">
                                    <FileText className="w-8 h-8 text-white/20 mb-3" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest text-center">No Records Yet</p>
                                    <button onClick={() => fileInputRef.current?.click()} className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors text-white">Upload Files</button>
                                </div>
                            ) : (
                                attachments.map(att => (
                                    <div key={att.id} className="group relative bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col gap-2 group transition-colors hover:bg-white/10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="p-2 bg-white/5 rounded text-white/50 shrink-0">
                                                    {att.file.type.startsWith('image') ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                </div>
                                                <div className="flex flex-col relative w-full">
                                                    <input
                                                        value={att.name}
                                                        onChange={(e) => renameAttachment(att.id, e.target.value)}
                                                        className="bg-transparent text-xs text-white border-b border-transparent focus:border-white/20 outline-none w-full transition-colors font-medium"
                                                        placeholder="Name this record..."
                                                        onClick={dismissGuidance}
                                                    />
                                                    {/* Guidance Tooltip (re-use logic) for first attachment */}
                                                    <AnimatePresence>
                                                        {showGuidance && attachments[0].id === att.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0 }}
                                                                className="absolute top-full left-0 mt-2 w-48 p-2 bg-[#D4AF37] text-black text-[10px] rounded shadow-lg z-50 pointer-events-none"
                                                            >
                                                                <div className="absolute -top-1 left-4 w-2 h-2 bg-[#D4AF37] rotate-45" />
                                                                You can customize the name of the content
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                    <p className="text-[10px] text-white/30 uppercase mt-0.5">{(att.file.size / 1024).toFixed(0)} KB</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeAttachment(att.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors shrink-0">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
