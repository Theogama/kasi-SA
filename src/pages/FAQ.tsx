import { Link } from "react-router-dom";
import InfoPageLayout from "@/components/InfoPageLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shippingCarriers";

const faqs = [
  {
    id: "shipping-time",
    question: "How long does shipping take?",
    answer: (
      <>
        Processing takes 1–2 business days after payment. Delivery depends on your carrier: The Courier Guy
        (2–3 days), Pargo (2–4 days), or PAXI at PEP Stores (3–5 days). See our{" "}
        <Link to="/shipping" className="text-foreground underline hover:no-underline">
          shipping info
        </Link>{" "}
        for full details.
      </>
    ),
  },
  {
    id: "free-shipping",
    question: "Do you offer free shipping?",
    answer: `Yes. Orders of R${FREE_SHIPPING_THRESHOLD.toLocaleString()} or more (before shipping) qualify for free standard courier delivery at checkout.`,
  },
  {
    id: "where-ship",
    question: "Do you ship internationally?",
    answer:
      "Not at the moment—we deliver within South Africa only. We are focused on serving our local community with reliable township-friendly delivery options.",
  },
  {
    id: "paxi-pin",
    question: "How does PAXI collection at PEP work?",
    answer:
      "Choose PAXI at checkout and select your PEP Store. When your parcel arrives, PAXI sends an SMS with a secure collection PIN to the phone number you provided. Take your ID and the PIN to that PEP Store to collect. Never share your PIN.",
  },
  {
    id: "returns",
    question: "What is your return policy?",
    answer: (
      <>
        Returns are accepted within 14 days if items are unworn, unwashed, and in original packaging with tags
        attached. Read the full policy on our{" "}
        <Link to="/returns" className="text-foreground underline hover:no-underline">
          returns page
        </Link>
        .
      </>
    ),
  },
  {
    id: "track-order",
    question: "How do I track my order?",
    answer: (
      <>
        After checkout, sign in and visit{" "}
        <Link to="/orders" className="text-foreground underline hover:no-underline">
          My Orders
        </Link>{" "}
        for status updates. You will also receive email updates when your parcel ships.
      </>
    ),
  },
  {
    id: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept secure payments via Payfast, including card (Visa, Mastercard, Amex), Instant EFT, and SnapScan. All transactions are processed over encrypted connections.",
  },
  {
    id: "sizing",
    question: "How do I choose the right size?",
    answer:
      "Each product page includes size guidance where available. If you are between sizes, we generally recommend sizing up for a relaxed streetwear fit. Contact us before ordering if you need help.",
  },
  {
    id: "wholesale",
    question: "Do you offer bulk or wholesale orders?",
    answer: (
      <>
        Yes. Email{" "}
        <a href="mailto:hello@kasisastreet.co.za" className="text-foreground underline hover:no-underline">
          hello@kasisastreet.co.za
        </a>{" "}
        or use the contact form with subject &quot;Wholesale / Bulk Orders&quot; for a custom quote.
      </>
    ),
  },
  {
    id: "collab",
    question: "Can I collaborate with Kasi SA Streetwear?",
    answer:
      "We welcome collaborations with artists, creators, and brands aligned with township culture. Reach out via our contact page with your idea and links to your work.",
  },
];

const FAQ = () => {
  return (
    <InfoPageLayout
      eyebrow="Help Centre"
      title="FAQ"
      description="Quick answers about orders, shipping, returns, and shopping with Kasi SA Streetwear."
    >
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="font-heading text-left text-base sm:text-lg hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="mt-10 text-muted-foreground text-center text-sm">
        Still need help?{" "}
        <Link to="/contact" className="text-foreground underline hover:no-underline">
          Contact us
        </Link>
      </p>
    </InfoPageLayout>
  );
};

export default FAQ;
