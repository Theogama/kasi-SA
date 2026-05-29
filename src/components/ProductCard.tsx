import { useState, type MouseEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  frontImage: string;
  backImage: string;
  color?: string;
  stockQuantity?: number;
}

const ProductCard = ({ id, name, price, frontImage, backImage, stockQuantity = 0 }: ProductCardProps) => {
  const [showBack, setShowBack] = useState(false);

  const toggleImage = () => setShowBack((prev) => !prev);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (stockQuantity <= 0) {
      toast.error(`${name} is currently out of stock`);
      return;
    }

    addToCart({
      id,
      name,
      price,
      frontImage,
      backImage,
    });

    toast.success(`${name} added to cart`, {
      description: `${price} — 1 item`,
      icon: <Check size={16} />,
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
      duration: 3000,
    });
  };

  return (
    <Link to={`/product/${id}`}>
      <div className="group cursor-pointer h-full flex flex-col">
        {/* Grid Background Container with Zoom */}
        <div
          className="aspect-[3/4] bg-secondary flex items-center justify-center mb-3 sm:mb-4 overflow-hidden rounded-xl relative border border-border/50"
          onMouseEnter={() => setShowBack(true)}
          onMouseLeave={() => setShowBack(false)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleImage();
          }}
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
          disabled={stockQuantity <= 0}
        >
          <ShoppingCart size={16} className="mr-1.5 sm:mr-2 shrink-0" />
          <span className="truncate">{stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}</span>
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;
