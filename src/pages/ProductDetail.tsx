import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import teeBlackFront from "@/assets/tee-black-front.png";
import teeBlackBack from "@/assets/tee-black-back.png";
import teeWhiteFront from "@/assets/tee-white-front.png";
import teeWhiteBack from "@/assets/tee-white-back.png";
import kasiWorldTeeFront from "@/assets/kasi-world-tee-front.png";
import kasiWorldTeeBack from "@/assets/kasi-world-tee-back.png";

const products: Record<string, any> = {
  "tee-1": {
    id: "tee-1",
    name: "Muscle Car Tee — Black",
    price: "R450.00",
    frontImage: teeBlackFront,
    backImage: teeBlackBack,
    color: "Black",
    description:
      "Classic black tee featuring our iconic muscle car design. Made from premium cotton blend for comfort and durability.",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    inStock: true,
    details: [
      "100% Premium Cotton",
      "Oversized Fit",
      "Machine Washable",
      "High-Quality Print",
      "Comfortable & Breathable",
    ],
  },
  "tee-2": {
    id: "tee-2",
    name: "Muscle Car Tee — White",
    price: "R450.00",
    frontImage: teeWhiteFront,
    backImage: teeWhiteBack,
    color: "White",
    description:
      "Clean white tee with our signature muscle car design. Perfect for any occasion, versatile and timeless.",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    inStock: true,
    details: [
      "100% Premium Cotton",
      "Oversized Fit",
      "Machine Washable",
      "High-Quality Print",
      "Comfortable & Breathable",
    ],
  },
  "tee-3": {
    id: "tee-3",
    name: "Kasi World Tee — Black",
    price: "R450.00",
    frontImage: kasiWorldTeeFront,
    backImage: kasiWorldTeeBack,
    color: "Black",
    imageClassName: "w-[85%] h-[85%]",
    description:
      "Black tee featuring the iconic Kasi From The Kasi To The World design. Made from premium cotton blend for comfort and durability.",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    inStock: true,
    details: [
      "100% Premium Cotton",
      "Oversized Fit",
      "Machine Washable",
      "High-Quality Print",
      "Comfortable & Breathable",
    ],
  },
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showBack, setShowBack] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products[productId || "tee-1"];

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-heading mb-4">Product Not Found</h1>
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
      alert("Please select a size");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: `${product.id}-${selectedSize}`,
        name: product.name,
        price: product.price,
        frontImage: product.frontImage,
        backImage: product.backImage,
        size: selectedSize,
      });
    }

    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-20">
        <div className="container mx-auto px-6">
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
                  className={`${product.imageClassName || 'w-[70%]'} object-contain transition-transform duration-700 hover:scale-110`}
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
              <h1 className="text-4xl md:text-5xl font-heading mb-4">{product.name}</h1>
              <p className="text-2xl font-heading mb-6">{product.price}</p>

              <p className="text-muted-foreground mb-8">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-8">
                <label className="text-sm font-medium mb-4 block">Select Size</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
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
                  <p className="text-sm text-green-600 font-medium">✓ In Stock</p>
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
