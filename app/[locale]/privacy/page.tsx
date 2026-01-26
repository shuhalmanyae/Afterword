"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, ArrowDown } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function PrivacyPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <main ref={containerRef} className="min-h-screen bg-black text-white relative font-sans overflow-x-hidden selection:bg-white/20">
            {/* Background Video - Darker overlay for better contrast with photos */}
            <div className="fixed inset-0 z-[-1]">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-30"
                >
                    <source src="/videos/background.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black" />
            </div>

            <div className="relative z-10">

                {/* --- 1. HERO --- */}
                <HeroSection />

                <div className="max-w-7xl mx-auto px-6 pb-32 space-y-32 md:space-y-48 mt-32 md:mt-48">

                    {/* --- 2. PHILOSOPHY (Image Left, Text Right) --- */}
                    <PhilosophySection />

                    {/* --- 3. SWISS SOVEREIGNTY (Image Right) --- */}
                    <SovereigntySection />

                    {/* --- 4. DIGITAL ARMOR (Image Left) --- */}
                    <ArmorSection />

                    {/* --- 5. COURIER PROMISE (Text Left, Image Right) --- */}
                    <CourierSection />

                </div>
            </div>
        </main>
    );
}

function HeroSection() {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const y = useTransform(scrollY, [0, 300], [0, 50]);

    return (
        <motion.section
            style={{ opacity, y }}
            className="h-[80vh] flex flex-col items-center justify-center text-center px-6"
        >
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-5xl md:text-8xl font-light tracking-tighter mb-8"
            >
                Privacy is the <br />
                <span className="font-serif italic text-white/50">Oxygen of Truth.</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-lg md:text-xl text-white/60 font-light tracking-wide max-w-lg"
            >
                Why we built a vault, not a cloud.
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3], y: [0, 6, 0] }}
                transition={{
                    delay: 1,
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="mt-24"
            >
                <ArrowDown className="w-5 h-5 text-white" />
            </motion.div>
        </motion.section>
    );
}

function PhilosophySection() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Image Left */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1 }}
                className="order-1 relative h-[500px] md:h-[700px] w-full rounded-2xl overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <Image
                    src="/images/privacy/alps.jpg"
                    alt="Swiss Alps"
                    fill
                    className="object-cover opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-[1.5s]"
                />
            </motion.div>

            {/* Text Right */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8 }}
                className="order-2 space-y-8"
            >
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-5xl font-serif leading-tight"
                >
                    To be truly honest, you need to know <span className="text-white/40 italic">no one is watching.</span>
                </motion.h2>
                <div className="space-y-6">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-white/70 font-light leading-relaxed"
                    >
                        True honesty requires a total lack of fear. You cannot leave a genuine legacy if you are worried about who is watching, scanning, or judging. At Afterword, we don't just 'respect' your privacy. We engineered our entire existence to ensure it.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-white font-medium"
                    >
                        We are a sanctuary, not a free data farm.
                    </motion.p>
                </div>
            </motion.div>
        </section>
    );
}

function SovereigntySection() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Text Left */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8 }}
                className="order-2 md:order-1 space-y-8"
            >
                <div className="space-y-4">
                    <span className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase">The Jurisdiction</span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-6xl font-serif leading-none"
                    >
                        Swiss <br />Sovereignty
                    </motion.h2>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/60 text-lg leading-relaxed"
                >
                    We didn't choose Switzerland for the view. We chose it for the law. While the rest of the world treats data like a commodity, Switzerland treats it like a fundamental human right.
                </motion.p>
                <div className="space-y-6 pt-4 border-t border-white/10">
                    <div>
                        <h4 className="text-white font-medium mb-1">The Soil</h4>
                        <p className="text-sm text-white/50">Your data physically lives on sovereign Swiss infrastructure, nestled securely near the Alps. No Silicon Valley clouds.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-1">The Law</h4>
                        <p className="text-sm text-white/50">Protected by the Swiss Federal Act on Data Protection (FADP). Shielded from foreign subpoenas and advertisers.</p>
                    </div>
                </div>
            </motion.div>

            {/* Image Right */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1 }}
                className="order-1 md:order-2 relative h-[500px] md:h-[700px] w-full rounded-2xl overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <Image
                    src="/images/privacy/cabinet.jpg"
                    alt="Swiss Sovereignty"
                    fill
                    className="object-cover opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-[1.5s]"
                />
            </motion.div>
        </section>
    );
}

function ArmorSection() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Image Left */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1 }}
                className="order-1 relative h-[500px] md:h-[700px] w-full rounded-2xl overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <Image
                    src="/images/privacy/digital_armor.jpg"
                    alt="Digital Armor"
                    fill
                    className="object-cover mix-blend-screen opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-[1.5s]"
                />
            </motion.div>

            {/* Text Right */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8 }}
                className="order-2 space-y-8"
            >
                <div className="space-y-4">
                    <span className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase">The Tunnel</span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-serif"
                    >
                        The Digital Armor
                    </motion.h2>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-white font-light italic border-l-2 border-white/30 pl-6"
                >
                    "The Diplomatic Pouch"
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/60 text-lg leading-relaxed"
                >
                    How do we protect your letters? We treat them like diplomatic cargo. From the moment you click 'Secure,' your words travel through an encrypted tunnel directly to our servers.
                    <br /><br />
                    Once they arrive, they are <strong>Encrypted at Rest</strong>. We do not mine your text. We do not train AI on your memories. Your data sits in the dark, silent and secure.
                </motion.p>
            </motion.div>
        </section>
    );
}

function CourierSection() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Text Left */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8 }}
                className="order-2 md:order-1 space-y-8"
            >
                <div className="space-y-4">
                    <span className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase">The Protocol</span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-serif leading-tight"
                    >
                        We are the Postman, <br /> not the Spy.
                    </motion.h2>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/60 text-lg leading-relaxed"
                >
                    In the old days, a bank messenger carried a locked briefcase. He didn't read what was inside; his only job was to get it to the destination safely.
                    <br /><br />
                    That is us.
                </motion.p>
                <div className="pt-12 border-t border-white/10 space-y-8 mt-12">
                    <p className="text-xl text-white/80 font-serif italic leading-relaxed">
                        "If you have nothing to hide, you have nothing to say."
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        SECURE YOUR DATA
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>

            {/* Image Right */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1 }}
                className="order-1 md:order-2 relative h-[400px] md:h-[600px] w-full flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"
            >
                <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-75" />
                <Image
                    src="/images/privacy/server_racks.jpg"
                    alt="Server Racks"
                    fill
                    className="object-cover mix-blend-screen opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-[1.5s]"
                />
            </motion.div>
        </section>
    );
}


