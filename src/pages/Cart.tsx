import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isSignedIn) {
      navigate("/checkout");
    } else {
      // With Clerk, we can redirect or show the sign-in modal.
      // Since /login is removed, we just use navigate("/") or similar, 
      // but ideally we should trigger the Clerk sign-in.
      // For now, let's just go home if not signed in, or we could just let the checkout handle it.
      navigate("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-heading mb-4">Your Cart is Empty</h1>
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
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-heading mb-12">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border border-border rounded-lg hover:border-foreground transition-colors"
                  >
                    <div className="w-24 h-32 bg-secondary flex-shrink-0 rounded-md flex items-center justify-center overflow-hidden">
                      <img
                        src={item.frontImage}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-medium text-sm uppercase tracking-[0.1em]">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{item.price}</p>
                      {item.size && (
                        <p className="text-xs text-muted-foreground mt-2">Size: {item.size}</p>
                      )}

                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <p className="font-medium">
                        R{(parseFloat(item.price.replace("R", "").replace(",", "")) * item.quantity).toFixed(2)}
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
              <div className="border border-border rounded-lg p-6 sticky top-24">
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
