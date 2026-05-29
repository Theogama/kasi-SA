import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { product, loading, error } = useProduct(productId);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showBack, setShowBack] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-navbar pb-16 sm:pb-20">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl font-heading mb-4">Loading product...</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-navbar pb-16 sm:pb-20">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-heading mb-4">Product Not Found</h1>
            {error && <p className="text-sm text-muted-foreground">{error}</p>}
            <Button onClick={() => navigate("/")} className="mt-4">
              Back to Shop
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size", {
        description: "Choose your preferred size before adding to cart.",
        icon: <AlertCircle size={16} />,
        duration: 3000,
      });
      return;
    }

    if (quantity > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} item(s) in stock`);
      return;
    }

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.priceLabel,
        frontImage: product.frontImage,
        backImage: product.backImage,
        size: selectedSize,
      },
      quantity
    );

    setAddedToCart(true);
    toast.success(`${product.name} added to cart`, {
      description: `Size: ${selectedSize} — Qty: ${quantity} — ${product.priceLabel}`,
      icon: <Check size={16} />,
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
      duration: 4000,
    });

    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-navbar pb-16 sm:pb-20">
        <div className="container mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft size={16} />
            Back to Shop
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
            {/* Image Section */}
            <div className="flex flex-col gap-4">
              <div
                className="aspect-[3/4] bg-secondary flex items-center justify-center rounded-lg overflow-hidden cursor-pointer relative"
                onMouseEnter={() => setShowBack(true)}
                onMouseLeave={() => setShowBack(false)}
              >
                <img
                  src={showBack ? product.backImage : product.frontImage}
                  alt={product.name}
                  className="w-[70%] object-contain transition-transform duration-700 hover:scale-110"
                />
                <span className="absolute top-4 right-4 bg-foreground text-background px-3 py-1 rounded text-xs font-medium">
                  {showBack ? "Back View" : "Front View"}
                </span>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Hover or tap to see back view
              </p>
            </div>

            {/* Details Section */}
            <div>
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-2">
                {product.color}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-4 break-words">{product.name}</h1>
              <p className="text-xl sm:text-2xl font-heading mb-6">{product.priceLabel}</p>

              <p className="text-muted-foreground mb-8">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-8">
                <label className="text-sm font-medium mb-4 block">Select Size</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 border rounded-lg font-medium text-sm transition-all ${selectedSize === size
                          ? "bg-foreground text-background border-foreground"
                          : "border-border hover:border-foreground"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-8">
                <label className="text-sm font-medium mb-4 block">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-8">
                {product.inStock ? (
                  <p className="text-sm text-green-600 font-medium">✓ In Stock ({product.stockQuantity})</p>
                ) : (
                  <p className="text-sm text-destructive font-medium">Out of Stock</p>
                )}
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="w-full mb-4 text-base"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart size={20} className="mr-2" />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </Button>

              {/* Product Details */}
              <div className="border-t border-border pt-8">
                <h3 className="text-sm font-medium mb-4">Product Details</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <span className="text-foreground mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
