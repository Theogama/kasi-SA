import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const Shop = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-navbar">
        <ProductGrid />
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
