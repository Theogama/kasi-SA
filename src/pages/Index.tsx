import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeBanner from "@/components/MarqueeBanner";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <MarqueeBanner />
      <ProductGrid />
      <MarqueeBanner text="BOLD GRAPHICS • RAW CULTURE • UNAPOLOGETIC STYLE • MADE FOR THE STREETS • " reverse />
      <Footer />
    </div>
  );
};

export default Index;
