import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

const Checkout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // With Clerk, we might want to use a redirect or Clerk's SignIn component,
      // but for now, we'll keep the navigation logic if there's a custom login page or use Clerk's modal
      // Since we removed /login route, we should probably redirect to home or open Clerk modal.
      // However, usually you'd wrap this page in <SignedIn> or similar.
      navigate("/"); 
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex text-center items-center justify-center">
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!isSignedIn) return null;

  // Map Clerk user to the structure expected by the form
  const displayUser = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: user?.primaryPhoneNumber?.phoneNumber || ""
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 text-center container mx-auto px-6">
          <h1 className="text-4xl font-heading mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add items to purchase.</p>
          <Button onClick={() => navigate("/")} size="lg">Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const merchantId = import.meta.env.VITE_PAYFAST_MERCHANT_ID;
  const merchantKey = import.meta.env.VITE_PAYFAST_MERCHANT_KEY;
  const payfastMode = import.meta.env.VITE_PAYFAST_MODE || "live";
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const isLocalHost = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");
  const useSandboxForLocal = payfastMode === "live" && isLocalHost;
  const payfastUrl = useSandboxForLocal
    ? "https://sandbox.payfast.co.za/eng/process"
    : payfastMode === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

  // Debug: Log env vars to verify they're loaded
  useEffect(() => {
    console.log("Payfast Config:", {
      merchantId,
      merchantKey,
      payfastMode,
      baseUrl,
      payfastUrl,
    });
  }, [merchantId, merchantKey, payfastMode, baseUrl, payfastUrl]);

  const handlePayfastSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!merchantId || !merchantKey) {
      event.preventDefault();
      alert("Error: Payfast credentials are not configured. Please contact support.");
      return;
    }
    setIsSubmitting(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-heading mb-8">Secure Checkout</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading mb-4">Order Summary</h2>
              <Card className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-secondary rounded overflow-hidden flex-shrink-0">
                        <img src={item.frontImage} alt={item.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}{item.size && ` | Size: ${item.size}`}</p>
                      </div>
                    </div>
                    <p className="font-medium text-sm">
                      R{(parseFloat(item.price.replace("R", "").replace(",", "")) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="pt-4 border-t border-border mt-4">
                  <div className="flex justify-between text-lg font-heading font-bold">
                    <span>Total</span>
                    <span>R{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Payment Details Form */}
            <div>
              <h2 className="text-2xl font-heading mb-4">Payment Info</h2>
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Billing Details</h3>
                  <p className="text-sm text-muted-foreground">Name: {displayUser.firstName} {displayUser.lastName}</p>
                  <p className="text-sm text-muted-foreground">Email: {displayUser.email}</p>
                  {displayUser.phone && <p className="text-sm text-muted-foreground">Phone: {displayUser.phone}</p>}
                </div>

                <div className="flex items-center gap-2 mb-6 text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
                  <ShieldCheck size={20} className="text-green-600" />
                  <span>Secure payment processed by Payfast</span>
                </div>

                {useSandboxForLocal && (
                  <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                    Live Payfast is not fully supported on localhost. Using Payfast sandbox for this checkout session.
                  </div>
                )}

                {(!merchantId || !merchantKey) && (
                  <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
                    ⚠️ Payfast credentials not found. Please restart the dev server or check your .env.local file. Check browser console for details.
                  </div>
                )}

                <form action={payfastUrl} method="POST" onSubmit={handlePayfastSubmit}>
                  {/* Payfast Required Fields */}
                  <input type="hidden" name="merchant_id" value={merchantId} />
                  <input type="hidden" name="merchant_key" value={merchantKey} />
                  <input type="hidden" name="return_url" value={`${baseUrl}/checkout/success`} />
                  <input type="hidden" name="cancel_url" value={`${baseUrl}/cart`} />
                  <input type="hidden" name="notify_url" value={`${baseUrl}/api/payfast/notify`} />
                  
                  {/* Customer Details */}
                  <input type="hidden" name="name_first" value={displayUser.firstName} />
                  <input type="hidden" name="name_last" value={displayUser.lastName} />
                  <input type="hidden" name="email_address" value={displayUser.email} />
                  
                  <input type="hidden" name="m_payment_id" value={`ORD-${Date.now()}`} />
                  <input type="hidden" name="amount" value={totalPrice.toFixed(2)} />
                  <input type="hidden" name="item_name" value="Kasi Street Style Order" />

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Redirecting to Payfast..." : `Pay R${totalPrice.toFixed(2)} Now`}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
