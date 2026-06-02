import { Link } from "react-router-dom";
import InfoPageLayout from "@/components/InfoPageLayout";

const Returns = () => {
  return (
    <InfoPageLayout
      eyebrow="Customer Service"
      title="Returns & Exchanges"
      description="We want you to love your Kasi SA gear. If something is not right, here is how returns and exchanges work."
    >
      <div className="space-y-10 text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">14-day return window</h2>
          <p>
            You may return eligible items within <strong className="text-foreground">14 days</strong> of delivery
            for a refund or exchange, provided the item meets the conditions below.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">Eligible items</h2>
          <ul className="space-y-3 ml-1">
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Unworn, unwashed, and in the same condition you received it</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Original tags attached</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>In original packaging where applicable</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">Non-returnable items</h2>
          <p className="mb-3">We cannot accept returns for:</p>
          <ul className="space-y-3 ml-1">
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Items worn, washed, or damaged by the customer</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Items returned after the 14-day window</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Final-sale or clearance items (if marked as such at purchase)</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">How to start a return</h2>
          <ol className="space-y-4 list-decimal list-inside">
            <li>
              Email{" "}
              <a href="mailto:hello@kasisastreet.co.za" className="text-foreground underline hover:no-underline">
                hello@kasisastreet.co.za
              </a>{" "}
              with your order number, the item(s) you wish to return, and whether you prefer a refund or
              exchange.
            </li>
            <li>We will confirm eligibility and send return instructions within 1–2 business days.</li>
            <li>Pack the item securely and ship it back using the method we provide. Do not send returns
              without approval—we cannot guarantee processing of unsolicited parcels.</li>
          </ol>
          <p className="mt-4">
            You can also use our{" "}
            <Link to="/contact" className="text-foreground underline hover:no-underline">
              contact form
            </Link>{" "}
            and select &quot;Returns &amp; Exchanges&quot; as the subject.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">Refunds</h2>
          <p>
            Once we receive and inspect your return, approved refunds are processed to your original payment
            method within <strong className="text-foreground">5–10 business days</strong>. Bank processing times
            may vary. Shipping fees are non-refundable unless the return is due to our error (wrong item, defect,
            etc.).
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">Exchanges</h2>
          <p>
            To exchange for a different size, contact us with your order details. If your preferred size is in
            stock, we will arrange the swap after receiving your original item. Price differences for
            exchanges to a higher-value product may require an additional payment.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">Faulty or wrong items</h2>
          <p>
            If you received the wrong product or a manufacturing defect, contact us within 48 hours of delivery
            with photos. We will arrange a replacement or full refund, including return shipping where
            applicable.
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default Returns;
