import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-4xl space-y-6">
        <header className="border-b border-border pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block size-3 rounded-full bg-primary animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-text-muted font-mono">
                System Online
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mt-1">
              Dynamic Portfolio
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Next.js App Router with Electric Green Dark Palette
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
            >
              Explore Projects
            </Button>
          </div>
        </header>

        {/* Bento Grid Preview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-xl bg-surface border border-border p-6 transition-all hover:border-border-accent">
            <div className="text-xs font-mono text-primary uppercase tracking-wider mb-2">
              Phase 16 Baseline
            </div>
            <h2 className="text-xl font-semibold text-text-primary">
              Modern Minimalist Bento Grid
            </h2>
            <p className="text-sm text-text-muted mt-2">
              Configured with Tailwind CSS v4, custom theme tokens, and shadcn/ui components.
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-border p-6 transition-all hover:border-border-accent">
            <div className="text-xs font-mono text-secondary uppercase tracking-wider mb-2">
              API Connection
            </div>
            <h3 className="text-lg font-semibold text-text-primary">
              Ready for Phase 17
            </h3>
            <p className="text-xs text-text-muted mt-2 font-mono break-all">
              NEXT_PUBLIC_API_URL configured
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
