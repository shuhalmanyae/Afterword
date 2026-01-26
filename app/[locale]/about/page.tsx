"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link } from "@/i18n/routing";
import {
    ArrowRight,
    Feather,
    Aperture,
    Fingerprint,
    AudioWaveform,
    Shield,
    Lock,
    Key,
    Database,
    FileText,
    Server,
    Smartphone,
    Plus
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white relative font-sans overflow-x-hidden selection:bg-white/20">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="fixed inset-0 w-full h-full object-cover z-0 opacity-40"
            >
                <source src="/videos/background.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="fixed inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black z-0" />

            {/* Content Container - Single Column Editorial Layout */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 md:py-48 space-y-32 md:space-y-48">

                {/* 1. Hero Section */}
                <motion.header
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center space-y-8 min-h-[40vh] flex flex-col justify-center"
                >
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-6xl md:text-9xl font-serif tracking-tight leading-none mix-blend-overlay"
                    >
                        The Manifesto
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl md:text-3xl text-white/60 font-light italic font-serif"
                    >
                        Because "Goodbye" Shouldn't Be An Accident.
                    </motion.p>
                </motion.header>

                {/* 2. Section: The Philosophy */}
                <Section className="max-w-4xl mx-auto text-center">
                    <span className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase mb-4 block">The Philosophy</span>
                    <h2 className="text-4xl md:text-5xl font-serif mb-8">The Unfinished Symphony.</h2>
                    <div className="space-y-6 text-lg md:text-xl text-white/80 font-light leading-relaxed">
                        <p>
                            We spend our entire lives curating our narrative. We archive our photos, we meticulously organize our careers, and we secure our homes. Yet, for the one certainty that awaits us all, we often leave nothing but silence.
                        </p>
                        <p>
                            In the digital age, passing away is no longer just physical; it is administrative. It is chaotic.
                        </p>
                        <p className="border-l-2 border-white/20 pl-6 italic text-white/90 my-8">
                            We built Afterword because we believe the final chapter of your life shouldn't be written by a lawyer, or guessed at by a grieving relative. <strong className="text-white not-italic font-medium">It should be written by you.</strong>
                        </p>
                    </div>
                </Section>

                {/* 3. Section: The Capabilities (4-Column Grid) */}
                <Section>
                    <h2 className="text-4xl md:text-5xl font-serif mb-12 text-center">More Than Just Text.</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 px-4 md:px-0">
                        <CapabilityCard
                            icon={<Feather className="w-8 h-8" />}
                            title="The Written Word"
                            desc="Compose a final love letter, a daily journal, or the secrets you kept hidden."
                            delay={0}
                        />
                        <CapabilityCard
                            icon={<AudioWaveform className="w-8 h-8" />}
                            title="The Voice"
                            desc="Record a final lullaby, a shared inside joke, or a piece of timeless advice."
                            delay={0.1}
                        />
                        <CapabilityCard
                            icon={<Aperture className="w-8 h-8" />}
                            title="The Vision"
                            desc="Upload video messages for specific milestones or simple goodbyes."
                            delay={0.2}
                        />
                        <CapabilityCard
                            icon={<Fingerprint className="w-8 h-8" />}
                            title="The Archives"
                            desc="Attach photos, documents, and digital keys."
                            delay={0.3}
                        />
                    </div>

                    {/* Fixed Note: Centered text paragraph */}
                    <p className="text-center text-white/60 text-lg md:text-xl italic font-serif max-w-2xl mx-auto">
                        "You can assign these to as many people as you wish. The capacity is yours to define."
                    </p>
                </Section>

                {/* 4. Section: The Code of Honor (Full Bleed Swiss Typographic) */}
                <Section className="w-screen relative left-1/2 -translate-x-1/2">
                    <div className="bg-white text-black py-32 md:py-48 px-6 flex flex-col items-center justify-center text-center">
                        <h2 className="text-6xl md:text-9xl font-sans font-black tracking-tighter leading-[0.9] uppercase mb-12 max-w-7xl mx-auto">
                            We are the Postman,<br />not the Spy.
                        </h2>
                        <div className="max-w-3xl mx-auto space-y-6 text-xl md:text-3xl font-sans font-medium leading-tight">
                            <p>
                                Think of us like a Swiss bank courier with a locked briefcase. We verify the destination, we protect the cargo, but we never see what is inside.
                            </p>
                            <p className="pt-8 opacity-60 text-lg md:text-xl font-normal">
                                We carry the legacy. You hold the key.
                            </p>
                        </div>
                    </div>
                </Section>

                {/* 5. Section: The Mechanism (Compact & Precise + Embedded Safety Net) */}
                <MechanismSection />

                {/* 6. Section: The Swiss Guarantee */}
                <Section>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-serif mb-8">Why Switzerland?</h2>
                            <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed">
                                Trust is not a vibe; in our world, it is geography. Your data is protected by the strictest privacy laws on Earth. Your secrets die with you—unless you choose to share them.
                            </p>
                        </div>
                        <div className="relative h-[400px] w-full flex items-center justify-center [mask-image:radial-gradient(circle_at_center,black_30%,transparent_70%)]">
                            <Image
                                src="/images/about/swiss_mountains.jpg"
                                alt="Swiss Mountains"
                                fill
                                className="object-cover opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-[1.5s]"
                            />
                        </div>
                    </div>
                </Section>

                {/* 7. Footer CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center pt-24 pb-32 border-t border-white/10"
                >
                    <p className="text-3xl md:text-5xl text-white/90 font-serif italic mb-16 leading-tight max-w-4xl mx-auto">
                        Don't leave them guessing. Put a smile on their face—even when you can no longer be there to see it.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-full font-bold tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.4)]"
                    >
                        START YOUR LEGACY
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </motion.div>

            </div>
        </main>
    );
}

// Sub-components

function Section({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.section>
    );
}

function CapabilityCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8 }}
            className="group relative p-8 rounded-2xl hover:bg-white/5 transition-all duration-500 border border-transparent hover:border-white/10 h-full flex flex-col"
        >
            {/* Subtle glow behind icon on hover */}
            <div className="absolute top-8 left-8 w-12 h-12 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="text-white/80 mb-6 group-hover:text-white group-hover:scale-110 transition-all duration-300 w-fit relative z-10">{icon}</div>
            <h3 className="text-2xl font-serif text-white mb-3 relative z-10">{title}</h3>
            <p className="text-white/50 text-sm leading-relaxed relative z-10 group-hover:text-white/80 transition-colors flex-grow">{desc}</p>
        </motion.div>
    );
}

