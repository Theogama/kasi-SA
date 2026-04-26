import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const success = searchParams.get("success") === "true";
  const orderId = searchParams.get("m_payment_id");

  useEffect(() => {
    if (success && orderId) {
      clearCart();
      setOrderConfirmed(true);
    }
  }, [clearCart, success, orderId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block rounded-3xl border border-border bg-secondary/50 p-12 shadow-sm">
            {orderConfirmed ? (
              <>
                <h1 className="text-5xl font-heading mb-6">Order Confirmed</h1>
                <p className="text-lg text-muted-foreground mb-4">
                  Thanks for your purchase! Your order has been received and is now being processed.
                </p>
                <p className="text-sm text-muted-foreground mb-10">
                  Order reference: <span className="font-medium">{orderId}</span>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-5xl font-heading mb-6">Order Status Pending</h1>
                <p className="text-lg text-muted-foreground mb-10">
                  No confirmed payment was detected for this page. Please complete the checkout process or return to your cart.
                </p>
              </>
            )}

            <div className="flex flex-col gap-4 sm:flex-row items-center justify-center">
              <Button size="lg" onClick={() => navigate("/")}>Continue Shopping</Button>
              <Button variant="outline" size="lg" onClick={() => navigate(orderConfirmed ? "/shop" : "/cart")}>{orderConfirmed ? "Browse More" : "View Cart"}</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
