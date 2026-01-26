import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
    return {
        title: "Terms of Service | Afterword",
        description: "Legal Agreement and Terms of Service for Afterword."
    };
}

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-black text-neutral-400 font-sans pt-32 pb-24 px-6 md:px-12 selection:bg-white/20">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Terms of Service</h1>
                <p className="text-[10px] md:text-xs text-neutral-600 uppercase tracking-widest mb-16">Last Updated: January 2026</p>

                {/* Content - Static, Small, High Contrast (White/Gray) */}
                <div className="space-y-12 text-xs md:text-sm leading-relaxed">

                    {/* The Handshake */}
                    <section>
                        <h2 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-4 border-b border-white/20 pb-2 w-fit">The Handshake</h2>
                        <h3 className="font-bold text-white mb-2">Acceptance of Terms</h3>
                        <p>
                            By creating an account, accessing, or using the Afterword platform ("The Service"), you acknowledge that you have read, understood, and <strong className="text-white">explicitly agree to be bound</strong> by these Terms of Service. If you do not agree to these terms, you are prohibited from using the Service.
                        </p>
                    </section>

                    {/* The Rules */}
                    <section className="space-y-8">
                        <h2 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-8 border-b border-white/20 pb-2 w-fit">The Rules</h2>

                        {/* 1 */}
                        <div>
                            <h3 className="font-bold text-white mb-1">1. The Service (Definition of Role)</h3>
                            <p>
                                Afterword ("The Company," "We") provides a digital secure message delivery service. <strong className="text-white">We are a courier, not a custodian.</strong> We are not a law firm, an estate planner, or an insurance provider. Our sole function is to store encrypted data and release it based on specific triggers defined by You ("The User").
                            </p>
                        </div>

                        {/* 2 */}
                        <div>
                            <h3 className="font-bold text-white mb-1">2. The Pulse Protocol & Premature Release</h3>
                            <div className="space-y-3">
                                <p>
                                    <strong className="text-white">2.1. The User's Sole Responsibility:</strong><br />
                                    You acknowledge that the "Pulse Check" mechanism relies entirely on your interaction. It is your sole responsibility to maintain an active email address and whitelist <code className="bg-white/10 px-1 py-0.5 rounded text-white">hello@afterword.ch</code>.
                                </p>
                                <p>
                                    <strong className="text-white">2.2. Constructive Consent by Silence:</strong><br />
                                    If you fail to respond to our check-ins and your Keyholder fails to intervene, <strong className="text-white">you explicitly authorize</strong> the system to release your data. We assume no liability for emotional distress or damages caused by a "False Positive" release resulting from your negligence. <strong className="text-white">Your silence is your command to execute.</strong>
                                </p>
                            </div>
                        </div>

                        {/* 3 */}
                        <div>
                            <h3 className="font-bold text-white mb-1">3. Keyholders & Verification Protocol</h3>
                            <div className="space-y-3">
                                <p>
                                    <strong className="text-white">3.1. Designated Authority:</strong><br />
                                    If you designate a Keyholder, you grant them the authority to confirm your status and trigger the release of your Vault.
                                </p>
                                <p>
                                    <strong className="text-white">3.2. The Verification Protocol:</strong><br />
                                    Release of data is not automatic. To protect your legacy, the Keyholder must successfully navigate the Afterword Verification Protocol, which includes:
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-white/70">
                                    <li>Identity authentication via Multi-Factor Authentication (MFA).</li>
                                    <li>Providing the correct answer to the Security Question set by You.</li>
                                    <li>The execution of a binding Keyholder Liability Waiver.</li>
                                </ul>
                                <p>
                                    <strong className="text-white">3.3. Keyholder Malfeasance:</strong><br />
                                    We act strictly upon the successful completion of this protocol in good faith. We are not liable if a Keyholder acts maliciously or provides false information.
                                </p>
                            </div>
                        </div>

                        {/* 4 */}
                        <div>
                            <h3 className="font-bold text-white mb-1">4. Data Integrity & Infrastructure</h3>
                            <div className="space-y-3">
                                <p>
                                    <strong className="text-white">4.1. Infrastructure Partners:</strong><br />
                                    We utilize enterprise-grade, sovereign Swiss infrastructure providers to store your data.
                                </p>
                                <p>
                                    <strong className="text-white">4.2. Liability Limitation:</strong><br />
                                    Physical storage responsibility lies with these Third-Party Providers. We are not liable for data loss or service interruptions caused by hardware malfunctions or "Acts of God" affecting their facilities.
                                </p>
                            </div>
                        </div>

                        {/* 5 */}
                        <div>
                            <h3 className="font-bold text-white mb-1">5. User Content & Security Questions</h3>
                            <div className="space-y-3">
                                <p>
                                    <strong className="text-white">5.1. No Knowledge of Content:</strong><br />
                                    Because your data is encrypted, we cannot see it. We do not moderate content.
                                </p>
                                <p>
                                    <strong className="text-white">5.2. Security Question Responsibility:</strong><br />
                                    You are solely responsible for creating a Security Question that your Keyholder can accurately answer. Afterword cannot "reset" or "bypass" this question. If the answer is lost, the Vault may remain sealed indefinitely.
                                </p>
                                <p>
                                    <strong className="text-white">5.3. Indemnification:</strong><br />
                                    You agree to indemnify Afterword against any claims or damages arising from the content of your messages.
                                </p>
                            </div>
                        </div>

                        {/* 6 */}
                        <div>
                            <h3 className="font-bold text-white mb-1">6. The "Lifetime" Definition</h3>
                            <div className="space-y-3">
                                <p>
                                    <strong className="text-white">6.1. Service Duration:</strong><br />
                                    "Lifetime" access refers to the lifetime of the Service, not the biological lifetime of the User.
                                </p>
                                <p>
                                    <strong className="text-white">6.2. Sunsetting:</strong><br />
                                    In the event that Afterword ceases operations, we guarantee a <strong className="text-white">90-day export window</strong> for you to retrieve your data.
                                </p>
                            </div>
                        </div>

                        {/* 7 */}
                        <div>
                            <h3 className="font-bold text-white mb-1">7. Governing Law</h3>
                            <p>
                                These Terms are governed by the laws of <strong className="text-white">Switzerland</strong>. Any disputes shall be resolved exclusively in the courts of <strong className="text-white">Switzerland</strong>. You waive any right to participate in a class-action lawsuit.
                            </p>
                        </div>
                    </section>

                    {/* Document Footer Removed as per request */}
                </div>
            </div>
        </main>
    );
}
