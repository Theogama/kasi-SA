import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { reconcileCartWithDatabase } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useClerk } from "@clerk/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { parsePriceLabel } from "@/lib/products";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, replaceItems, totalPrice } = useCart();
  const { isSignedIn } = useAuth();
  const { openSignIn, openSignUp } = useClerk();
  const navigate = useNavigate();
  useEffect(() => {
    if (items.length === 0) return;

    let active = true;

    (async () => {
      try {
        const result = await reconcileCartWithDatabase(items);
        if (!active || result.removedCount === 0) return;

        replaceItems(result.items);
        toast.error(result.message ?? "Unavailable items were removed from your cart");
      } catch (err) {
        console.warn("Could not verify cart stock:", err);
      }
    })();

    return () => {
      active = false;
    };
    // Verify cart once when opening the cart page (not on every quantity change).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = () => {
    if (isSignedIn) {
      navigate("/checkout");
    } else {
      toast("Sign in to continue", {
        description: "You need an account to proceed to checkout. Sign in or create a new account.",
        icon: <LogIn size={16} />,
        duration: 6000,
        action: {
          label: "Sign In",
          onClick: () => openSignIn({ redirectUrl: "/cart" }),
        },
        cancel: {
          label: "Sign Up",
          onClick: () => openSignUp({ redirectUrl: "/cart" }),
        },
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-navbar pb-16 sm:pb-20">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Let's find something amazing for you.</p>
            <Link to="/">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-navbar pb-16 sm:pb-20">
        <div className="container mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-8 sm:mb-12">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size ?? ""}`}
                    className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-lg hover:border-foreground transition-colors"
                  >
                    <div className="flex gap-4 min-w-0 flex-1">
                    <div className="w-20 h-28 sm:w-24 sm:h-32 bg-secondary flex-shrink-0 rounded-md flex items-center justify-center overflow-hidden">
                      <img
                        src={item.frontImage}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-sm uppercase tracking-[0.1em] line-clamp-2">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{item.price}</p>
                      {item.size && (
                        <p className="text-xs text-muted-foreground mt-2">Size: {item.size}</p>
                      )}

                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-2 sm:gap-0 border-t sm:border-t-0 border-border/50 pt-3 sm:pt-0">
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <p className="font-medium">
                        R{(parsePriceLabel(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={clearCart}
                className="mt-6 text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border rounded-lg p-4 sm:p-6 lg:sticky lg:sticky-below-nav lg:self-start">
                <h2 className="text-xl font-heading mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6 text-lg font-heading">
                  <span>Total</span>
                  <span>R{totalPrice.toFixed(2)}</span>
                </div>

                <Button onClick={handleCheckout} className="w-full mb-3">Proceed to Checkout</Button>
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