// Security Pattern Icons Component
function SecurityDoodleBackground() {
    const icons = [
        Lock, Key, Shield, Database, FileText, Server, Smartphone, Fingerprint, Aperture
    ];

    // Create a 6x6 grid of scattered icons
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.03]">
            <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-8 p-8">
                {Array.from({ length: 36 }).map((_, i) => {
                    const Icon = icons[i % icons.length];
                    // Deterministic values based on index to prevent hydration mismatch
                    const randomRotation = ((i * 13) % 30) - 15;
                    const randomScale = 0.8 + ((i * 7) % 50) / 100;

                    return (
                        <div key={i} className="flex items-center justify-center">
                            <Icon
                                style={{
                                    transform: `rotate(${randomRotation}deg) scale(${randomScale})`
                                }}
                                className="w-8 h-8 md:w-12 md:h-12 text-white"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Improved Mechanism Section with Swiss Circuit/Maze Layout - Compact & Precise
function MechanismSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 70%", "end center"]
    });

    // Path drawing animation - smooth and responsive
    const pathLength = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

    return (
        <Section className="relative py-20 md:py-32">
            {/* Security Doodle Background (WhatsApp Style) */}
            <SecurityDoodleBackground />

            {/* Swiss Grid Background Overlay (Subtle) */}
            <div className="absolute inset-x-0 inset-y-10 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] z-0" />

            <div className="relative z-10 text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-serif mb-4">A System That Waits for Silence.</h2>
                <p className="text-xl text-white/50 italic font-serif">How we distinguish between a busy life and a final goodbye.</p>
            </div>

            {/* AGGRESSIVE SQUEEZE: Height 700px */}
            <div ref={containerRef} className="relative min-h-[600px] md:h-[700px] max-w-5xl mx-auto z-10 mb-24 md:mb-12">
                {/* DESKTOP MAZE SVG - ALIGNED */}
                <div className="hidden md:block absolute inset-0 w-full h-full text-white/20">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* The Base Track */}
                        <motion.path
                            d="M50 0 V20 H40 V35 H60 V65 H40 V80 H50 V100"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.3"
                            vectorEffect="non-scaling-stroke"
                        />
                        {/* The Active Signal */}
                        <motion.path
                            d="M50 0 V20 H40 V35 H60 V65 H40 V80 H50 V100"
                            fill="none"
                            stroke="white"
                            strokeWidth="1.5"
                            vectorEffect="non-scaling-stroke"
                            style={{ pathLength }}
                        />
                    </svg>
                </div>

                {/* MOBILE LINE (Simplified) */}
                <div className="md:hidden absolute left-6 top-0 bottom-0 w-[2px] bg-white/10">
                    <motion.div style={{ scaleY: pathLength }} className="absolute inset-0 bg-white origin-top" />
                </div>

                {/* STEPS - Alternating Layout with Precise Grid Alignment */}

                {/* Step 1: Left Top 20% */}
                <div className="relative md:absolute md:top-[20%] md:left-0 md:w-[40%] md:-translate-y-1/2 pl-16 md:pl-0 md:pr-12 md:text-right mb-16 md:mb-0 group bg-black/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-xl md:rounded-none border border-white/10 md:border-none">
                    <span className="hidden md:block absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-black border border-white rounded-full z-20 shadow-[0_0_15px_white]" />
                    <h3 className="text-3xl font-serif text-white mb-2">The Pulse Check.</h3>
                    <p className="text-white/70 font-light leading-relaxed">You set the tempo (Weekly, Monthly or yearly). We send a secure notification. You click "I'm here." The timer resets.</p>
                </div>

                {/* Step 2: Right Top 50% */}
                <div className="relative md:absolute md:top-[50%] md:right-0 md:w-[40%] md:-translate-y-1/2 pl-16 md:pl-12 text-left mb-16 md:mb-0 group bg-black/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-xl md:rounded-none border border-white/10 md:border-none">
                    <span className="hidden md:block absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-black border border-white rounded-full z-20 shadow-[0_0_15px_white]" />
                    <h3 className="text-3xl font-serif text-white mb-2">The Verification.</h3>
                    <p className="text-white/70 font-light leading-relaxed">
                        If you miss a beat, we wait. Once the "Grace Period" expires, we reach out to your designated Emergency Contact.
                    </p>

                    {/* Strict Mode - Transparent/Ghosted Side Card (Desktop) */}
                    <div className="hidden md:block absolute right-[105%] top-1/2 -translate-y-1/2 w-[220px] text-left pr-6">
                        <div className="relative bg-white/[0.02] border border-white/10 p-4 rounded-lg backdrop-blur-sm group-hover:bg-white/5 transition-colors">
                            <strong className="block text-red-300/90 text-xs font-serif tracking-widest mb-2 italic">Optional Strict Mode</strong>
                            <p className="text-xs text-white/60 font-serif italic leading-relaxed">Upload valid Death Certificate required from a trusted contact.</p>
                            {/* Connector Line */}
                            <div className="absolute top-1/2 right-[-24px] w-[24px] h-[1px] bg-white/10"></div>
                            <div className="absolute top-1/2 right-[-2px] w-1 h-1 rounded-full bg-white/30"></div>
                        </div>
                    </div>
                    {/* Strict Mode (Mobile) */}
                    <div className="md:hidden mt-4 pt-4 border-t border-white/10">
                        <strong className="block text-red-300 text-xs uppercase tracking-widest mb-1">Optional Strict Mode</strong>
                        <p className="text-xs text-white/70">Upload valid Death Certificate required from a trusted contact.</p>
                    </div>
                </div>

                {/* Step 3: Left Top 80% */}
                <div className="relative md:absolute md:top-[80%] md:left-0 md:w-[40%] md:-translate-y-1/2 pl-16 md:pl-0 md:pr-12 md:text-left bg-black/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-xl md:rounded-none border border-white/10 md:border-none">
                    {/* Dot on the connection point (Right edge) */}
                    <span className="hidden md:block absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-black border border-white rounded-full z-20 shadow-[0_0_15px_white]" />

                    <h3 className="text-3xl font-serif text-white mb-2">The Precision Release.</h3>
                    <p className="text-white/70 font-light leading-relaxed">The Sovereign Protocol activates. Smart Identification routes your video to your wife, your crypto keys to your son, and your public journal to your memorial page. Zero mix-ups.</p>
                </div>
            </div>

            {/* The "Priority" Safety Net - Embedded Continuation */}
            <div className="max-w-xl mx-auto mt-0 md:-mt-12 relative z-10 px-6">
                <div className="relative bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-2xl backdrop-blur-sm text-center overflow-hidden group">
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Swiss Symbol (Bold Plus) */}
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/10 rounded-full group-hover:border-white/30 transition-colors bg-white/[0.02]">
                        <Plus className="w-6 h-6 text-white/80" strokeWidth={3} />
                    </div>

                    <h3 className="text-2xl font-serif text-white mb-4 relative z-10">The "Priority" Safety Net</h3>
                    <p className="text-lg md:text-xl text-white/70 font-serif italic leading-relaxed relative z-10 tracking-wide">
                        If an email bounces or remains unopened, our system flags it as "Priority Status." Our team initiates a manual protocol to locate your beneficiary. We do not stop until the message is delivered.
                    </p>
                </div>
            </div>
        </Section>
    );
}
