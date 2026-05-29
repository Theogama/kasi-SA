import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { isOrderPaid } from "@/lib/orders";
import { 
  CheckCircle2, 
  Truck, 
  Store, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  Phone, 
  User, 
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Clipboard,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface OrderDetails {
  id: string;
  order_number: string;
  total_amount: number;
  shipping_cost: number;
  shipping_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  customer_addresses?: {
    full_name: string;
    phone: string;
    street_address: string;
    city: string;
    province: string;
    postal_code: string;
  };
}

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("m_payment_id");

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Parse carrier type from order shipping method string
  const carrierType = useMemo(() => {
    if (!order) return "courier";
    const method = order.shipping_method.toLowerCase();
    if (method.includes("paxi") || method.includes("pep")) return "paxi";
    if (method.includes("pargo")) return "pargo";
    return "courier";
  }, [order]);

  useEffect(() => {
    const processSuccessfulOrder = async () => {
      if (!orderNumber) {
        setIsLoading(false);
        return;
      }

      try {
        const apiBase = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
        const statusResponse = await fetch(
          `${apiBase}/payment/payfast/status/${encodeURIComponent(orderNumber)}`
        );

        if (!statusResponse.ok) {
          throw new Error("Could not verify payment status yet.");
        }

        const statusPayload = await statusResponse.json();
        let dbOrder = statusPayload.order;

        if (!dbOrder) {
          const { data, error: fetchError } = await supabase
            .from("orders")
            .select("*, customer_addresses(*)")
            .eq("order_number", orderNumber)
            .maybeSingle();
          if (fetchError) throw fetchError;
          dbOrder = data;
        }
        
        if (!dbOrder) {
          setErrorMsg("Could not find order record in database.");
          setIsLoading(false);
          return;
        }

        if (!isOrderPaid(dbOrder.payment_status)) {
          setErrorMsg(
            "Your payment is not confirmed yet. Please wait a minute and refresh this page."
          );
        }

        setOrder(dbOrder);
        if (isOrderPaid(dbOrder.payment_status)) {
          clearCart();
        }
      } catch (err) {
        console.error("Error processing successful checkout session:", err);
        setErrorMsg(err instanceof Error ? err.message : "An error occurred during order confirmation");
      } finally {
        setIsLoading(false);
      }
    };

    processSuccessfulOrder();
  }, [orderNumber, clearCart]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Order number copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-grow pt-navbar pb-16 sm:pb-20">
        <div className="container mx-auto max-w-3xl">
          
          {isLoading ? (
            <Card className="p-12 text-center border border-border bg-card shadow-sm animate-pulse space-y-4">
              <div className="w-16 h-16 bg-secondary/50 rounded-full mx-auto animate-bounce" />
              <h2 className="text-2xl font-bold font-heading">Verifying Payment Transaction...</h2>
              <p className="text-sm text-muted-foreground">Securing transaction and generating shipment records in Supabase...</p>
            </Card>
          ) : errorMsg ? (
            <Card className="p-8 border border-red-200 bg-red-50/50 text-center space-y-4">
              <AlertCircle size={48} className="text-red-600 mx-auto" />
              <h2 className="text-2xl font-bold font-heading text-red-950">Payment Verification Failed</h2>
              <p className="text-sm text-red-900 leading-relaxed max-w-md mx-auto">{errorMsg}</p>
              <Button size="lg" onClick={() => navigate("/cart")} className="font-bold bg-red-900 hover:bg-red-950 text-white mt-4">
                Return to Cart
              </Button>
            </Card>
          ) : !order ? (
            <Card className="p-12 text-center border border-border bg-card shadow-sm space-y-6">
              <AlertCircle size={48} className="text-muted-foreground mx-auto" />
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground">Pending Payment Detected</h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                We did not receive a confirmed checkout trigger. If you cancelled your Payfast payment session, you can retry checkout by returning to your cart.
              </p>
              <div className="flex gap-4 items-center justify-center pt-2">
                <Button size="lg" onClick={() => navigate("/cart")} className="font-bold">
                  View Shopping Cart
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/")} className="font-bold">
                  Back to Shop
                </Button>
              </div>
            </Card>
          ) : (
            /* Premium Success Receipt Container */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              
              {/* Header Splash Card */}
              <Card className="p-5 sm:p-8 border border-border bg-secondary/15 flex flex-col items-center text-center overflow-hidden relative">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shadow-inner mb-4 animate-in zoom-in-50 duration-300">
                  <CheckCircle2 size={36} />
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-foreground">Order Confirmed</h1>
                <p className="text-muted-foreground text-sm max-w-md leading-relaxed mt-2">
                  Dankie! Thanks for supporting local style. Your order is secured and we are busy preparing your parcel.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 bg-background border border-border p-3 px-4 rounded-full shadow-sm text-xs font-semibold">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-bold text-foreground font-mono flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded">
                    {order.order_number}
                    <Clipboard size={14} className="text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => copyToClipboard(order.order_number)} />
                  </span>
                  <span className="hidden sm:inline text-muted-foreground/30">|</span>
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <strong className="text-foreground">R{order.total_amount.toFixed(2)}</strong>
                </div>
              </Card>

              {/* Carrier Specific Instruction Panel (Wow Aesthetic) */}
              <Card className={`p-6 border ${
                carrierType === "paxi" 
                  ? "border-amber-200 bg-amber-50/20" 
                  : carrierType === "pargo"
                    ? "border-blue-200 bg-blue-50/20"
                    : "border-emerald-200 bg-emerald-50/20"
              }`}>
                <div className="flex gap-4 items-start">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    carrierType === "paxi"
                      ? "bg-amber-100 text-amber-800"
                      : carrierType === "pargo"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {carrierType === "paxi" && <Store size={26} />}
                    {carrierType === "pargo" && <MapPin size={26} />}
                    {carrierType === "courier" && <Truck size={26} />}
                  </div>

                  <div className="space-y-3 flex-grow">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h2 className="text-lg font-heading font-bold text-foreground">
                          {carrierType === "paxi" && "PAXI PEP Store Click & Collect"}
                          {carrierType === "pargo" && "Pargo Retail PickUp Point"}
                          {carrierType === "courier" && "The Courier Guy Door-to-Door"}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Est. Shipping Time: 2-5 Business Days</p>
                      </div>
                      <Badge variant="outline" className={`font-bold capitalize py-1 px-3 ${
                        carrierType === "paxi"
                          ? "border-amber-300 bg-amber-50 text-amber-900"
                          : carrierType === "pargo"
                            ? "border-blue-300 bg-blue-50 text-blue-900"
                            : "border-emerald-300 bg-emerald-50 text-emerald-900"
                      }`}>
                        {order.order_status}
                      </Badge>
                    </div>

                    <div className="text-sm leading-relaxed text-foreground/90 space-y-2 border-t border-border/30 pt-3">
                      {carrierType === "paxi" && (
                        <>
                          <p>
                            Your parcel is headed to PEP Stores: <strong>{order.customer_addresses?.street_address.split(",")[0]}</strong>.
                          </p>
                          <p className="text-xs text-muted-foreground bg-amber-100/30 p-3 rounded-lg border border-amber-200/40">
                            📢 <strong>How Collection Works:</strong> Once the parcel lands at your selected store, PAXI will send a **Secure Collection PIN** via SMS to <strong>{order.customer_addresses?.phone}</strong>. Take your original ID/Passport and the PIN to PEP to collect. Keep this PIN safe!
                          </p>
                        </>
                      )}

                      {carrierType === "pargo" && (
                        <>
                          <p>
                            Your parcel is headed to: <strong>{order.customer_addresses?.street_address.split(",")[0]}</strong>.
                          </p>
                          <p className="text-xs text-muted-foreground bg-blue-100/30 p-3 rounded-lg border border-blue-200/40">
                            📢 <strong>How Collection Works:</strong> When the parcel arrives at Clicks/partner point, Pargo will trigger an SMS and email notification containing your **Collection Code**. Head to the collection desk, provide your code and ID to collect your parcel.
                          </p>
                        </>
                      )}

                      {carrierType === "courier" && (
                        <>
                          <p>
                            Your parcel will be delivered directly to: <strong>{order.customer_addresses?.street_address}</strong> in {order.customer_addresses?.city}.
                          </p>
                          <p className="text-xs text-muted-foreground bg-emerald-100/30 p-3 rounded-lg border border-emerald-200/40">
                            📢 <strong>How Delivery Works:</strong> The Courier Guy will transport this to your doorstep. Ensure someone is available at the address during business hours (8 AM - 5 PM). You will receive an SMS tracking code once the driver loads it onto their route.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Delivery & Billing Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <Card className="p-5 border border-border space-y-3 bg-card shadow-sm">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-2 border-b border-border/40">
                    <User size={14} /> Shipping Recipient
                  </h3>
                  <div>
                    <p className="font-bold text-base">{order.customer_addresses?.full_name}</p>
                    <p className="text-muted-foreground mt-1.5 flex items-center gap-2"><Phone size={14} /> {order.customer_addresses?.phone}</p>
                    <p className="text-muted-foreground flex items-center gap-2 mt-0.5"><ShieldCheck size={14} /> Checked out with secure Clerk auth</p>
                  </div>
                </Card>

                <Card className="p-5 border border-border space-y-3 bg-card shadow-sm">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-2 border-b border-border/40">
                    <Calendar size={14} /> Billing Breakdown
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping Fee:</span>
                      <span className="font-medium">
                        {order.shipping_cost === 0 ? "FREE" : `R${order.shipping_cost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-border/40">
                      <span>Total Charged:</span>
                      <span>R{order.total_amount.toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-none mt-1">Gateway Ref: Payfast Secure Instant EFT</p>
                  </div>
                </Card>
              </div>

              {/* Final Steps Checklist */}
              <Card className="p-6 border border-border space-y-4">
                <h3 className="font-heading font-extrabold text-lg flex items-center gap-1.5">
                  <ShoppingBag size={18} />
                  What Happens Next?
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                    <p className="text-muted-foreground"><strong className="text-foreground">Order packing</strong>: We print your receipt, select your premium kasi items, and package them with care (1 business day).</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                    <p className="text-muted-foreground"><strong className="text-foreground">Carrier Handover</strong>: We schedule collection with {order.shipping_method.split(" - ")[0]} and hand over your package.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                    <p className="text-muted-foreground"><strong className="text-foreground">SMS Tracking</strong>: You will receive notifications directly from the carrier when your package is in transit and arrived.</p>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center pt-4">
                <Button size="lg" onClick={() => navigate("/")} className="w-full sm:w-auto font-bold px-6 sm:px-8">
                  Continue Shopping
                  <ChevronRight size={16} className="ml-1" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/shop")} className="w-full sm:w-auto font-bold px-6 sm:px-8">
                  Browse Kasi Collection
                </Button>
              </div>

            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
