import { Link } from "react-router-dom";
import InfoPageLayout from "@/components/InfoPageLayout";
import { CARRIERS, FREE_SHIPPING_THRESHOLD } from "@/lib/shippingCarriers";
import { Package, Truck, Store, MapPin } from "lucide-react";

const carrierIcons: Record<string, React.ReactNode> = {
  Truck: <Truck size={20} />,
  Store: <Store size={20} />,
  MapPin: <MapPin size={20} />,
};

const ShippingInfo = () => {
  return (
    <InfoPageLayout
      eyebrow="Delivery"
      title="Shipping Info"
      description="We deliver across South Africa with partners built for township and urban delivery—from your door to your nearest PEP or Pargo pickup point."
    >
      <div className="space-y-10 text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">Where we ship</h2>
          <p>
            Kasi SA Streetwear currently ships within <strong className="text-foreground">South Africa only</strong>.
            All prices on our site are in South African Rand (ZAR).
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">Processing time</h2>
          <p>
            Orders are packed within <strong className="text-foreground">1–2 business days</strong> after payment
            is confirmed. You will receive an email once your order has been handed to the courier. Delivery
            times below are estimates from handover and exclude weekends and public holidays.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-6">Shipping methods</h2>
          <p className="mb-6">
            Choose your preferred carrier at checkout. Rates below apply when your cart is under{" "}
            <strong className="text-foreground">R{FREE_SHIPPING_THRESHOLD.toLocaleString()}</strong>.
          </p>
          <ul className="space-y-4">
            {CARRIERS.map((carrier) => (
              <li
                key={carrier.id}
                className="border border-border rounded-lg p-5 hover:border-foreground transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0">
                    {carrierIcons[carrier.icon] ?? <Package size={20} />}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-foreground">{carrier.name}</h3>
                    <p className="text-sm mt-1">{carrier.description}</p>
                    <p className="text-sm mt-2">
                      <span className="text-foreground font-medium">R{carrier.price}</span>
                      {" · "}
                      Est. {carrier.estimatedDays}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-border rounded-lg p-6 bg-secondary/30">
          <h2 className="text-2xl font-heading text-foreground mb-3">Free shipping</h2>
          <p>
            Spend <strong className="text-foreground">R{FREE_SHIPPING_THRESHOLD.toLocaleString()} or more</strong>{" "}
            on merchandise (before shipping) and standard courier delivery is free. The discount is applied
            automatically at checkout when you qualify.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">PAXI (PEP Stores) collection</h2>
          <p>
            If you select PAXI, your parcel is sent to your chosen PEP Store. PAXI will SMS a{" "}
            <strong className="text-foreground">secure collection PIN</strong> to the mobile number you provide at
            checkout. Bring that PIN and your original ID or passport to collect your order. Keep your PIN
            private—do not share it with anyone.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">Pargo pickup</h2>
          <p>
            Pargo deliveries go to your selected partner point (e.g. Clicks or FreshStop). You will receive
            collection instructions via SMS or email from Pargo once your parcel is ready.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">Tracking your order</h2>
          <p>
            Signed-in customers can view order status on the{" "}
            <Link to="/orders" className="text-foreground underline hover:no-underline">
              My Orders
            </Link>{" "}
            page after checkout. Tracking details are shared by email when your parcel is in transit.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">Questions?</h2>
          <p>
            Email{" "}
            <a href="mailto:hello@kasisastreet.co.za" className="text-foreground underline hover:no-underline">
              hello@kasisastreet.co.za
            </a>{" "}
            or visit our{" "}
            <Link to="/contact" className="text-foreground underline hover:no-underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default ShippingInfo;
