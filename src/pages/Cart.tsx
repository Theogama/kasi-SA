import { useEffect, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { reconcileCartWithDatabase } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, LogIn, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useClerk } from "@clerk/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { DEFAULT_SIZES, cartItemHasSize, parsePriceLabel } from "@/lib/products";
import { useProducts } from "@/hooks/useProducts";

const Cart = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    updateItemSize,
    clearCart,
    replaceItems,
    totalPrice,
    allItemsHaveSize,
  } = useCart();
  const { products } = useProducts();
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

  const sizesByProductId = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const product of products) {
      map.set(product.id, product.sizes);
    }
    return map;
  }, [products]);

  const getSizesForItem = (productId: string) =>
    sizesByProductId.get(productId) ?? DEFAULT_SIZES;

  const missingSizeCount = items.filter((item) => !cartItemHasSize(item.size)).length;

  const handleCheckout = () => {
    if (!allItemsHaveSize) {
      toast.error("Select a size for each item", {
        description: `${missingSizeCount} item${missingSizeCount === 1 ? "" : "s"} still need a size before checkout.`,
        icon: <AlertCircle size={16} />,
      });
      return;
    }

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

          {!allItemsHaveSize && (
            <div
              role="alert"
              className="mb-6 flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p>
                Please select a size for each item below before proceeding to checkout.
              </p>
            </div>
          )}

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

                      <div className="mt-4">
                        <label className="text-xs font-medium uppercase tracking-wider mb-2 block">
                          {cartItemHasSize(item.size) ? "Size" : "Select size"}{" "}
                          {!cartItemHasSize(item.size) && (
                            <span className="text-destructive normal-case tracking-normal">(required)</span>
                          )}
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                          {getSizesForItem(item.id).map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => updateItemSize(item.id, item.size, size)}
                              className={`py-2 px-2 border rounded-md font-medium text-xs transition-all ${
                                item.size === size
                                  ? "bg-foreground text-background border-foreground"
                                  : "border-border hover:border-foreground"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

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

                <Button
                  onClick={handleCheckout}
                  className="w-full mb-3"
                  disabled={!allItemsHaveSize}
                >
                  Proceed to Checkout
                </Button>
                {!allItemsHaveSize && (
                  <p className="text-xs text-muted-foreground text-center mb-3 -mt-1">
                    Select a size for all items to continue
                  </p>
                )}
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
