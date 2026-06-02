import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface InfoPageLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function InfoPageLayout({
  eyebrow,
  title,
  description,
  children,
}: InfoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-navbar pb-12 sm:pb-16 border-b border-border">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[10px] sm:text-xs font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-muted-foreground mb-4">
              {eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading mb-4 sm:mb-6">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed px-2 sm:px-0">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">{children}</div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
