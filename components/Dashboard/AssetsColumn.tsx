"use client";

import { Lock, Mic, Video, FileText, Paperclip, Send } from "lucide-react";

export default function AssetsColumn() {
    const assets = [
        { type: "video", title: "For Sarah - 21st Birthday", status: "Secured", date: "Oct 24, 2025" },
        { type: "audio", title: "To my distinct nephews", status: "Draft", date: "Just now" },
        { type: "text", title: "Master Password List", status: "Secured", date: "Sep 12, 2025" },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case "video": return <Video className="w-5 h-5" />;
            case "audio": return <Mic className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    return (
        <div className="flex flex-col h-full p-6 text-white relative">
            {/* Input Area */}
            <div className="mb-10">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Leave a message..."
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl py-4 px-6 pr-32 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button className="p-2 text-white/40 hover:text-white transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-20">
                <h2 className="text-xs font-light tracking-wide text-white/50 uppercase mb-4">Digital Envelopes</h2>

                <div className="grid grid-cols-1 gap-4">
                    {assets.map((asset, i) => (
                        <div key={i} className="group relative p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all hover:bg-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${asset.type === 'video' ? 'bg-indigo-500/10 text-indigo-400' : asset.type === 'audio' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                    {getIcon(asset.type)}
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${asset.status === 'Secured' ? 'bg-white/10 text-white/70' : 'bg-amber-500/10 text-amber-500'}`}>
                                    {asset.status}
                                </div>
                            </div>

                            <h3 className="text-lg font-medium text-white mb-1 group-hover:text-white/90">{asset.title}</h3>
                            <p className="text-xs text-white/30 font-mono">{asset.date}</p>

                            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Lock className="w-4 h-4 text-white/40" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
