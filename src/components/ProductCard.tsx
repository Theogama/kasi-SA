import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id?: string;
  name: string;
  price: string;
  frontImage: string;
  backImage: string;
  color?: string;
}

const ProductCard = ({ id = "tee-1", name, price, frontImage, backImage, color = "black" }: ProductCardProps) => {
  const [showBack, setShowBack] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id,
      name,
      price,
      frontImage,
      backImage,
    });
  };

  return (
    <Link to={`/product/${id}`}>
      <div className="group cursor-pointer h-full flex flex-col">
        {/* Grid Background Container with Zoom */}
        <div
          className="aspect-[3/4] bg-secondary flex items-center justify-center mb-4 overflow-hidden rounded-xl relative border border-border/50"
          onMouseEnter={() => setShowBack(true)}
          onMouseLeave={() => setShowBack(false)}
        >
          {/* Grid Pattern Background */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.05)_1px,_transparent_1px),_linear-gradient(0deg,_rgba(0,0,0,0.05)_1px,_transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
          
          {/* Image with Enhanced Zoom */}
          <img
            src={showBack ? backImage : frontImage}
            alt={name}
            className="w-[70%] h-[70%] object-contain transition-transform duration-700 group-hover:scale-125 relative z-10"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-0" />
        </div>
        <h3 className="text-xs font-medium tracking-[0.1em] uppercase line-clamp-2">{name}</h3>
        <p className="text-muted-foreground text-sm mt-1 mb-3">{price}</p>
        <Button
          size="sm"
          variant="outline"
          className="mt-auto w-full group/btn hover:bg-foreground hover:text-background"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;
