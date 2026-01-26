import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col text-foreground">
      <div className="flex-1 flex flex-col">
        <Hero />
      </div>
    </main>
  );
}
