"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, Feather, Lock, Globe, Clock, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white relative font-sans overflow-x-hidden">
            {/* Background Video (Reused for consistency) */}
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
            <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-0" />

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32 space-y-32">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center space-y-6"
                >
                    <p className="text-white/50 uppercase tracking-[0.2em] text-sm">The Manifesto</p>
                    <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight">
                        The Afterword <br />
                        <span className="text-white/40 italic text-3xl md:text-5xl block mt-4 font-serif">Because "Goodbye" Shouldn't Be An Accident.</span>
                    </h1>
                </motion.header>


                {/* Section 1: Philosophy */}
                <Section title="The Philosophy" subtitle="The Unfinished Symphony.">
                    <p>
                        We spend our entire lives curating our narrative. We archive our photos, we meticulously organize our careers, and we secure our homes. We plan for weddings five years out and retirement thirty years away. Yet, for the one certainty that awaits us all, we often leave nothing but silence.
                    </p>
                    <p>
                        In the digital age, passing away is no longer just physical; it is administrative. It is chaotic. It is a sudden loss of access to the memories, assets, and words that defined you.
                    </p>
                    <p>
                        We built Afterword because we believe the final chapter of your life shouldn't be written by a lawyer, or guessed at by a grieving relative. It should be written by you.
                    </p>
                </Section>


                {/* Section 2: Capabilities */}
                <Section title="The Capabilities" subtitle="More Than Just Text.">
                    <p>
                        Emotion is not just ink on paper. It is the sound of a laugh, the look in an eye, the memory of a face. Afterword is built to handle the full spectrum of your legacy.
                    </p>
                    <ul className="space-y-4 pl-4 border-l border-white/20 my-8">
                        <FeatureItem title="The Voice" desc="Record a final lullaby, a joke, or a piece of advice." />
                        <FeatureItem title="The Vision" desc="Upload video messages for specific milestones or simple goodbyes." />
                        <FeatureItem title="The Archives" desc="Attach photos, documents, and digital keys." />
                    </ul>
                    <p>
                        You can assign these to as many people as you wish. Whether it is one final letter to your partner or fifty individual notes to every friend you’ve ever made, the capacity is yours to define.
                    </p>
                </Section>


                {/* Section 3: Promise */}
                <Section title="The Promise" subtitle="The Relentless Delivery Protocol.">
                    <p>
                        We are not just an automated email server. We are your digital executors.
                    </p>
                    <p>
                        Most systems fire an email into the void and hope it lands. We do not hope. We verify. Our system tracks every single dispatch—email or SMS. We know if a message was opened, and more importantly, we know if it wasn't.
                    </p>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 my-6">
                        <h4 className="flex items-center gap-2 text-lg font-medium text-white mb-2">
                            <ShieldCheck className="w-5 h-5 text-white/80" /> The "Priority" Safety Net
                        </h4>
                        <p className="text-white/70 text-sm leading-relaxed">
                            If an email bounces, a phone number is disconnected, or a message remains unopened, our system flags it as "Priority Status." At this stage, automation ends, and humanity begins. Our team initiates a manual protocol to locate your intended beneficiary and ensure they receive what you left for them. We do not stop until the message is delivered.
                        </p>
                    </div>
                </Section>


                {/* Section 4: Mechanism */}
                <Section title="The Mechanism" subtitle="How It Works: The Dead Man’s Switch.">
                    <p className="mb-8">The logic is simple, brutal, and effective.</p>
                    <div className="space-y-6">
                        <Step number="01" title="You Write" desc="You draft your messages today, while you are sound of mind and heart." />
                        <Step number="02" title="We Verify" desc="Our system periodically checks for your presence—a pulse in the digital void." />
                        <Step number="03" title="We Wait" desc="If you miss a check-in, and your trusted verifiers confirm the silence, the timer begins." />
                        <Step number="04" title="We Release" desc="Once the condition is met, the vault opens." />
                    </div>
                </Section>


                {/* Section 5: Guarantee */}
                <Section title="The Swiss Guarantee" subtitle="Why Switzerland?">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <p>
                                Trust is not a vibe; in our world, it is geography.
                            </p>
                            <p className="mt-4">
                                We are headquartered in Switzerland for a reason. Your data is protected by the strictest privacy laws on Earth.
                            </p>
                            <p className="mt-4 font-serif text-xl italic text-white/90">
                                Your secrets die with you—unless you choose to share them.
                            </p>
                        </div>
                        <div className="shrink-0 p-6 bg-white/5 rounded-full border border-white/10">
                            <img src="/images/swiss-cross.svg" alt="Swiss Made" className="w-16 h-16 opacity-50 grayscale hover:grayscale-0 transition-all" onError={(e) => e.currentTarget.style.display = 'none'} />
                            {/* Fallback Icon if image missing */}
                            <Globe className="w-16 h-16 text-white/20" />
                        </div>
                    </div>
                </Section>


                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center py-20 border-t border-white/10"
                >
                    <h2 className="text-4xl md:text-5xl font-light mb-6">Don't Leave Them Guessing.</h2>
                    <p className="text-xl text-white/60 font-light max-w-2xl mx-auto mb-10">
                        It takes 5 minutes to secure a lifetime of memories. The cost of a coffee for peace of mind forever.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        START YOUR LEGACY
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

            </div>
        </main>
    );
}

function Section({ title, subtitle, children }: { title: string, subtitle: string, children: React.ReactNode }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="group"
        >
            <div className="flex items-baseline gap-4 mb-6">
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">{title}</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif text-white mb-6 leading-tight">{subtitle}</h3>
            <div className="text-lg text-white/70 font-light leading-relaxed space-y-6">
                {children}
            </div>
        </motion.section>
    );
}

function FeatureItem({ title, desc }: { title: string, desc: string }) {
    return (
        <li className="group">
            <span className="text-white font-medium block mb-1 group-hover:text-primary transition-colors">{title}:</span>
            <span className="text-white/60">{desc}</span>
        </li>
    );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="flex gap-6 items-start group">
            <span className="text-4xl font-thin text-white/20 group-hover:text-white/80 transition-colors font-serif">{number}</span>
            <div>
                <h4 className="text-xl font-medium text-white mb-2">{title}</h4>
                <p className="text-white/60 font-light">{desc}</p>
            </div>
        </div>
    );
}
