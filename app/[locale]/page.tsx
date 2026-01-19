import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1">
        <Hero />
      </div>
      <Footer />
    </main>
  );
}
